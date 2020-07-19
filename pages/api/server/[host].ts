import { NextApiRequest, NextApiResponse } from 'next';

import { fetchStatus } from '../../../lib/minecraft';

export interface Online {
    max: number,
    online: number,
}

const json = (host: string, online: Online | null) => ({
    schemaVersion: 1,
    label: host,
    message: online === null ? 'Offline' : `${online.online}/${online.max}`,
    color: online === null ? 'red' : 'green',
    cacheSeconds: 1800,
});

export default async function(req: NextApiRequest, res: NextApiResponse) {
    let host = req.query.host as string;
    let status = await fetchStatus(-1, host, 25565);
    let online: Online = status && status.players;
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(JSON.stringify(json(host, online)));
}
