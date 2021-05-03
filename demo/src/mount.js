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

// This is just a pure DOM implementation of a very simple counter.
// We are not trying to test Vue or React here, we have plenty of tools to do that.
// Rather, we are making sure the CLI builds it and handles things like hot reloading properly.

// Imports the CSS.
import './scss/style';

// Test importing from a very far away path (webpack config testing).
import incrementCounter from './in/a/path/far/far/away/increment';

// Get the counter element.
const counterElement = document.getElementById('counter');

// Adjust the counter in the window.
window.addOne = () => {
    // Update the counter.
    counterElement.innerText = String(incrementCounter());
};

// Make sure other elements aren't in global scope.
if (window.counter === 0 || window.counterElement) throw new Error('Parts of mount should not be in global scope.');

// Try out dynamic stuff
window.loadDynamicAlert = async () => {
    await import('./dynamic/alert');
};
