import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import Head from 'next/head';
import { Button, Form } from 'react-bootstrap';

import Copy from '../components/Copy';
import Input from '../components/Input';

const API_ORIGIN = 'https://minecraft-server-status-badge.vercel.app';

const DEFAULT_HOST = 'minecraft.makutamoto.com';
const DEFAULT_PORT = '25565';

const AUTHOR_TWITTER = 'https://twitter.com/makutamoto';
const GITHUB_REPOSITORY = 'https://github.com/makutamoto/minecraft-server-status-badge';

const displayAddress = (host: string, port: string) => host + (port === '25565' ? '' : `:${port}`);
const dataLink = (host: string, port: string) => API_ORIGIN + `/api/server/${host}?port=${port}`;
const shieldsioLink = (link: string) => `https://img.shields.io/endpoint?url=${encodeURIComponent(link)}`;

const html = (host: string, badge: string) => `<img src="${badge}" title="${host}" />`;
const markdown = (host: string, badge: string) => `![${host}](${badge})`;

export default function() {
    const [host, setHost] = useState(DEFAULT_HOST);
    const onHostChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setHost(e.currentTarget.value), []);
    const [port, setPort] = useState(DEFAULT_PORT);
    const onPortChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setPort(e.currentTarget.value), []);
    const [badgeHost, setBadgeHost] = useState(displayAddress(DEFAULT_HOST, DEFAULT_PORT));
    const [badge, setBadge] = useState(shieldsioLink(dataLink(DEFAULT_HOST, DEFAULT_PORT)));
    const onClick = useCallback((e: FormEvent) => {
        e.preventDefault();
        setBadgeHost(displayAddress(host, port));
        setBadge(shieldsioLink(dataLink(host, port)));
    }, [host, port]);
    return (
        <>
            <Head>
                <title>Minecraft Server Status Badge</title>
            </Head>
            <h2>Minecraft Server Status Badge</h2>
            <p>
                Minecraftのサーバーのステータスを表示できるバッジを生成します。
            </p>
            <ul>
                <li>
                    このサイトのGitHubリポジトリ:
                    <a href={GITHUB_REPOSITORY}>{GITHUB_REPOSITORY}</a>
                </li>
                <li>
                    作者Twitter:
                    <a href={AUTHOR_TWITTER}>{AUTHOR_TWITTER}</a>
                </li>
            </ul>
            <Form>
                <Form.Group>
                    <Input title="Address" type="text" placeholder="minecraft.makutamoto.com..." value={host} onChange={onHostChange} />
                    <Input title="Port" type="number" placeholder="25565..." value={port} onChange={onPortChange} />
                    <Button className="my-2" type="submit" onClick={onClick}>Generate</Button>
                </Form.Group>
            </Form>
            <hr />
            <Copy title="HTML" value={html(badgeHost, badge)} />
            <Copy title="Markdown" value={markdown(badgeHost, badge)} />
            <h3>Preview</h3>
            <img src={badge} title={badgeHost} />
        </>
    );
}
