import $ from 'jquery';
import Popper from 'popper.js';

// make jQuery and Popper.js globally available
// they are needed by Bootstrap
window.$ = window.jQuery = $;
window.Popper = Popper;

// Can't import bootstrap using import :(
require('bootstrap');

import AdvertisementsService from './components/AdvertisementsService';
import AdvertisementsManager from './components/AdvertisementsManager';

import LoginService from './components/LoginService';
import LoginManager from './components/LoginManager';

const advertisementsService = new AdvertisementsService('/apiv1/advertisements');
const advertisementsManager = new AdvertisementsManager('.advertisements', advertisementsService);
advertisementsManager.init();

const loginService = new LoginService('/apiv1/login');
const loginManager = new LoginManager('.auth-component', loginService);
loginManager.init();