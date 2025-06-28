#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting optimized build process...');

// 1. Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// 2. Set production environment
process.env.NODE_ENV = 'production';

// 3. Run optimized build
console.log('🏗️ Building optimized production bundle...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// 4. Analyze bundle size
console.log('📊 Analyzing bundle size...');
const distPath = path.join(__dirname, '../dist');
const getDirectorySize = (dirPath) => {
  let size = 0;
  if (!fs.existsSync(dirPath)) return 0;
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  });
  
  return size;
};

const totalSize = getDirectorySize(distPath);
const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log(`📦 Total bundle size: ${sizeInMB} MB`);

console.log('\n🎉 Optimized build completed successfully!');
console.log(`📁 Build output: ${distPath}`);
console.log(`📊 Total size: ${sizeInMB} MB`);
console.log('🚀 Ready for deployment!');
