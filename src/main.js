import _ from 'lodash'
import cacheInterval from './config/config.json';
import CovidDataMediaGroup from './service/covid-data-mediagroup';
import DataProcessor from './service/data_processor';
import FormHandler from './ui/form_handler';
import TableHandler from './ui/table_handler';
import NavigatorButtons from './ui/navigator_buttons';
import Spinner from './ui/spinner';
import Alert from './ui/alert';
import countries from './config/countries.json';
const serverAlert = new Alert("alert");
const spinner = new Spinner("spinner");
const navigator = new NavigatorButtons(["0", "1", "2", "3"])
const dataProvider = new CovidDataMediaGroup();
const dataProcessor = new DataProcessor(dataProvider);
const continentsTable = new TableHandler([
    {key : 'continent', displayName : 'Continent Name'},
    {key : 'confirmed', displayName : 'Percent of the confirmed cases from the population '},
    {key : 'deaths', displayName : 'Percent of the death cases from the population'},
    {key : 'updated', displayName : 'Date and Time of the update'}
], "table", "sortContinents");
const casesForm = new FormHandler("cases-form");
casesForm.fillOptions("countries-options", countries.countryOptions);
casesForm.fillOptions("interval-options", countries.intervals);
async function requestWithSpinner(promise) {
    spinner.start();
    serverAlert.hideAlert();
    let res;
    try {
         res = await promise;
    } catch (err) {
        hide();
        serverAlert.showAlert
        (`${err} server ${URL} is unavailable, repeat request later on`, 'danger')
    }
    spinner.stop();
    return res;
}

function hide() {
    serverAlert.hideAlert();
    continentsTable.hideTable();  
    casesForm.hide();
    spinner.stop();
}

window.showContinents = async () => {
    hide();
    navigator.setActive(0);
    continentsTable.showTable(await requestWithSpinner(dataProcessor.getAllContinents(cacheInterval)));
}
window.sortContinents = async (key) => {
    continentsTable.showTable(await requestWithSpinner(dataProcessor.sortContinents(key)));    
}
window.showConfirmedCasesHistory = () => {
    hide();
    navigator.setActive(1);
    casesForm.show();
}