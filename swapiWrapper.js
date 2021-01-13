const axios = require('axios');
const baseUrl = 'https://swapi.dev/api/';

const fetchAllPeople = async () => {
	let firstPage = await axios.get(`${baseUrl}people/`);
	let pageCount = Math.ceil(firstPage.data.count / firstPage.data.results.length);
	let pageLinks = [];
	for (let i = 2; i <= pageCount; i++) {
		pageLinks.push(`${baseUrl}people/?page=${i}`);
	}
	const lastPages = await Promise.all(
		pageLinks.map((link) => {
			return axios.get(link);
		})
	);
	const result = lastPages.reduce((acc, current) => {
		return acc.concat(current.data.results);
	}, firstPage.data.results);
	return result;
};
const fetchAllPlanets = async () => {
	let firstPage = await axios.get(`${baseUrl}planets/`);
	let pageCount = Math.ceil(firstPage.data.count / firstPage.data.results.length);
	let pageLinks = [];
	for (let i = 2; i <= pageCount; i++) {
		pageLinks.push(`${baseUrl}planets/?page=${i}`);
	}
	const lastPages = await Promise.all(
		pageLinks.map((link) => {
			return axios.get(link);
		})
	);
	const allPlanets = lastPages.reduce((acc, current) => {
		return acc.concat(current.data.results);
	}, firstPage.data.results);

	const result = Promise.all(
		allPlanets.map(async (planet) => {
			const residentPages = await Promise.all(
				planet.residents.map(async (residentLink) => {
					return axios.get(residentLink);
				})
			);
			const residentNames = residentPages.map((residentPage) => {
				return residentPage.data.name;
			});
			planet.residents = residentNames;
			return planet;
		})
	);
	return result;
};

module.exports = { fetchAllPeople, fetchAllPlanets };
