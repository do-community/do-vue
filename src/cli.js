#!/usr/bin/env node

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

process.on('unhandledRejection', (error, promise) => {
    console.log('Unhandled rejection at:', promise);
    console.error(error);
    process.exit(1);
});

const [, , ...args] = process.argv;

switch (args[0]) {
    case 'svgs':
        if (args.length >= 2) require('./build/buildSVGs')(args[1]);
        else console.log('Missing source dir for SVGs');
        break;

    case 'tool':
        if (args.length >= 3) require('./build/buildTool')(args[1], args[2]);
        else console.log('Missing source/output dirs for tool');
        break;

    case 'dev':
        if (args.length >= 4) require('./build/dev')(args[1], args[2], args[3]);
        else console.log('Missing source/output dirs and port for dev');
        break;

    case 'clean':
        require('./build/cleanDist')();
        break;

    case 'comment':
        if (args.length >= 2) require('./build/createGitHubComment')(args.slice(1));
        else console.log('Missing tool(s) map for comment');
        break;

    case 'template':
        require('./build/fetchTemplate')();
        break;

    default:
        console.log('Usage:');
        console.log('  svgs <source dir>');
        console.log('  tool <source dir> <output dir>');
        console.log('  dev <source dir> <output dir> <port>');
        console.log('  clean');
        console.log('  comment <... name:dist/dir>');
        console.log('  template');
}
