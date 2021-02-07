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
const config = require('../webpack.config');
const path = require('path');
const ensureDir = require('./ensureDir');

const build = async (source, out, filename) => {
    config.entry = path.normalize(source);
    config.output.path = path.normalize(out);
    config.output.filename = filename;
    return new Promise((res, rej) => webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.error(err ? err.message : stats.toString());
            rej(err);
        }
        console.log(stats.toString());
        console.log(`...build successfully, saved to ${out}`);
        res();
    }));
};

module.exports = async (source, out) => {
    // Create target directory
    ensureDir(out);

    // Build the JS
    await build(
        source,
        out,
        'index.html',
    );
};
