export default class FormHandler {
    #formElement
    #inputElements
    #alertElement
    constructor(idForm, idAlert) {
        this.#formElement = document.getElementById(idForm);
        this.#inputElements = document.querySelectorAll(`#${idForm} [name]`);
        this.#alertElement = document.getElementById(idAlert);
    }
    addHandler(fnProcessor) {
        this.#formElement.addEventListener('submit',async event => {
            event.preventDefault();
            const data = Array.from(this.#inputElements)
            .reduce((obj, element) => {
                obj[element.name] = element.value;
                return obj;
            }, {})
            const message = await fnProcessor(data);
            if (!message) {
                this.#formElement.reset(); //everything ok
                this.#alertElement.innerHTML = '';
            } else {
                const alert = ``;            
            this.#alertElement.innerHTML = alert;
            }
        })
    }
    fillOptions(idOptions, options ) {
        document.getElementById(idOptions).innerHTML += 
        `${getOptions(options)}`
    }
    show() {
        this.#formElement.hidden = false;
    }
    hide() {
        this.#formElement.hidden = true;
    }
}
function getOptions(options) {
    return options.map(o => `<option value="${o}">${o}</option>`).join('');
}