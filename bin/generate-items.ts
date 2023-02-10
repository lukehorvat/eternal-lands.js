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
const itemIdStr = `export enum ItemId {
${items
  .map((item) => {
    // A few items have duplicate names. Track the occurrences so we can
    // append a number to their enum key if necessary.
    const occurrence = (itemNameOccurrences.get(item.name) ?? 0) + 1;
    itemNameOccurrences.set(item.name, occurrence);

    const enumKey = `${item.name}${occurrence > 1 ? ` ${occurrence}` : ''}`
      .replace(/[\/-]/g, ' ')
      .replace(/['"\.]/g, '')
      .replace('&', 'and')
      .replace('%', ' percent')
      .replace(/\s+/g, '_')
      .replace(/^\d+/, (num) => `_${num}`)
      .toUpperCase();
    const enumValue = item.id;

    return `  ${enumKey} = ${enumValue},`;
  })
  .join('\n')}
}`;

const fileStr = `
// This file has been automatically generated using information parsed from the
// latest version of the EL client's \`item_info.txt\`. Do not edit it manually.

${itemIdStr}
`;

const outputPath = path.resolve(__dirname, '../lib/generated/items.ts');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileStr, 'utf8');
