const Graph = require('node-dijkstra');

class HomeController {
	static $inject = ['$http', '$rootScope'];
  constructor($http, $rootScope) {
    this.name = 'home';

    this.cities = [];
    this.fromCity = 'London';
    this.toCity = 'Amsterdam';
    this.mode = 'Cheapest';
    this.totalCost = 0;
    this.totalHours = 0;
    this.totalMinutes = 0;
    this.$http = $http;
    this.$rootScope = $rootScope;

    this.getData();  

    this.trackOptionChange();
  }

  getData() { 	
    this.$http.get('app/response.json').then((response) => {
    	this.mainInfo = response.data;
    	let cities = _.map(this.mainInfo.deals, 'departure');
  		cities = _.uniq(cities);
  		this.cities = cities;
    });
  }

  trackOptionChange() {
  	this.$rootScope.$watch(() => {
  		return this.mode;
  	}, (value) => {
  		if (this.mainInfo) {
  			this.search();
  		}
  	});
  }

  reset() {
  	this.fromCity = 'London';
    this.toCity = 'Amsterdam';
    this.mode = 'Cheapest';
    this.pathObject = null;
  }

  search() {
  	if (this.mode === 'Cheapest') {
  		this.cheapestSearch();
  	} else if (this.mode === 'Fastest') {
  		this.fastestSearch();
  	}
  }

  cheapestSearch() {
  	const route = new Graph();

	  let pathObj = [];
  	_.forEach(this.mainInfo.deals, (deal) => {
  		let obj = [];
  		obj.push(deal.departure);
  		obj.push(deal.arrival);
  		pathObj.push(obj);
  	});
  	
  	pathObj = _.map(
  		_.uniq(
  			_.map(pathObj, function(obj) {
  				return JSON.stringify(obj);
  			})
  		), function(obj) {
  			return JSON.parse(obj);
  		}
  	);

  	let minPaths = [];
  	_.forEach(pathObj, (path) => {
  		let weightObj = [];
  		_.forEach(this.mainInfo.deals, (deal) => {
  			if (deal.departure === path[0] && deal.arrival === path[1])
  				weightObj.push(deal);
  		});
  		weightObj = _.minBy(weightObj, 'cost');
  		minPaths.push(weightObj);
  	})

  	let cities = _.map(this.mainInfo.deals, 'departure');
  	cities = _.uniq(cities);
  	_.forEach(cities, (city) => {
	  	let weightObj = {};
  		_.forEach(minPaths, (deal) => {
  			if (deal.departure === city) {
  				weightObj[deal.arrival] = deal.cost;
  			};
	  	});
	  	route.addNode(city, weightObj);
  	});

  	let paths = route.path(this.fromCity, this.toCity);
  	let first = _.first(paths, 1);
  	let pathObject = [];
  	let totalHours = 0, totalMinutes = 0, totalCost = 0;
  	_.forEach(paths, (path) => {
  		if (path !== first) {
  			_.forEach(minPaths, (deal) => {
  				if (deal.departure === first && deal.arrival === path) {
  					first = path;
  					totalCost += parseInt(deal.cost);
  					totalHours += parseInt(deal.duration.h);
  					totalMinutes += parseInt(deal.duration.m);
  					pathObject.push(deal);
  				}
  			});
  		}
  	});

  	this.pathObject = pathObject;
  	this.pathObject = pathObject;
  	this.totalCost = totalCost;
  	this.totalHours = totalHours + Math.floor(totalMinutes / 60);
  	this.totalMinutes = totalMinutes % 60;
  }

  fastestSearch() {
  	const route = new Graph();

	  let pathObj = [];
  	_.forEach(this.mainInfo.deals, (deal) => {
  		let obj = [];
  		obj.push(deal.departure);
  		obj.push(deal.arrival);
  		pathObj.push(obj);
  	});
  	
  	pathObj = _.map(
  		_.uniq(
  			_.map(pathObj, function(obj) {
  				return JSON.stringify(obj);
  			})
  		), function(obj) {
  			return JSON.parse(obj);
  		}
  	);

  	let minPaths = [];
  	_.forEach(pathObj, (path) => {
  		let weightObj = [];
  		_.forEach(this.mainInfo.deals, (deal) => {
  			if (deal.departure === path[0] && deal.arrival === path[1])
  				weightObj.push(deal);
  		});
  		weightObj = _.minBy(weightObj, 'duration');
  		minPaths.push(weightObj);
  	})

  	let cities = _.map(this.mainInfo.deals, 'departure');
  	cities = _.uniq(cities);
  	_.forEach(cities, (city) => {
	  	let weightObj = {};
  		_.forEach(minPaths, (deal) => {
  			if (deal.departure === city) {
  				weightObj[deal.arrival] = deal.cost;
  			};
	  	});
	  	route.addNode(city, weightObj);
  	});

  	let paths = route.path(this.fromCity, this.toCity);
  	let first = _.first(paths, 1);
  	let pathObject = [];
  	let totalHours = 0, totalMinutes = 0, totalCost = 0;
  	_.forEach(paths, (path) => {
  		if (path !== first) {
  			_.forEach(minPaths, (deal) => {
  				if (deal.departure === first && deal.arrival === path) {
  					first = path;
  					totalCost += parseInt(deal.cost);
  					totalHours += parseInt(deal.duration.h);
  					totalMinutes += parseInt(deal.duration.m);
  					pathObject.push(deal);
  				}
  			});
  		}
  	});

  	this.pathObject = pathObject;
  	this.totalCost = totalCost;
  	this.totalHours = totalHours + Math.floor(totalMinutes / 60);
  	this.totalMinutes = totalMinutes % 60;
  }
}

export default HomeController;
