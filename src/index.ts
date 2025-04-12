import { resolvePath, type PluginOptions } from '@zenstackhq/sdk';
import { DataModel, isDataModel, type Model } from '@zenstackhq/sdk/ast';
import * as fs from 'fs-extra';
import { writeFile } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const name = 'ZenStack Simply Direct Plugin';


export default async function run(model: Model, options: PluginOptions) {
    
    if (process.env.DISABLE_ZENSTACK_MD === 'true' || options.disable) return;

    console.log(`${name} started...`);
    
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