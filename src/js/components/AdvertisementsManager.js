import UIStatusManager from './UIStatusManager';

export default class AdvertisementManager extends UIStatusManager {

    constructor(selector, service) {
        super(selector);
        this.service = service;
    }

    init() {
        this.loadAdvertisements();
    }

    loadAdvertisements() {
        const offset = this.getUrlParam('offset');
        const limit = this.getUrlParam('limit');
        const filters = {
            price: this.getUrlParam('price'),
            name: this.getUrlParam('name'),
            tag: this.getUrlParamArray('tag'),
            sale: this.getUrlParam('sale')
        };
        this.service.listAdvertisements(
            offset,
            limit,
            filters,
            articles => {
                if (articles.lenght === 0) {
                    this.setEmpty();
                } else {
                    let html = '';
                    for (let item of articles) {
                        html += this.renderAdvertisement(item);
                    }
                    html = `<div class="row">${html}</div>`;
                    this.setLoadedHtml(html);
                    this.setLoaded();
                }
            }, () => {
                this.setError();
            }
        );
    }

    renderAdvertisement(item) {
        const advType = (item.isSale) ? 'For sale' : 'Wanted';
        const picture = (item.picture) ? `images/advertisements/${item.picture}` : '#';
        const tags = this.getTagsHtml(item.tags);
        return `
        <div class="col-xs-12 col-sm-6 col-lg-4">
            <div class="card mb-3">
                <div class="card-header text-right"><small class="text-success">${advType}</small></div>
                <img class="card-img-top" src="${picture}" alt="${item.name}">
                <div class="card-body">
                    <h4 class="card-title">${item.name}</h4>
                    <p class="card-text">&dollar;${item.price}</p>
                </div>
                <div class="card-footer">
                    <p class="card-text">${tags}</p>
                </div>
            </div>
        </div>
        `;
    }

    getUrlParam (name) {
        const re = new RegExp('[?&]' + name + '=([^&#]*)');
        const result = re.exec(window.location.href);
        if (result == null) {
            return null;
        } else {
            return decodeURIComponent(result[1]) || 0;
        }
    }

    getUrlParamArray (name) {
        const re = new RegExp('[?&]' + name + '=([^&#]*)', 'g');
        const url = window.location.href;
        let matches;
        let results = [];
        do {
            matches = re.exec(url);
            if (matches) {
                const decodedResult = decodeURIComponent(matches[1]) || 0;
                results.push(decodedResult);
            }
        } while (matches);
        if (results.length === 0) {
            return null;
        } else {
            return results;
        }
    }

    getTagsHtml (tags) {
        let html = '';
        for(let tag of tags) {
            html += `<span class="badge badge-secondary">${tag}</span> `;
        }
        return html;
    }
}
