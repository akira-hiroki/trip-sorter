import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Components from './components/components';
import AppComponent from './app.component';
import ngMaterial from 'angular-material';
import * as _ from 'lodash';

import 'normalize.css';
import 'angular-material/angular-material.css';

angular.module('app', [
    uiRouter,
    Components,
    ngMaterial
  ])
  .config(($locationProvider) => {
    "ngInject";
    $locationProvider.html5Mode(true).hashPrefix('!');
  })

  .component('app', AppComponent);
