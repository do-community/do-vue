// This is just a pure DOM implementation of a very simple counter.
// We are not trying to test Vue or React here, we have plenty of tools to do that.
// Rather, we are making sure the CLI builds it and handles things like hot reloading properly.

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
