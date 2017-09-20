import $ from 'jquery';

export default class AdvertisementsService {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    listAdvertisements(successCallback, errorCallback) {
        $.ajax({
            url: `${this.endpoint}`,
            success: successCallback,
            error: errorCallback
        });
    }
}