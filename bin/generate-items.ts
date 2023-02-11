import fs from 'fs';
import path from 'path';

const items = fs
  .readFileSync(path.resolve(__dirname, './item_info.txt'), 'utf8')
  .split(/\r?\n|\r|\n/g)
  .filter((line) => !!line)
  .map((line) => {
    const [id, imageId, emu, name] = line
      .split('|')
      .map((field) => field.trim());

    return {
      id: Number(id),
      imageId: Number(imageId),
      emu: Number(emu),
      name,
    };
  });

const itemNameOccurrences = new Map();
const enumKeys = items.map((item) => {
  // A few items have duplicate names. Track the occurrences so we can
  // append a number to their enum key if necessary.
  const occurrence = (itemNameOccurrences.get(item.name) ?? 0) + 1;
  itemNameOccurrences.set(item.name, occurrence);

  return `${item.name}${occurrence > 1 ? ` ${occurrence}` : ''}`
    .replace(/[\/-]/g, ' ')
    .replace(/['"\.]/g, '')
    .replace('&', 'and')
    .replace('%', ' percent')
    .replace(/\s+/g, '_')
    .replace(/^\d+/, (num) => `_${num}`)
    .toUpperCase();
});

const generatedOutput =
  `// This file has been automatically generated using information parsed from the\n` +
  `// latest version of the EL client's \`item_info.txt\`. Do not edit it manually.\n` +
  '\n' +
  'export enum ItemId {\n' +
  items.map((item, index) => `  ${enumKeys[index]} = ${item.id},`).join('\n') +
  '\n}\n' +
  '\n' +
  'export const ItemImageIds: Record<ItemId, number> = {\n' +
  items
    .map((item, index) => `  [ItemId.${enumKeys[index]}]: ${item.imageId},`)
    .join('\n') +
  '\n};\n' +
  '\n' +
  'export const ItemEMUs: Record<ItemId, number> = {\n' +
  items
    .map((item, index) => `  [ItemId.${enumKeys[index]}]: ${item.emu},`)
    .join('\n') +
  '\n};\n' +
  '\n' +
  'export const ItemNames: Record<ItemId, string> = {\n' +
  items
    .map((item, index) => `  [ItemId.${enumKeys[index]}]: \`${item.name}\`,`)
    .join('\n') +
  '\n};\n';

const outputPath = path.resolve(__dirname, '../lib/generated/items.ts');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, generatedOutput, 'utf8');
