/**
 * Script to update package.json files for consistency
 */

const fs = require('fs');
const path = require('path');

// Apps to update
const apps = [
  'EatOnTime-Backend-main',
  'frontend',
  'AdminDash',
  'RestDash',
  'Delivery',
  'Onboarding',
];

// Common scripts to add to each app
const commonScripts = {
  lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
  'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
  format: 'prettier --write .',
  'format:check': 'prettier --check .',
  typecheck: 'tsc --noEmit',
};

// Specific scripts for each app type
const scriptsByAppType = {
  // Backend app
  'EatOnTime-Backend-main': {
    dev: 'nodemon index.js',
    start: 'node index.js',
    test: 'jest',
  },
  // Expo apps
  frontend: {
    start: 'expo start',
    android: 'expo start --android',
    ios: 'expo start --ios',
    web: 'expo start --web',
  },
  Delivery: {
    start: 'expo start',
    android: 'expo start --android',
    ios: 'expo start --ios',
    web: 'expo start --web',
  },
  Onboarding: {
    start: 'expo start',
    android: 'expo start --android',
    ios: 'expo start --ios',
    web: 'expo start --web',
  },
  // Vite apps
  AdminDash: {
    dev: 'vite',
    build: 'vite build',
    'build:dev': 'vite build --mode development',
    preview: 'vite preview',
  },
  RestDash: {
    dev: 'vite',
    build: 'vite build',
    'build:dev': 'vite build --mode development',
    preview: 'vite preview',
  },
};

// Update package.json for each app
apps.forEach((appName) => {
  const packageJsonPath = path.join(__dirname, '..', appName, 'package.json');
  
  try {
    // Read package.json
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Update scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      ...commonScripts,
      ...scriptsByAppType[appName],
    };
    
    // Write updated package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf-8'
    );
    
    console.log(`Updated scripts for ${appName}`);
  } catch (err) {
    console.error(`Error updating scripts for ${appName}:`, err.message);
  }
});

console.log('Scripts update complete!');
