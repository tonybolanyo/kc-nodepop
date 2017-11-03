import $ from 'jquery';

import UIStatusManager from './UIStatusManager';

export default class AdvertisementFormManager extends UIStatusManager {

    constructor(selector, service, pubSub) {
        super(selector);
        this.service = service;
        this.pubSub = pubSub;
    }

    init() {
        this.setupSubmitEventHandler();
    }

    setupSubmitEventHandler() {
        this.element.on('submit', () => {
            this.validateAndSend();
            return false;
        });
    }

    validateAndSend() {
        if (this.isValid()) {
            this.send();
        }
    }

    isValid() {
        const fields = this.element.find('input');
        let noError = true;
        for (let field of fields) {
            this.removeFieldError(field);
            if (field.checkValidity() == false) {
                this.setFieldError(field, field.validationMessage);
                if (noError) {
                    field.focus();
                    noError = false;
                }
            }
        }

        if (noError === false) {
            this.setError();
        }

        return noError;
    }

    send() {
        this.setLoading();
        const checkboxes = $(this.element.find('input[type=checkbox]:checked'));
        const adv = {
            name: this.element.find('#name').val(),
            price: this.element.find('#price').val(),
            isSale: this.element.find('#isSale').val(),
            tags: checkboxes.map((i, elem) => elem.value).get()
        };
        
        this.service.createAdvertisement(adv, () => {
            this.pubSub.publish('new-advertisement', adv);
            this.resetForm();
            this.setLoaded();
            this.showSuccessMessage(adv);
        }, error => {
            console.error('error', error);
            this.setErrorHtml(`Error sending advertisement: ${error.status} ${error.statusText}`);
            this.setError();
        });
    }

    removeFieldError(element) {
        $(element).removeClass('is-invalid');
        $(element).siblings('.invalid-feedback').remove();
    }

    setFieldError(element, message) {
        $(element).addClass('is-invalid');
        const errorMsg = `<div class="invalid-feedback">${message}</div>`;
        $(element).parent().append(errorMsg);
    }

    resetForm() {
        this.element[0].reset();
    }

    showSuccessMessage(adv) {
        const msg = $('#success-message');
        $(msg.find('p')[0]).html(`Advertisement <strong>${adv.name}</strong> created`);
        msg.addClass('d-block');
    }
}