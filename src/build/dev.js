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

const http = require('http');
const fs = require('fs');
const chokidar = require('chokidar');
const path = require('path');
const buildTool = require('./buildTool');

module.exports = (source, out, port) => {
    // Defines when the page was last updated.
    let lastUpdated = Date.now();

    // Defines the error that happened (if it happened) during the build.
    let err;

    // Handle HTTP requests to the development server.
    const handleRequest = async (req, res) => {
        let fp;
        switch (req.path) {
        case '/do-vue-dev/_lastUpdated':
            // Return the number.
            const j = JSON.stringify(lastUpdated);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': j.length,
            });
            res.write(j);
            break;
        case '/', '/index.html':
            // Defines the injection script.
            const refreshInjection = `<script>
                // Defines when the page was refreshed.
                const refreshed = ${lastUpdated};

                // Every second, go ahead and check if we should refresh.
                setInterval(() => {
                    // Run a fetch request.
                    fetch('/do-vue-dev/_lastUpdated').then(res => res.json()).then(res => {
                        // If they are different, we should refresh.
                        if (res !== refreshed) window.location.reload();
                    });
                }, 1000);
            </script>`;

            // If err isn't undefined, we should return that.
            if (err !== undefined) {
                const content = `
                <h1>Failed to Build</h1>
                <p>The page failed to build.</p>
                <code>${String(err)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;')
                    .replace(/\n/g, '<br>')}</code>
                ${refreshInjection}
                `;
                res.writeHead(400, {
                    'Content-Type': 'text/html',
                    'Content-Length': content.length,
                });
                res.write(content);
            }

            // Load the index file.
            fp = path.join(out, 'index.html');
            let data;
            try {
                // Try reading the HTML.
                data = (await fs.promises.readFile(fp)).toString();
            } catch (_) {
                // The HTML doesn't exist.
                const content = `
                <h1>Page Building</h1>
                <p>The page is currently still building.</p>
                ${refreshInjection}
                `;
                res.writeHead(404, {
                    'Content-Type': 'text/html',
                    'Content-Length': content.length,
                });
                res.write(content);
                return;
            }

            // Inject the refresher into the body and then return it.
            const html = data.replace('</body>', `${refreshInjection}</body>`);
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': html.length,
            });
            res.send(html);

            // Break when we are done.
            break;
        case '/style.css', '/style.css.map', '/mount.js', '/mount.js.map', '/report.html':
            // Grab the static content if possible.
            const contentType = res.path.endsWith('.map') ? 'application/json; charset=utf-8'
                : res.path.endsWith('.js') ? 'text/javascript; charset=utf-8' : res.path.endsWith('.html') ?
                'text/html; charset=utf-8' : 'text/css; charset=utf-8';
            fp = path.join(out, `.${res.path}`);
            let stat;
            try {
                // Try and get the file information.
                stat = await fs.promises.stat(fp);
            } catch (_) {
                // If we cannot stat, we can assume the file doesn't exist and 404.
                res.writeHead(404, {
                    'Content-Type': 'text/html',
                    'Content-Length': 10,
                });
                res.write('Not found.');
                return;
            }
            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': stat.size,
            });
            const readStream = fs.createReadStream(fp);
            readStream.pipe(res);
            break;
        default:
            // This file won't exist.
            res.writeHead(404, {
                'Content-Type': 'text/html',
                'Content-Length': 10,
            });
            res.write('Not found.');
        }
    };

    // Defines the builder and then runs the initial build.
    const build = () => buildTool(source, out, true).then(() => {
        err = undefined;
        lastUpdated = Date.now();
    }).catch(e => {
        err = e;
        lastUpdated = Date.now();
    });
    build();

    // Handle source changes.
    chokidar.watch(source).on('change', build);

    // Start the dev server.
    const server = http.createServer(handleRequest);
    server.on('clientError', (_, socket) => {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    server.on('listening', () => console.log(`Listening on ${port}.`));
    server.listen(Number(port));
};
