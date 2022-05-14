import { Grid } from './grid';
const cursor = require('./cursor');

document.addEventListener("DOMContentLoaded", function(event) {
    window.onload = function () {
        document.body.classList.remove('loading');
        window.requestAnimationFrame(function() {
            cursor();
            new Grid(document.querySelector('.base'));
        });
    };
});
