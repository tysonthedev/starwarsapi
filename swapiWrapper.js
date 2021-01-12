const baseUrl = 'https://swapi.dev/api/';
const axios = require('axios');

const fetchAllPeople = async () => {
	let firstPage = await axios.get(`${baseUrl}people/`);
	let pageCount = Math.ceil(firstPage.data.count / firstPage.data.results.length);
	let pageLinks = [];
	for (let i = 2; i <= pageCount; i++) {
		pageLinks.push(`${baseUrl}people/?page=${i}`);
	}
	const allPages = await Promise.all(
		pageLinks.map((link) => {
			return axios.get(link);
		})
	);
	const result = allPages.reduce((acc, current) => {
		return acc.concat(current.data.results);
	}, firstPage.data.results);
	return result;
};
const fetchAllPlanets = async () => {};

module.exports = { fetchAllPeople, fetchAllPlanets };
