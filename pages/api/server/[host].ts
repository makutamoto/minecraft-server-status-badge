import { NextApiRequest, NextApiResponse } from 'next';

import { fetchStatus } from '../../../lib/minecraft';

export interface Online {
    max: number,
    online: number,
}

const DEFAULT_PORT = 25565;

const json = (version: string | null, online: Online | null) => ({
    schemaVersion: 1,
    label: 'Minecraft' + (version === null ? '' : ` ${version}`),
    message: online === null ? 'Offline' : `${online.online}/${online.max}`,
    color: online === null ? 'red' : 'green',
});

export default async function(req: NextApiRequest, res: NextApiResponse) {
    let host = req.query.host as string;
    let port = req.query.port === undefined ? DEFAULT_PORT : Number(req.query.port as string);
    let status = await fetchStatus(-1, host, port);
    let online: Online = status && status.players;
    let version = status && status.version.name;
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(JSON.stringify(json(version, online)));
}
