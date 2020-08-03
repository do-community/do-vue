/*
Copyright 2020 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const Bundler = require('parcel-bundler');
const path = require('path');
const posthtml = require('posthtml');
const fs = require('fs');
const Terser = require('terser');
const ensureDir = require('./ensureDir');

const build = async (asset, out, minify = true) => {
    console.log(`\nLoading in ${asset} & building...`);

    // Define options
    const entry = path.normalize(asset);
    const options = {
        outDir: path.dirname(path.normalize(out)),
        outFile: path.basename(out),
        publicUrl: './',
        watch: false,
        cache: false,
        contentHash: false,
        minify,
        scopeHoist: process.argv.includes('--scope-hoisting'),
        logLevel: 2,
        sourceMaps: false,
        detailedReport: false,
    };

    // Build
    const bundler = new Bundler(entry, options);
    await bundler.bundle();

    console.log(`...build successfully, saved to ${out}`);
};

const terser = async (file, out) => {
    console.log(`\nLoading in ${file} & minifying...`);

    // Minify
    const contents = fs.readFileSync(file, 'utf8');
    const minified = await Terser.minify(contents, {
        compress: {
            passes: 5,
        },
    });

    // Save it
    fs.writeFileSync(out, minified.code, 'utf8');

    console.log(`...minified successfully, saved to ${out}`);
};

const index = async (file, out) => {
    console.log(`\nLoading in ${file} & building...`);

    // Get source HTML
    let source = fs.readFileSync(path.normalize(file)).toString();

    // Replace SCSS w/ CSS
    source = source.replace('href="scss/style.scss"', 'href="style.css"');

    // Load posthtml plugins
    const config = require(path.join(process.cwd(), '.posthtmlrc'));
    const plugins = [];
    Object.keys(config.plugins).forEach(plugin => {
        const pl = require(plugin);
        plugins.push(pl(config.plugins[plugin]));
    });
    const post = posthtml(plugins);

    // Process
    const html = (await post.process(source)).html;

    // Remove comments before HTML
    const result = html.replace(/^(<!--.+?-->[\w\n]*)*/gms, '');

    // Export
    fs.writeFileSync(path.normalize(out), result, { flag: 'w+' });
    console.log(`...build successfully, saved to ${out}`);
};

module.exports = async (source, out) => {
    // Create target directory
    ensureDir(out);

    // Build the JS
    await build(
        path.join(source, 'mount.js'),
        path.join(out, 'mount.js'),
        !process.argv.includes('--terser'),
    );
    if (process.argv.includes('--terser')) await terser(path.join(out, 'mount.js'), path.join(out, 'mount.js'));

    // Build the CSS
    await build(
        path.join(source, 'scss/style.scss'),
        path.join(out, 'style.css'),
    );

    // Build index
    await index(
        path.join(source, 'index.html'),
        path.join(out, 'index.html'),
    );
};
