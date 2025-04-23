import { PluginFunction } from '@zenstackhq/sdk';
import * as fs from 'fs-extra';
import path from 'path';

// esempio di plugin che genera interfacce TypeScript per i modelli Prisma, ma non server perchè si possono
// referenziare direttamente i modelli Prisma da node_modules/.prisma/client

const plugin: PluginFunction = async (model, options, dmmf) => {
  const outputDir = path.resolve(process.cwd(), '../frontend/src/_generated/types');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const modelDef of dmmf.datamodel.models) {
    const modelName = modelDef.name;
    const fields = modelDef.fields
      .map(field => {
        const tsType = mapPrismaTypeToTS(field.type);
        return `    ${field.name}: ${tsType};`;
      })
      .join('\n');

    const content = `export interface ${modelName} {\n${fields}\n}`;
    fs.writeFileSync(path.join(outputDir, `${modelName}.ts`), content, 'utf8');
  }

  console.log(`✅ ZenStack Type Generator: TypeScript interfaces generated in "shared/types".`);
};

// Funzione di mapping da Prisma a TypeScript
function mapPrismaTypeToTS(prismaType: string): string {
  const typeMapping: Record<string, string> = {
    String: 'string',
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',
    DateTime: 'Date',
    Json: 'any',
    // Se necessario, aggiungi altri tipi
  };

  return typeMapping[prismaType] || prismaType; // Default: Prisma enum o custom type
}

export default plugin;
