/*
Copyright 2022 DigitalOcean

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

const config = require('../webpack.config');
const webpack = require('webpack');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');

module.exports = (source, out, port) => {
    // Get the absolute path to the output directory
    const abs = x => path.join(process.cwd(), path.normalize(x));
    const contentOut = abs(out);

    // Get our config and tweak the output path for dev server
    const conf = config(abs(source), contentOut, true);
    conf.output.publicPath = '/';

    // Create the dev server
    const compiler = webpack(conf);
    const server = new WebpackDevServer({
        ...WebpackDevServer.devServer,
        static: {
            directory: contentOut,
            serveIndex: false,
        },
        hot: true,
    }, compiler);

    // Start the server
    server.listen(Number(port), 'localhost', err => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
};
