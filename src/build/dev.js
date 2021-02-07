/*
Copyright 2021 DigitalOcean

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
const WebpackDevServer = require('webpack-dev-server');

module.exports = (source, out, port) => {
    // Ensure the output directory exists.
    ensureDir(out);

    // Create the webpack development server.
    const abs = x => path.join(process.cwd(), path.normalize(x));
    out = abs(out);
    const config = configGenerator(abs(source), out);
    config.mode = 'development';
    const devServer = new WebpackDevServer(webpack(config), {
        contentBase: out, open: true, writeToDisk: true,
    });

    // Start the dev server.
    devServer.listen(Number(port), '127.0.0.1', () => {
        console.log(`Starting server on http://localhost:${port}`);
    });
};
