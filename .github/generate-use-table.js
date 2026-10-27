#!/usr/bin/env node

const response = await fetch('https://repo.packagist.org/p2/contena/core.json');
const json = await response.json();
import fs from 'node:fs';

const mapping = new Map();
let previousVersion = null;

for (const version of json.packages['contena/core']) {
  if (version.require) {
    previousVersion = version
  }

  if (previousVersion.require['contena/conflicts']) {
    mapping.set(version.version, previousVersion.require['contena/conflicts'])
  }
}


// Generate the USE.md content
let useTableContent = `# Contena Version to Conflicts Version Mapping

This document shows which version of \`contena/conflicts\` is used by each version of \`contena/core\`.

| Contena Version | Conflicts Version |
|-----------------|-------------------|
`;

// Add each mapping entry to the table
for (const [contenaVersion, conflictsVersion] of mapping) {
  useTableContent += `| ${contenaVersion} | ${conflictsVersion} |\n`;
}

// Write the content to USE.md
fs.writeFileSync('USAGES.md', useTableContent);

console.log('USAGES.md has been generated successfully.');
