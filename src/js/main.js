import $ from 'jquery';
import Popper from 'popper.js';

// make jQuery and Popper.js globally available
// they are needed by Bootstrap
window.$ = window.jQuery = $;
window.Popper = Popper;

// Can't import bootstrap using import :(
require('bootstrap');

$(document).ready(function(){
    console.log("Document loaded");
});
