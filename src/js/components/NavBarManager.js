import $ from 'jquery';

export default class NavBarManager {
    constructor(selector, pubSub) {
        this.element = $(selector);
        this.userNamePlaceHolder = $(this.element.find('.user-name'));
        this.pubSub = pubSub;
    }

    init() {
        this.setUserName();
        this.pubSub.subscribe('loggedin', () => {
            this.setUserName();
        });
        this.pubSub.subscribe('loggedout', () => {
            this.userNamePlaceHolder.text('');
        });
    }

    setUserName() {
        const name = localStorage.getItem('name');
        console.log('setUserName', name);
        if (name) {
            console.log(this.userNamePlaceHolder, name);
            this.userNamePlaceHolder.text(name);
        }
    }
}