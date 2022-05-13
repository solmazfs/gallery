import { Grid } from './grid';
const cursor = require('./cursor');

var ghpages = require('gh-pages');
ghpages.publish('dist', function(err) {});

document.addEventListener("DOMContentLoaded", function(event) {
    window.onload = function () {
        document.body.classList.remove('loading');
        window.requestAnimationFrame(function() {
            cursor();
            new Grid(document.querySelector('.base'));
        });
    };
});
