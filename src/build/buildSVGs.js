/*
Copyright 2019 DigitalOcean

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

const fs = require('fs');
const ensureDir = require('./ensureDir');

module.exports = source => {
    console.log('Locating & building all SVG assets to JS data...');

    // Create target directory
    const baseDir = `${process.cwd()}/build/svg`;
    ensureDir(baseDir);

    // Remove all existing JS SVG files
    const existing = fs.readdirSync(baseDir).filter(file => file.endsWith('.svg.js'));
    existing.forEach(file => {
        fs.unlinkSync(`${baseDir}/${file}`);
    });

    // Locate all SVG asset files
    const files = fs.readdirSync(source).filter(file => file.endsWith('.svg'));

    // Convert to JS & save
    files.forEach(svg => {
        const xml = fs.readFileSync(`${source}/${svg}`);
        fs.writeFileSync(
            `${baseDir}/${svg}.js`,
            `// This file was automatically generated.\nexport default \`\n${xml}\n\`\n`,
            { flag: 'w+' },
        );
    });

    console.log('...all SVGs converted to JS data successfully.');
};
