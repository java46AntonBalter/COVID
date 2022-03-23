export default class Alert {
    #alertParentElem
    constructor(idParent) {
        this.#alertParentElem = document.getElementById(idParent)
    }
    showAlert(message, type) {
        const alert = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
             ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        this.#alertParentElem.innerHTML = alert;
    }
    hideAlert() {
        this.#alertParentElem.innerHTML = "";
    }
}