import _ from "lodash";

export default class CovidDataMediaGroup {
    #baseUrl
    #continentsDataCache
    constructor() {
        this.#baseUrl = 'https://covid-api.mmediagroup.fr/v1/';
        this.#continentsDataCache = {requestTime: undefined, data: undefined};

    }
    async getContinentCases(cacheInterval) {
        if (this.#continentsDataCache.requestTime && (Date.now - this.#continentsDataCache.requestTime < cacheInterval)) {
            return this.#continentsDataCache.data;
        }
        const dataResponse = await fetch(this.#baseUrl + 'cases');
        const data = await dataResponse.json();
        const continentData = Object.values(data).map(o => o.All).filter(c => !!c.continent);
        let continents =  _.groupBy(continentData, 'continent');
        this.#continentsDataCache.requestTime = Date.now();
        this.#continentsDataCache.data = continents;
        return continents;
    }
    
}