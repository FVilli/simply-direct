import { resolvePath, type PluginOptions } from '@zenstackhq/sdk';
import { DataModel, isAbstractDeclaration, isDataModel, type Model } from '@zenstackhq/sdk/ast';
import * as fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

export const name = 'ZenStack Simply Direct Plugin';


export default async function run(model: Model, options: PluginOptions) {
    
    if (process.env.DISABLE_ZENSTACK_MD === 'true' || options.disable) return;

    const resources = path.join(__dirname, '../resources');
    // const filename = path.join(__filename, './');
    // const processcwd = path.join(process.cwd(), './');
    // const dirname2 = path.dirname(__filename);

    console.log(`\r${name} started...`);

    // console.log("dirname1",dirname1);
    // console.log("filename",filename);
    // console.log("processcwd",processcwd);
    // console.log("dirname2",dirname2);
    
    let backendFolder = (options.backendFolder as string) ?? './';
    let frontendFolder = (options.frontendFolder as string) ?? '../frontend';

    backendFolder = resolvePath(backendFolder, options);
    frontendFolder = resolvePath(frontendFolder, options);

    console.log('Backend Folder: ' + backendFolder);
    console.log('Frontend Folder: ' + frontendFolder);

    if(!await fs.exists(backendFolder)) throw new Error('Backend Folder does not exist');
    if(!await fs.exists(frontendFolder)) throw new Error('Frontend Folder does not exist');

    const zmodelFile = path.join(backendFolder, `schema.zmodel`);

    await saveResourceIfNotExists("base.zmodel",resources,backendFolder);
    await saveResourceIfNotExists("user.zmodel",resources,backendFolder);
    await saveResourceIfNotExists("client.zmodel",resources,backendFolder);

    const executionLogFileBackend = path.join(backendFolder, `__${name}.log`);
    const executionLogFileFrontend = path.join(frontendFolder, `__${name}.log`);
    
    await fs.writeJSON(executionLogFileBackend, {
        ts: new Date().toISOString(),
    })

    await fs.writeJSON(executionLogFileFrontend, {
        ts: new Date().toISOString(),
    })

    const dataModels = model.declarations.filter((x): x is DataModel => isDataModel(x));

  for (const dm of dataModels) {
    console.log(dm.name);
  }

  const zmodel = await fs.readFile(zmodelFile);
  console.log("-----------------------------------------------------");
  console.log(zmodel);
  console.log("-----------------------------------------------------");
    
  console.log(`${name} executed successfully!`);
}

async function saveResourceIfNotExists(file: string, sourceFolder: string, destFolder: string) {
    const source = path.join(sourceFolder,file);
    const dest = path.join(destFolder,file);
    if(!(await fs.exists(dest))) await fs.copyFile(source,dest);
}
