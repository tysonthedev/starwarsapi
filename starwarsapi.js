const express = require('express');
const https = require('https');
const app = express();
const axios = require('axios');
const { parse } = require('path');
const hostname = '127.0.0.1';
const port = 5000;
//swapi.dev
//const baseUrl = 'https://swapi.dev/api/';
//swapi-deno
const baseUrl = 'https://swapi-deno.azurewebsites.net/api/';

//swapi.dev
/*
const getAllPeople = async (sortBy) => {
	const parseNumber = (whichNumber) => {
		whichNumber = whichNumber.replace(',', '');
		if (isNaN(whichNumber)) {
			return 0;
		} else return parseInt(whichNumber);
	};
	const sortByName = (whatToSort) => {
		whatToSort.results = whatToSort.results.sort(function (a, b) {
			return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
		});
		return whatToSort;
	};
	const sortByHeight = (whatToSort) => {
		whatToSort.results = whatToSort.results.sort(function (a, b) {
			return parseNumber(a.height) < parseNumber(b.height)
				? -1
				: parseNumber(a.height) > parseNumber(b.height)
				? 1
				: 0;
		});
		return whatToSort;
	};
	const sortByMass = (whatToSort) => {
		whatToSort.results = whatToSort.results.sort(function (a, b) {
			return parseNumber(a.mass) < parseNumber(b.mass)
				? -1
				: parseNumber(a.mass) > parseNumber(b.mass)
				? 1
				: 0;
		});
		return whatToSort;
	};
	const sortTypes = {
		name: sortByName,
		height: sortByHeight,
		mass: sortByMass,
	};
	if (sortBy != undefined) {
		if (sortTypes[sortBy] == undefined) {
			return { error: `Invalid sortBy. Valid values are: ${Object.keys(sortTypes)}` };
		}
	}

	var allPeople = { results: [] };
	var nextPage = `${baseUrl}people/`;
	while (nextPage != null) {
		try {
			var returnData = await (await axios.get(nextPage)).data;
			nextPage = returnData['next'];
			allPeople.results.push(...returnData.results);
		} catch (error) {
			return { error: `All People Error: ${error}` };
		}
	}
	if (sortBy != undefined) return sortTypes[sortBy](allPeople);
	else return allPeople;
};
*/
//swapi-deno
const getAllPeople = async (sortBy) => {
	const parseNumber = (whichNumber) => {
		whichNumber = whichNumber.replace(',', '');
		if (isNaN(whichNumber)) {
			return 0;
		} else return parseInt(whichNumber);
	};
	const sortByName = (whatToSort) => {
		whatToSort.results = whatToSort.results.sort(function (a, b) {
			return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
		});
		return whatToSort;
	};
	const sortByHeight = (whatToSort) => {
		whatToSort.results = whatToSort.results.sort(function (a, b) {
			return parseNumber(a.height) < parseNumber(b.height)
				? -1
				: parseNumber(a.height) > parseNumber(b.height)
				? 1
				: 0;
		});
		return whatToSort;
	};
	const sortByMass = (whatToSort) => {
		whatToSort.results = whatToSort.results.sort(function (a, b) {
			return parseNumber(a.mass) < parseNumber(b.mass)
				? -1
				: parseNumber(a.mass) > parseNumber(b.mass)
				? 1
				: 0;
		});
		return whatToSort;
	};
	const sortTypes = {
		name: sortByName,
		height: sortByHeight,
		mass: sortByMass,
	};
	if (sortBy != undefined) {
		if (sortTypes[sortBy] == undefined) {
			return { error: `Invalid sortBy. Valid values are: ${Object.keys(sortTypes)}` };
		}
	}

	var allPeople = { results: [] };
	try {
		var returnData = await (await axios.get(`${baseUrl}people/`)).data;
		nextPage = returnData['next'];
		allPeople.results.push(...returnData);
	} catch (error) {
		return { error: `All People Error: ${error}` };
	}
	if (sortBy != undefined) return sortTypes[sortBy](allPeople);
	else return allPeople;
};
//swapi.dev
/*
const getAllPlanets = async () => {
	var allPlanets = { results: [] };
	var nextPage = `${baseUrl}planets/`;
	while (nextPage != null || nextPage != undefined) {
		try {
			var returnData = await (await axios.get(nextPage)).data;
			nextPage = returnData['next'];
			for await (let planet of returnData.results) {
				if (planet.residents != undefined) {
					const planetResidentsPromise = await axios.all(
						planet.residents.map((residentUrl) => {
							return axios.get(residentUrl);
						})
					);
					planet.residents = planetResidentsPromise.map((promiseObject) => {
						return promiseObject.data.name;
					});
				}
			}
			allPlanets.results.push(...returnData['results']);
		} catch (error) {
			return { error: `All Planets Error: ${error}` };
		}
	}
	return allPlanets;
};
*/
//swapi-deno
const getAllPlanets = async () => {
	var allPlanets = { results: [] };
	try {
		var returnData = await (await axios.get(`${baseUrl}planets/`)).data;
		nextPage = returnData['next'];
		for await (let planet of returnData) {
			if (planet.residents != undefined) {
				const planetResidentsPromise = await axios.all(
					planet.residents.map((residentId) => {
						return axios.get(`${baseUrl}people/${residentId}`);
					})
				);
				planet.residents = planetResidentsPromise.map((promiseObject) => {
					return promiseObject.data.name;
				});
			}
		}
		allPlanets.results.push(...returnData);
	} catch (error) {
		return { error: `All Planets Error: ${error}` };
	}
	return allPlanets;
};

app.get('/people', async (req, res) => {
	res.end(JSON.stringify(await getAllPeople(req.query.sortBy)));
});

app.get('/planets', async (req, res) => {
	res.end(JSON.stringify(await getAllPlanets()));
});

const server = app.listen(port, function () {
	//only for swapi.dev due to ssl cert being expired
	//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	var host = server.address().address;
	var port = server.address().port;
	console.log('Node JS server started!');
});
