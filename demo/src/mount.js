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

// This aims to test the fundamentals of everything this build package is used for.
// Loading Vue, SCSS, normal JS, all through Webpack.

import { createApp } from 'vue';
import App from './templates/app.vue';

// Imports the CSS.
import './scss/style';

// Try out dynamic stuff
window.loadDynamicAlert = async () => {
    await import('./dynamic/alert');
};

createApp(App).mount('#app');
