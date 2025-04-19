import { type PluginOptions } from '@zenstackhq/sdk';
import { DataModel, isDataModel, type Model } from '@zenstackhq/sdk/ast';
import * as fs from 'fs-extra';

// esempio di plugin che analizza i DataModel e li salva in file JSON

function _stringify(obj: any, depth: number = 0, maxDepth: number = 10, seen: Set<any> = new Set()): any {
  if (depth > maxDepth) return '[*Max Depth Reached*]';
  if (obj === null) return '[*Null*]';
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'undefined') {
    return obj;
  } else {
    if (seen.has(obj)) {
      return `[*Circular* > ${obj.$type || '?'}::${obj.name || '?'}]`;
    }
    seen.add(obj);
    if (Array.isArray(obj)) {
      const resultArr: any[] = [];
      for (const item of obj) {
        try {
          resultArr.push(_stringify(item, depth + 1, maxDepth, seen));
        } catch (err) {
          resultArr.push(`[*Err: ${err.message}]`);
        }
      }
      return resultArr;
    } else if (typeof obj === 'object') {
      const result: any = {};

      for (const [key, value] of Object.entries(obj)) {
        try {
          result[key] = _stringify(value, depth + 1, maxDepth, seen);
        } catch (err) {
          result[key] = `[*Err: ${err.message}]`;
        }
      }

      return result;
    } else {
      return `[*type:${typeof obj}]`;
    }
  }
}

function stringify(obj: any): string {
  return JSON.stringify(_stringify(obj), null, 2);
}

async function analyzeDataModel(dm: DataModel) {
  try {
    await fs.writeFile(`./zmodels/${dm.name}.zmodel.json`, stringify(dm));
  } catch (error) {
    console.log('DataModel:', dm.name);
    console.error('Error writing JSON file:', error.message);
  }
}

export default async function run(model: Model, options: PluginOptions) {
  console.log(`\nOptions: ${stringify(options)}`);
  await fs.ensureDir('./zmodels');

  const dataModels = model.declarations.filter((x): x is DataModel => isDataModel(x));

  for (const dm of dataModels) await analyzeDataModel(dm);
}
