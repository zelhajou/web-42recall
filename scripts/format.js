// scripts/format.js
const { execSync } = require('child_process');
const path = require('path');

function formatFiles() {
  const startTime = Date.now();
  console.log('🎨 Starting project formatting...\n');

  try {
    // Run Prettier on all supported files
    execSync(
      'prettier --write "**/*.{js,jsx,ts,tsx,css,md,json}" --ignore-path .gitignore',
      { stdio: 'inherit' }
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Formatting completed in ${duration}s`);
  } catch (error) {
    console.error('\n❌ Error during formatting:', error);
    process.exit(1);
  }
}

formatFiles();
