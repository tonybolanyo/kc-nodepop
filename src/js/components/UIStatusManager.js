import $ from 'jquery';

export default class UIStatusManager {

    constructor(selector) {
        this.uiStateClasses = "empty loading error partial loaded";
        this.element = $(selector);
    }

    setEmpty() {
        this.element.removeClass(this.uiStateClasses).addClass("empty");
    }

    setLoading() {
        this.element.removeClass(this.uiStateClasses).addClass("loading");
    }

    setError() {
        this.element.removeClass(this.uiStateClasses).addClass("error");
    }

    setPartial() {
        this.element.removeClass(this.uiStateClasses).addClass("partial");
    }

    setLoaded() {
        this.element.removeClass(this.uiStateClasses).addClass("loaded");
    }

    setEmptyHtml(html) {
        this.element.find(".ui-status.empty").html(html);
    }

    setLoadingHtml(html) {
        this.element.find(".ui-status.loading").html(html);
    }

    setErrorHtml(html) {
        this.element.find(".ui-status.error").html(html);
    }

    setPartialHtml(html) {
        this.element.find(".ui-status.partial").html(html);
    }

    setLoadedHtml(html) {
        this.element.find(".ui-status.loaded").html(html);
    }
}