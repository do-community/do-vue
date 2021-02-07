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

const webpack = require('webpack');
const configGenerator = require('../webpack.config');
const path = require('path');
const ensureDir = require('./ensureDir');
const fs = require('fs').promises;

const build = async (source, out) => {
    const config = configGenerator(abs(source), abs(out));
    config.mode = 'production';
    const abs = x => path.join(process.cwd(), path.normalize(x));
    return new Promise((res, rej) => webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.error(err ? err.message : stats.toString());
            rej(err);
            return;
        }
        console.log(stats.toString());
        console.log(`...build successfully, saved to ${out}`);
        res();
    }));
};

const unhackHtml = async out => {
    await fs.unlink(path.join(out, '__index_tmp.js'));
    for (const fname of await fs.readdir(out)) {
        if (fname.endsWith('.html')) {
            await fs.rename(path.join(out, fname), path.join(out, 'index.html'));
            return;
        }
    }
    throw new Error('no HTML found');
};

module.exports = async (source, out) => {
    // Create target directory
    ensureDir(out);

    // Build the JS
    await build(
        source,
        out,
    );

    // Unhack the HTML.
    await unhackHtml(out);
};
