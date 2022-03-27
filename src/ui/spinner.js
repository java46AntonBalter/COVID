export default class Spinner {
    #spinnerElem
    constructor(parentId) {
        this.#spinnerElem = document.getElementById(parentId);

    }
    start() {
        this.#spinnerElem.hidden = false;
    } 
    stop() {
        this.#spinnerElem.hidden = true;
    }
}