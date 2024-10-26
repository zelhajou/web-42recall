const fs = require('fs').promises;
const path = require('path');
const ignoreList = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'package-lock.json',
  'yarn.lock',
  '.DS_Store',
  'tsconfig.tsbuildinfo',
];
const allowedExtensions = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.prisma',
  '.css',
  '.md',
  '.sql',
];
async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return {
      path: filePath,
      content: content,
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}
async function scanDirectory(dirPath) {
  const results = [];
  async function scan(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(process.cwd(), fullPath);
      if (ignoreList.some((ignore) => relativePath.includes(ignore))) {
        continue;
      }
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else {
        const ext = path.extname(entry.name);
        if (allowedExtensions.includes(ext)) {
          const fileContent = await readFile(fullPath);
          if (fileContent) {
            results.push(fileContent);
          }
        }
      }
    }
  }
  await scan(dirPath);
  return results;
}
async function writeResults(results) {
  const output = {
    timestamp: new Date().toISOString(),
    fileCount: results.length,
    files: results,
  };
  await fs.writeFile(
    'project-files.json',
    JSON.stringify(output, null, 2),
    'utf8'
  );
}
async function main() {
  try {
    console.log('Starting project scan...');
    const projectPath = process.cwd();
    const results = await scanDirectory(projectPath);
    console.log(`Found ${results.length} files. Writing results...`);
    await writeResults(results);
    console.log('Project scan complete! Results written to project-files.json');
  } catch (error) {
    console.error('Error scanning project:', error);
    process.exit(1);
  }
}
main();
