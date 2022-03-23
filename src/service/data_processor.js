import _ from "lodash";

export default class DataProcessor {
    #dataProvider
    constructor(dataProvider) {
        this.#dataProvider = dataProvider;
    }
    async getAllContinents() {
        const continentCases = await this.#dataProvider.getContinentCases();
        const res = Object.values(continentCases).map(e => {
            if (e[0].continent === 'Antarctica'){
                e[0].population = 3000;
            }
            return {
                continent: e[0].continent,
                confirmed: this.#roundedPerPopulation(e, 'confirmed'),
                deaths: this.#roundedPerPopulation(e, 'deaths'),
                updated: this.#getDate(e)
            }
        })
        return res;
    }
    #getDate(countries){
        let res = '';
        for(let country of countries) {
            if (country.updated) {
                res = country.updated;
            }
        }
        return res;
    }
    #roundedPerPopulation(data, key) {
        return _.round(_.sumBy(data, key) / _.sumBy(data, 'population') * 100, 2);
    }
    async sortContinents(key) {
        return _.sortBy(await this.getAllContinents(), key)
    }
}