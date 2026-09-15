import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, 'src/fs-base-icons.tsx');
const barrelPath = path.join(projectRoot, 'node_modules/lucide-react/dist/esm/lucide-react.mjs');
const outputPath = path.join(projectRoot, 'src/fs-icon-nodes.generated.ts');

const [source, barrel] = await Promise.all([
  fs.readFile(sourcePath, 'utf8'),
  fs.readFile(barrelPath, 'utf8')
]);

const iconNames = [...new Set(
  [...source.matchAll(/\['[^']+', '([^']+)'\]/g)].map((match) => match[1])
)].sort();

const exportToFile = new Map();
for (const match of barrel.matchAll(/export \{ ([^}]+) \} from '(\.\/icons\/[^']+)'/g)) {
  for (const item of match[1].split(', ')) {
    const aliasMatch = item.match(/^default as (.+)$/);
    if (aliasMatch) exportToFile.set(aliasMatch[1], match[2]);
  }
}

const nodes = {};
for (const iconName of iconNames) {
  const relativeFile = exportToFile.get(iconName);
  if (!relativeFile) throw new Error(`Cannot resolve Lucide icon: ${iconName}`);
  const absoluteFile = path.join(path.dirname(barrelPath), relativeFile);
  const module = await import(pathToFileURL(absoluteFile).href);
  if (!module.__iconNode) throw new Error(`Lucide icon has no __iconNode export: ${iconName}`);
  nodes[iconName] = module.__iconNode;
}

const output = `/**\n * Generated from lucide-react v1.14.0 icon nodes.\n * Lucide is licensed under the ISC License: https://lucide.dev/license\n * Run: node scripts/generate-fs-icon-nodes.mjs\n */\nexport type FsIconNode = readonly [tag: string, attributes: Readonly<Record<string, string | number>>];\n\nexport const fsIconNodes = ${JSON.stringify(nodes, null, 2)} as const satisfies Readonly<Record<string, readonly FsIconNode[]>>;\n`;

await fs.writeFile(outputPath, output);
console.log(`Generated ${iconNames.length} icon node sets at ${outputPath}`);
