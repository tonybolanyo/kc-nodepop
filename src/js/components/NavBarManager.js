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
        this.setupAuthLinks();
    }

    setupAuthLinks() {
        console.log('HOLAAA');
        this.element.find('.authenticated-users a').on('click', (event) => {
            let link = $(event.target).attr('href');
            console.log('captured!!!', link);
            const token = localStorage.getItem('token');
            if (token) {
                link = `${link}?token=${token}`;
            }
            window.location.href = link;
            return false;
        });
    }

    setUserName() {
        const name = localStorage.getItem('name');
        if (name) {
            this.userNamePlaceHolder.text(name);
        }
    }
}