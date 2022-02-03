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

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fetch = require('node-fetch');
const fs = require('fs');
const ensureDir = require('./ensureDir');

module.exports = async () => {
    console.log('Fetching Community Tools template from www.digitalocean.com...');

    // Fetch raw template
    let rawHTML;

    if (process.env.BLANK_TEMPLATE === 'true') {
        // Support a blank template for completely local dev
        rawHTML = `<!DOCTYPE HTML>
<html lang="en">
    <head>
        <title>Blank Template</title>
    </head>
    <body>
        <div class="app"></div>
    </body>
</html>
`;
    } else if (process.env.WWW_TEMPLATE === 'true') {
        // Support developing a tool for WWW
        const res = await fetch('https://www.digitalocean.com/pricing/calculator');
        rawHTML = await res.text();
    } else {
        // Default to a tool for Community tooling
        const res = await fetch('https://www.digitalocean.com/community/tools/blank');
        rawHTML = await res.text();
    }

    // Parse
    const dom = new JSDOM(rawHTML);
    const { document } = dom.window;

    // Remove scripts
    document.querySelectorAll('script[src]').forEach(node => {
        node.remove();
    });

    // Nuke top log in button
    document.querySelectorAll('[class*="TinyTopNav"] li').forEach(node => {
        if (node.innerHTML.toLowerCase().includes('sign in')) {
            node.remove();
        }
    });

    // Nuke the primary log in button
    document.querySelectorAll('[class*="NavBarContainer"] a').forEach(node => {
        if (node.innerHTML.toLowerCase().includes('sign up')) {
            node.remove();
        }
    });

    // Nuke the www log in and sign up buttons
    document.querySelectorAll('[class*="SecondaryNavContainer"] a').forEach(node => {
        if (node.innerHTML.toLowerCase().includes('log in') || node.innerHTML.toLowerCase().includes('sign up')) {
            node.remove();
        }
    });

    // Deal with hard URLs
    document.querySelectorAll('[href]').forEach(node => {
        const href = node.getAttribute('href');
        if (href.startsWith('/')) {
            node.setAttribute('href', `https://www.digitalocean.com${href}`);
        }
    });
    document.querySelectorAll('[src]').forEach(node => {
        const src = node.getAttribute('src');
        if (src.startsWith('/')) {
            node.setAttribute('src', `https://www.digitalocean.com${src}`);
        }
    });
    document.querySelectorAll('[content]').forEach(node => {
        const content = node.getAttribute('content');
        if (content.startsWith('/')) {
            node.setAttribute('content', `https://www.digitalocean.com${content}`);
        }
    });
    document.querySelectorAll('style').forEach(node => {
        node.innerHTML = node.innerHTML.replace(/url\((["'])?\//g, 'url($1https://www.digitalocean.com/');
    });

    // Inject charset
    if (!document.querySelectorAll('meta[charset="utf-8"]') && !document.querySelectorAll('meta[charset="utf8"]')) {
        const charset = document.createElement('meta');
        charset.setAttribute('charset', 'utf-8');
        document.head.insertBefore(charset, document.head.firstChild);
    }

    // Inject content block (for blank template)
    const blankContent = document.querySelector('body > .app');
    if (blankContent) blankContent.innerHTML = '<block name="content"></block>';

    // Inject content block (for Community)
    const communityContent = document.querySelector('[class*="StyledLayout"] > div:not([class*="TinyTopNav"])');
    if (communityContent) communityContent.innerHTML = '<block name="content"></block>';

    // Inject content block (for WWW)
    const wwwContent = document.querySelector('.slices');
    if (wwwContent) {
        wwwContent.style.paddingTop = '112px';
        wwwContent.innerHTML = '<block name="content"></block>';
    }

    // Inject the title block
    document.querySelector('title').outerHTML = '<block name="title"><title>DigitalOcean</title></block>';

    // Convert back to raw
    rawHTML = dom.serialize();

    // Inject last fetch comment
    rawHTML = rawHTML.replace('<head>', `<!-- Last fetch from www.digitalocean.com @ ${(new Date()).toISOString()} -->\n<head>`);

    // Create target directory
    const baseDir = `${process.cwd()}/build`;
    ensureDir(baseDir);

    // Export
    fs.writeFileSync(`${baseDir}/base.html`, rawHTML, { flag: 'w+' });
    console.log('...fetching & conversion completed, saved to build/base.html');
};
