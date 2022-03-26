import _ from 'lodash'
import config from './config/config.json';
import CovidDataMediaGroup from './service/covid-data-mediagroup';
import DataProcessor from './service/data_processor';
import FormHandler from './ui/form_handler';
import TableHandler from './ui/table_handler';
import NavigatorButtons from './ui/navigator_buttons';
import Spinner from './ui/spinner';
import Alert from './ui/alert';
const serverAlert = new Alert("alert");
const spinner = new Spinner("spinner");
const navigator = new NavigatorButtons(["0", "1", "2", "3"])
const dataProvider = new CovidDataMediaGroup();
const dataProcessor = new DataProcessor(dataProvider);
let country;
let interval;
const continentsTable = new TableHandler([
    {key : 'continent', displayName : 'Continent Name'},
    {key : 'confirmed', displayName : 'Percent of the confirmed cases from the population '},
    {key : 'deaths', displayName : 'Percent of the death cases from the population'},
    {key : 'updated', displayName : 'Date and Time of the update'}
], "table-continents", "sortContinents");
const vaccinesTable = new TableHandler([
    {key : 'countryName', displayName : 'Country name'},
    {key : 'vaccinatedPercent', displayName : 'Vaccinated percent of population'},
    {key : 'partiallyVaccinatedPercent', displayName : 'Partially vaccinated percent of population'},
    {key : 'updated', displayName : 'Date of the update'}
], "table-vaccines", "sortVaccines");
const casesForm = new FormHandler("casesForm", "alert");
const casesHistoryTable = new TableHandler([
    {key : 'dateFrom', displayName : 'Date From'},
    {key : 'dateTo', displayName: 'Date To'},
    {key : 'confirmedCases', displayName: 'Confirmed Cases'}
], "table-infections", "sortCasesHistory");    
const deathsForm = new FormHandler("deathsForm", "alert");
const deathsHistoryTable = new TableHandler([
    {key : 'dateFrom', displayName : 'Date From'},
    {key : 'dateTo', displayName: 'Date To'},
    {key : 'confirmedCases', displayName: 'Confirmed Cases'}
], "table-deaths", "sortDeathHistory");   


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

casesForm.addHandler(async (casesForm) => {
    const countryStats = await requestWithSpinner(dataProcessor.getCountryHistoryStats(casesForm.countries, "confirmed", casesForm.interval));
    country = casesForm.countries;
    interval = casesForm.interval;
    casesHistoryTable.hideTable();
    casesHistoryTable.showTable(countryStats);
})
deathsForm.addHandler(async (deathsForm) => {
    const countryStats = await requestWithSpinner(dataProcessor.getCountryHistoryStats(deathsForm.countries, "deaths", deathsForm.interval));
    country = deathsForm.countries;
    interval = deathsForm.interval;
    deathsHistoryTable.hideTable();
    deathsHistoryTable.showTable(countryStats);
})

function hide() {
    serverAlert.hideAlert();
    continentsTable.hideTable();  
    casesHistoryTable.hideTable(); 
    deathsHistoryTable.hideTable(); 
    vaccinesTable.hideTable();
    casesForm.hide();
    deathsForm.hide();
    spinner.stop();
}

window.showContinents = async () => {
    hide();
    navigator.setActive(0);
    continentsTable.showTable(await requestWithSpinner(dataProcessor.getAllContinents(config.cacheInterval)));
}
window.sortContinents = async (key) => {
    continentsTable.showTable(await requestWithSpinner(dataProcessor.sortContinents(config.cacheInterval, key)));    
}
window.showVaccineData = async () => {
    hide();
    navigator.setActive(3);
    vaccinesTable.showTable(await requestWithSpinner(dataProcessor.getVaccinesStats(config.cacheInterval)));
}
window.sortVaccines = async (key) => {
    vaccinesTable.showTable(await requestWithSpinner(dataProcessor.sortVaccines(config.cacheInterval, key)));    
}
window.showConfirmedCasesHistory = async () => {
    hide();
    navigator.setActive(1);
    const countries = await requestWithSpinner(dataProcessor.getAllCountriesCases(config.cacheInterval));
    document.getElementById("country-cases").innerHTML = `<option value hidden disabled selected>--Select country--</option>`;
    document.getElementById("interval-cases").innerHTML = `<option value hidden disabled selected>--Select interval(days)--</option>`;
    casesForm.fillOptions("country-cases", countries);
    casesForm.fillOptions("interval-cases", config.statIntervals);
    casesForm.show();
}
window.sortCasesHistory = async (key) => {
    casesHistoryTable.showTable(await requestWithSpinner(dataProcessor.sortCasesHistory(key, country, "confirmed", interval)));    
}
window.showDeathCasesHistory = async () => {
    hide();
    navigator.setActive(2);
    const countries = await requestWithSpinner(dataProcessor.getAllCountriesDeaths(config.cacheInterval));
    document.getElementById("country-deaths").innerHTML = `<option value hidden disabled selected>--Select country--</option>`;
    document.getElementById("interval-deaths").innerHTML = `<option value hidden disabled selected>--Select interval(days)--</option>`;
    deathsForm.fillOptions("country-deaths", countries);
    deathsForm.fillOptions("interval-deaths", config.statIntervals);
    deathsForm.show();
}
window.sortDeathHistory = async (key) => {
    deathsHistoryTable.showTable(await requestWithSpinner(dataProcessor.sortDeathsHistory(key, country, "deaths", interval)));    
}
