import { resolvePath, type PluginOptions } from '@zenstackhq/sdk';
import { type Model } from '@zenstackhq/sdk/ast';
import * as fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

export const name = 'ZenStack Simply Direct Plugin';


export default async function run(model: Model, options: PluginOptions) {
    
    if (process.env.DISABLE_ZENSTACK_MD === 'true' || options.disable) return;

    const dirname1 = path.join(__dirname, './');
    const filename = path.join(__filename, './');
    const processcwd = path.join(process.cwd(), './');
    const dirname2 = path.dirname(__filename);

    console.log(`\r${name} started...`);

    console.log("dirname1",dirname1);
    console.log("filename",filename);
    console.log("processcwd",processcwd);
    console.log("dirname2",dirname2);
    
    let backendFolder = (options.backendFolder as string) ?? './';
    let frontendFolder = (options.frontendFolder as string) ?? '../frontend';

    backendFolder = resolvePath(backendFolder, options);
    frontendFolder = resolvePath(frontendFolder, options);

    console.log('Backend Folder: ' + backendFolder);
    console.log('Frontend Folder: ' + frontendFolder);

    if(!await fs.exists(backendFolder)) throw new Error('Backend Folder does not exist');
    if(!await fs.exists(frontendFolder)) throw new Error('Frontend Folder does not exist');

    const executionLogFileBackend = path.join(backendFolder, `__${name}.log`);
    const executionLogFileFrontend = path.join(frontendFolder, `__${name}.log`);
    
    await fs.writeJSON(executionLogFileBackend, {
        ts: new Date().toISOString(),
    })

    await fs.writeJSON(executionLogFileFrontend, {
        ts: new Date().toISOString(),
    })
    
    console.log(`${name} executed successfully!`);
}