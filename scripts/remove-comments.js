// scripts/remove-comments.js
const fs = require('fs').promises;
const path = require('path');

// File extensions to process
const EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.css'
];

// Directories to ignore
const IGNORE_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  '.vscode',
  'build'
];

// Comment patterns
const COMMENT_PATTERNS = [
  // Single line comments
  /\/\/.*/g,
  // Multi-line comments
  /\/\*[\s\S]*?\*\//g,
  // JSDoc comments
  /\/\*\*[\s\S]*?\*\//g
];

async function removeComments(content) {
  let result = content;
  
  // Apply each pattern
  for (const pattern of COMMENT_PATTERNS) {
    result = result.replace(pattern, '');
  }
  
  // Remove empty lines and normalize spacing
  result = result
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');
  
  // Add single newline at end of file
  return result.trim() + '\n';
}

async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const cleanedContent = await removeComments(content);
    await fs.writeFile(filePath, cleanedContent, 'utf8');
    console.log(`✓ Processed: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error);
  }
}

async function scanDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip ignored directories
        if (!IGNORE_DIRS.includes(entry.name)) {
          await scanDirectory(fullPath);
        }
      } else {
        // Process files with matching extensions
        const ext = path.extname(entry.name);
        if (EXTENSIONS.includes(ext)) {
          await processFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

async function main() {
  const startTime = Date.now();
  console.log('Starting comment removal...\n');
  
  try {
    await scanDirectory(process.cwd());
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\nComment removal completed in ${duration}s`);
  } catch (error) {
    console.error('Error during comment removal:', error);
    process.exit(1);
  }
}

main();