import fs from 'fs';
import path from 'path';

const [title] = process.argv.slice(2);
if (!title) {
  console.error('Usage: npm run adr <title>');
  process.exit(1);
}

const slug = title.toLowerCase().replace(/\s+/g, '-');
const timestamp = new Date().toISOString().split('T')[0];
const filename = `${timestamp}-${slug}.md`;
const filePath = path.join('docs', 'adr', filename);

const content = `# ADR: ${title}

Date: ${timestamp}

## Status
Proposed

## Context
...

## Decision
...

## Consequences
...
`;

fs.writeFileSync(filePath, content);
console.log(`Created ADR: ${filePath}`);
