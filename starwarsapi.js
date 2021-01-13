const express = require('express');
const app = express();
const swapiWrapper = require('./swapiWrapper');
const hostname = '127.0.0.1';
const port = 5000;

const getAllPeople = async (sortBy) => {
	const parseNumber = (whichNumber) => {
		whichNumber = whichNumber.replace(',', '');
		if (isNaN(whichNumber)) {
			return 0;
		} else return parseInt(whichNumber);
	};
	const sortByName = (whatToSort) => {
		whatToSort = whatToSort.sort(function (a, b) {
			return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
		});
		return whatToSort;
	};
	const sortByHeight = (whatToSort) => {
		whatToSort = whatToSort.sort(function (a, b) {
			return parseNumber(a.height) < parseNumber(b.height)
				? -1
				: parseNumber(a.height) > parseNumber(b.height)
				? 1
				: 0;
		});
		return whatToSort;
	};
	const sortByMass = (whatToSort) => {
		whatToSort = whatToSort.sort(function (a, b) {
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

	let allPeople = await swapiWrapper.fetchAllPeople();
	if (sortBy != undefined) return sortTypes[sortBy](allPeople);
	else return allPeople;
};
//swapi.dev
const getAllPlanets = async () => {
	return await swapiWrapper.fetchAllPlanets();
};
app.get('/people', async (req, res) => {
	const allPeople = await getAllPeople(req.query.sortBy);
	res.json(allPeople);
});

app.get('/planets', async (req, res) => {
	const allPlanets = await getAllPlanets();
	res.json(allPlanets);
});

const server = app.listen(port, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log('Node JS server started!');
});
