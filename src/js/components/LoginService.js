import $ from 'jquery';

export default class LoginService {
    constructor(loginEndpoint, logoutEndPoint) {
        this.loginEndpoint = loginEndpoint;
        this.logoutEndPoint = logoutEndPoint;
    }

    login(email, password, successCallback, errorCallback) {
        $.ajax({
            method: 'post',
            url: `${this.loginEndpoint}`,
            data: {
                email: email,
                password: password
            },
            success: successCallback,
            error: errorCallback
        });
    }

    logout(successCallback) {
        // simply removes token from localStorage
        
        successCallback();
    }
}