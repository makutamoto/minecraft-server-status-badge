import net from 'net';

const HANDSHAKE_STATUS_STATE = 0x01;

export interface Packet {
    length: number,
    id: number,
}

export interface Status {
    version: {
        name: string,
        protocol: number,
    },
    players: {
        max: number,
        online: number,
        sample: {
            name: string,
            id: string,
        }[],
    },
    description: {
        text: string,
    },
    favicon: string,
}

const TIMEOUT = 1000;

export function NumberToVarNumber(data: number): Buffer {
    let res = Buffer.alloc(0);
    while(true) {
        const byte = Buffer.alloc(1);
        byte[0] = data & 0b01111111;
        data >>>= 7;
        if(data !== 0) byte[0] |= 0b10000000;
        res = Buffer.concat([res, byte]);
        if(data === 0) break;
    }
    return res;
}

export function VarNumberToNumber(buffer: Buffer): [number, Buffer] {
    let res = 0;
    let i = 0;
    for(;;i++) {
        let byte = buffer[i];
        res |= (byte & 0b01111111) << 7 * i;
        if(byte >>> 7 ^ 1) break;
    }
    let slice = buffer.slice(i + 1);
    return [res, slice];
}

export function StringToVarString(data: string): Buffer {
    const len = NumberToVarNumber(data.length);
    const string = Buffer.from(data);
    const res = Buffer.concat([len, string]);
    return res;
}

export function VarStringToString(buffer: Buffer): [string, Buffer] {
    const [len, buf] = VarNumberToNumber(buffer);
    const string = buf.slice(0, len).toString();
    const res = buf.slice(len);
    return [string, res];
}

export function NumberToUnsignedShort(data: number): Buffer {
    const res = Buffer.alloc(2);
    res.writeUInt16BE(data);
    return res;
}

export function UnsignedShortToNumber(buffer: Buffer): [number, Buffer] {
    const number = buffer.readUInt16BE();
    const res = buffer.slice(2);
    return [number, res];
}

export function Handshake(version: number, host: string, port: number, next: number): Buffer {
    const protocol_version = NumberToVarNumber(version);
    const server_address = StringToVarString(host);
    const server_port = NumberToUnsignedShort(port);
    const next_state = NumberToVarNumber(next);
    const res = Buffer.concat([protocol_version, server_address, server_port, next_state]);
    return res;
}

export function Packet(id: number, data: Buffer): Buffer {
    const packet_id = NumberToVarNumber(id);
    const length = NumberToVarNumber(packet_id.length + data.length);
    const res = Buffer.concat([length, packet_id, data]);
    return res;
}

export function Unpack(buffer: Buffer): [Packet, Buffer] {
    const [len, buf] = VarNumberToNumber(buffer);
    const [id, data] = VarNumberToNumber(buf);
    const res: Packet = { length: len - buffer.length + buf.length, id };
    return [res, data];
}

export async function fetchStatus(version: number, host: string, port: number): Promise<Status | null> {
    return new Promise((resolve) => {
        try {
            const client = net.connect(port, host, () => {
                let packet: Packet | null = null;
                let data = Buffer.alloc(0);
                client.on('data', (part) => {
                    if(packet === null) [packet, part] = Unpack(part);
                    data = Buffer.concat([data, part]);
                    if(data.length >= packet.length) {
                        try {
                            let [json,] = VarStringToString(data);
                            let status: Status = JSON.parse(json);
                            client.destroy();
                            resolve(status);
                        } catch(e) {
                            console.error(e);
                            resolve(null);
                        }
                    }
                });
                const handshake = Handshake(version, host, port, HANDSHAKE_STATUS_STATE);
                const handshake_packet = Packet(0x00, handshake);
                client.write(handshake_packet, () => {
                    const status = Packet(0x00, Buffer.alloc(0));
                    client.write(status);
                });
            });
            client.once('error', (err) => {
                console.error(err);
                client.destroy();
                resolve(null);
            });
            client.setTimeout(TIMEOUT, () => {
                client.destroy();
                resolve(null);
            });
        } catch(e) {
            console.error(e);
            resolve(null);
        }
    });
}
