const fs = require('fs');
const path = require('path');

// Read the compiled JavaScript
const jsPath = path.join(__dirname, 'dist/HTMLTableKit.js');

if (!fs.existsSync(jsPath)) {
    console.error('Error: dist/HTMLTableKit.js not found. Run "npm run build" first.');
    process.exit(1);
}

const jsContent = fs.readFileSync(jsPath, 'utf8');

// Create standalone version by wrapping in IIFE and removing ES6 export
const standaloneContent = `/**
 * HTMLTableKit - A TypeScript library for managing HTML tables
 * Standalone Browser Version
 */
(function(global) {
    'use strict';
    
${jsContent
    .replace(/export default HTMLTableKit;/, '')
    .replace(/export \{[^}]*\};/, '')
    .trim()}
    
    // Expose to global scope
    global.HTMLTableKit = HTMLTableKit;
    
})(typeof window !== 'undefined' ? window : this);
`;

// Write standalone version
const standalonePath = path.join(__dirname, 'dist/HTMLTableKit.standalone.js');
fs.writeFileSync(standalonePath, standaloneContent);
console.log('✓ Created dist/HTMLTableKit.standalone.js');
