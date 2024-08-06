import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';
import { fileURLToPath } from 'url';
import { ModuleFallbackServer } from './moduleFallbackServer.mjs';

const moduleFallbackServer = new ModuleFallbackServer(8888);

await moduleFallbackServer.start();

const workerdBinary = fileURLToPath(
    new URL('../bin/workerd', import.meta.resolve('workerd'))
)

const workerdProcess = spawn(workerdBinary, ['serve', '--experimental', 'src/config.capnp'], { stdio: 'inherit' });

// let's wait for workerd to be ready (there must be a better way to do this, but here this is good enough)
await setTimeout(1000);

const workerdResp = await fetch('http://localhost:8080').then(res => res.text());

console.log('Response from workerd:');
console.log(`\x1b[34m${workerdResp}\x1b[0m`);

workerdProcess.kill();

await moduleFallbackServer.stop();