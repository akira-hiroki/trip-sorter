import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
//import homeService from './home.service';

let homeModule = angular.module('home', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      component: 'home'
    });
})

.component('home', homeComponent)
.service('homeService', ['$http', '$q', function($http, $q) {
	return {
		getData: function() {
			return $q((resolve, reject) => {
				$http('app/response.json').then((response) => {
					resolve(response);
				}, (error) => {
					reject(error);
				});
			});
		}
	};
}])
  
.name;

export default homeModule;
