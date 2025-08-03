const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

async function minifyFile(inputPath, outputPath) {
    try {
        const code = fs.readFileSync(inputPath, 'utf8');
        const result = await minify(code, {
            compress: {
                drop_console: false, // Keep console logs for debugging
                drop_debugger: true,
                passes: 2
            },
            mangle: {
                toplevel: false,
                keep_classnames: true, // Keep class names for better debugging
                keep_fnames: true // Keep function names
            },
            format: {
                comments: false // Remove all comments
            },
            sourceMap: {
                filename: path.basename(outputPath),
                url: path.basename(outputPath) + '.map'
            }
        });

        if (result.error) {
            throw result.error;
        }

        // Write minified file
        fs.writeFileSync(outputPath, result.code);
        console.log(`✓ Created ${outputPath}`);

        // Write source map if generated
        if (result.map) {
            fs.writeFileSync(outputPath + '.map', result.map);
            console.log(`✓ Created ${outputPath}.map`);
        }

        // Calculate size reduction
        const originalSize = fs.statSync(inputPath).size;
        const minifiedSize = fs.statSync(outputPath).size;
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        console.log(`  Size reduced by ${reduction}% (${originalSize} → ${minifiedSize} bytes)`);

    } catch (error) {
        console.error(`✗ Error minifying ${inputPath}:`, error.message);
        process.exit(1);
    }
}

async function buildMinified() {
    console.log('Building minified versions...\n');

    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
        console.error('Error: dist directory not found. Run "npm run build" first.');
        process.exit(1);
    }

    // Minify ES6 module
    await minifyFile(
        'dist/HTMLTableKit.js',
        'dist/HTMLTableKit.min.js'
    );

    console.log(''); // Empty line for spacing

    // Minify standalone version
    await minifyFile(
        'dist/HTMLTableKit.standalone.js',
        'dist/HTMLTableKit.standalone.min.js'
    );

    console.log('\n✅ Minification complete!');
}

// Run the build
buildMinified().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});
