import $ from 'jquery';

export default class LoginManager {

    constructor(selector, service, pubSub) {
        this.element = $(selector);
        this.form = $(this.element.find('.login-form')[0]);
        this.logoutButton = $(this.element.find('.btn-logout')[0]);
        this.service = service;
        this.pubsub = pubSub;
    }

    init() {
        if (localStorage.getItem('token')) {
            this.setLoggedIn();
        } else {
            this.setNotLoggedIn();
        }
        this.setupSubmitEventHandler();
        this.setupLogoutEventHandler();
    }

    setupSubmitEventHandler() {
        this.form.on('submit', () => {
            this.send();
            return false;
        });
    }

    setupLogoutEventHandler() {
        this.logoutButton.on('click', () => {
            this.service.logout(() => {
                this.pubSub.publish('loggedout');
                this.setNotLoggedIn();
            });
        });
    }

    send() {
        const email = this.form.find('#email').val();
        const password = this.form.find('#password').val();

        this.setWaiting();

        this.service.login(email, password, (data) => {
            // if login OK then save token on localStorage
            // and redirect to home
            localStorage.setItem('token', data.token);
            this.pubSub.publish('loggedin');
            this.resetForm();
            this.setLoggedIn();
        }, error => {
            console.error('login error callback', error);
            this.setNotLoggedIn();
        });
    }

    resetForm() {
        this.form[0].reset();
    }

    setWaiting() {
        this.disableFormControls();
    }

    setNotLoggedIn() {
        this.element.addClass('no-logged-in').removeClass('logged-in');
        this.enableFormControls();
    }

    setLoggedIn() {
        // hide form and show logout link
        this.element.removeClass('no-logged-in').addClass('logged-in');
    }

    disableFormControls() {
        this.form.find('input, button').attr('disabled', true);
    }

    enableFormControls() {
        this.form.find('input, button').attr('disabled', false);
    }

}