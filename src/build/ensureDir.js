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
const path = require('path');

module.exports = dir => {
    const dirParts = path.normalize(dir).split(path.sep);
    for (let i = 0; i < dirParts.length; i++) {
        const thisDir = dirParts.slice(0, i + 1).join(path.sep);
        if (!thisDir) continue;
        if (!fs.existsSync(thisDir)) fs.mkdirSync(thisDir);
    }
};

