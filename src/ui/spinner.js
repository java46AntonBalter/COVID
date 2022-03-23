export default class Spinner {
    #spinnerElem
    constructor(parentId) {
        this.#spinnerElem = document.getElementById(parentId);

    }
    start() {
        this.#spinnerElem.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle');        
        this.#spinnerElem.innerHTML = '<div class="spinner-border text-primary" style="width: 6rem; height: 6rem;" role="status"><span class="visually-hidden">Loading...</span></div>';
    }
    stop() {
        this.#spinnerElem.removeAttribute("class");
        this.#spinnerElem.innerHTML = '';
    }
}