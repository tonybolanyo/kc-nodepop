import $ from 'jquery';

export default class AdvertisementsService {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    listAdvertisements(offset, limit, filters, successCallback, errorCallback) {
        const {name, price, tag, sale} = filters;
        $.ajax({
            url: `${this.endpoint}`,
            data: {
                offset: offset,
                limit: limit,
                name: name,
                price: price,
                tag: tag,
                sale: sale
            },
            success: successCallback,
            error: errorCallback
        });
    }

    createAdvertisement(data, successCallback, errorCallback) {
        const token = localStorage.getItem('token');
        $.ajax({
            method: 'post',
            url: `${this.endpoint}`,
            headers: { 'x-access-token': token },
            data: data,
            success: successCallback,
            error: errorCallback
        });
    }
}