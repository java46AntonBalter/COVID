import _ from "lodash";

export default class CovidDataMediaGroup {
    #baseUrl
    #continentsDataCache
    #countriesCasesDataCache
    #countriesDeathsDataCache
    #vaccinesDataCache
    constructor() {
        this.#baseUrl = 'https://covid-api.mmediagroup.fr/v1/';
        this.#continentsDataCache = { requestTime: undefined, data: undefined };
        this.#countriesCasesDataCache = { requestTime: undefined, data: undefined };
        this.#countriesDeathsDataCache = { requestTime: undefined, data: undefined };
        this.#vaccinesDataCache = { requestTime: undefined, data: undefined };
    }
    async getContinentCases(cacheInterval) {
        if (this.#continentsDataCache.requestTime && (Date.now() - this.#continentsDataCache.requestTime < cacheInterval)) {
            return this.#continentsDataCache.data;
        }
        const data = await this.#fetchServerData('cases');
        const continentData = Object.values(data).map(o => o.All).filter(c => !!c.continent);
        let continents = _.groupBy(continentData, 'continent');
        this.#continentsDataCache.requestTime = Date.now();
        this.#continentsDataCache.data = continents;
        return continents;
    }
    async #fetchServerData(request) {
        const dataResponse = await fetch(this.#baseUrl + request);
        const data = await dataResponse.json();
        return data;
    }

    async getCasesCountryNames(cacheInterval) {
        if (this.#countriesCasesDataCache.requestTime && (Date.now() - this.#countriesCasesDataCache.requestTime < cacheInterval)) {
            return this.#countriesCasesDataCache.data;
        }
        const data = await this.#fetchServerData('history?status=confirmed');
        const countriesArr = Object.keys(data);
        this.#countriesCasesDataCache.requestTime = Date.now();
        this.#countriesCasesDataCache.data = countriesArr;
        return this.#countriesCasesDataCache.data;
    }
    async getDeathsCountryNames(cacheInterval) {
        if (this.#countriesDeathsDataCache.requestTime && (Date.now() - this.#countriesDeathsDataCache.requestTime < cacheInterval)) {
            return this.#countriesDeathsDataCache.data;
        }
        const data = await this.#fetchServerData('history?status=deaths');
        const countriesArr = Object.keys(data);
        this.#countriesDeathsDataCache.requestTime = Date.now();
        this.#countriesDeathsDataCache.data = countriesArr;
        return this.#countriesDeathsDataCache.data;
    }
    async vaccinesStats(cacheInterval) {
        if (this.#vaccinesDataCache.requestTime && (Date.now() - this.#vaccinesDataCache.requestTime < cacheInterval)) {
            return this.#vaccinesDataCache.data;
        }
        const data = await this.#fetchServerData('vaccines');
        const countriesArr = Object.values(data).map(o => o.All);
        this.#vaccinesDataCache.requestTime = Date.now();
        this.#vaccinesDataCache.data = countriesArr;
        return this.#vaccinesDataCache.data;
    }
    async countryHistoryStats(country, key) {
        const data = await this.#fetchServerData(`/history?country=${country}&status=${key}`);
        const countryArr = Object.values(data).map(o => Object.entries(o.dates));
        const countryDates = countryArr[0];
        return countryDates;
    }
    
}