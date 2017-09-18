import UIStatusManager from "./UIStatusManager";

export default class AdvertisementManager extends UIStatusManager {

    constructor(selector, service) {
        super(selector);
        this.service = service;
    }

    init() {
        this.loadAdvertisements();
    }

    loadAdvertisements() {
        this.service.listAdvertisements(
            articles => {
                if (articles.lenght === 0) {
                    this.setEmpty();
                } else {
                    let html = "";
                    console.log(articles);
                    for (let item of articles) {
                        console.log(item);
                        html += this.renderAdvertisement(item);
                    }
                    this.setLoadedHtml(html);
                    this.setLoaded();
                }
            }, error => {
                this.setError();
            }
        );
    }

    renderAdvertisement(item) {
        return `
        <div class="card">
            <img class="card-img-top img-fluid" src="http://lorempixel.com/400/200" alt="${item.name}">
            <div class="card-block">
                <h4 class="card-title">${item.name}</h4>
                <p class="card-text">&dollar;${item.price}</p>
                <p class="card-text"><small class="text-muted">${item.isSale}</small></p>
            </div>
        </div>
        `
    }
}
