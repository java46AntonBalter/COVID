import _ from "lodash";

export default class DataProcessor {
    #dataProvider
    constructor(dataProvider) {
        this.#dataProvider = dataProvider;
    }
    async getAllContinents(cacheInterval) {
        const continentCases = await this.#dataProvider.getContinentCases(cacheInterval);
        const res = Object.values(continentCases).map(e => {
            if (e[0].continent === 'Antarctica') {
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
    async getVaccinesStats(cacheInterval) {
        const vaccinesStats = await this.#dataProvider.vaccinesStats(cacheInterval);
        const stats = Object.values(vaccinesStats).map(e => {
            const updateDate = '' +  e.updated;
            return {
                countryName: e.country,
                vaccinatedPercent: _.round(((e.people_vaccinated / e.population)*100),2),
                partiallyVaccinatedPercent: _.round(((e.people_partially_vaccinated / e.population)*100),2),
                updated: `${updateDate.substring(0,10)}`
            }
        })
        const res = stats.filter(e => {
            return (e.countryName !== undefined) && (e.vaccinatedPercent !== 0) && (e.partiallyVaccinatedPercent !== 0);
        });
        return res;      
    }
    async getAllCountriesCases(cacheInterval) {
        const countries = await this.#dataProvider.getCasesCountryNames(cacheInterval);
        return countries;
    }
    async getAllCountriesDeaths(cacheInterval) {
        const countries = await this.#dataProvider.getDeathsCountryNames(cacheInterval);
        return countries;
    }
    #getDate(countries) {
        let res = '';
        for (let country of countries) {
            if (country.updated) {
                res = country.updated;
            }
        }
        return res;
    }
    #roundedPerPopulation(data, key) {
        return _.round(_.sumBy(data, key) / _.sumBy(data, 'population') * 100, 2);
    }
    async sortContinents(cacheInterval, key) {
        return _.sortBy(await this.getAllContinents(cacheInterval), key)
    }
    async sortVaccines(cacheInterval, key) {
        return _.sortBy(await this.getVaccinesStats(cacheInterval), key)
    }
    async getCountryHistoryStats(country, statKey, interval) {
        const countryStats = await this.#dataProvider.countryHistoryStats(country, statKey);
        const res =  this.#getStatsByIntervalArr(interval, countryStats);
        return res;
    }
    #getStatsByIntervalArr(interval, countryStats) {
        const count = Number(interval);
        const res = [];
        for (let i = 0; i <= (countryStats.length - 1); i = i + count) {
            if ((i + count) <= (countryStats.length - 1)) {
                const dateItemTo = countryStats[i];
                const dateItemFrom = countryStats[(i + count - 1)];
                const statsObj = {
                    dateFrom: `${dateItemFrom[0]}`,
                    dateTo: `${dateItemTo[0]}`,
                    confirmedCases: (Number(dateItemTo[1]) - Number(dateItemFrom[1]))
                };
                res.push(statsObj);
            } else {
                const dateItemTo = countryStats[i];
                const dateItemFrom = countryStats[(countryStats.length - 1)];
                const statsObj = {
                    dateFrom: `${dateItemFrom[0]}`,
                    dateTo: `${dateItemTo[0]}`,
                    confirmedCases: (Number(dateItemTo[1]) - Number(dateItemFrom[1]))
                };
                res.push(statsObj);
            }
        }
        return res;
    }
    async sortCasesHistory(key, country, statKey, interval) {
        return _.sortBy(await this.getCountryHistoryStats(country, statKey, interval), key)
    }
    async sortDeathsHistory(key, country, statKey, interval) {
        return _.sortBy(await this.getCountryHistoryStats(country, statKey, interval), key)
    }
}