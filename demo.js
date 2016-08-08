angular.module('planningBoardDemo', ['platform-board']).controller('demoCtrl', function($scope) {
	'use strict';

	$scope.canMoveMyItem = function(id) {
		console.log('canMoveItem ' + id);
	}
	$scope.moveMyItem = function(id) {
		console.log('moveItem ' + id);
	}

	$scope.layout = {
		columnDefinition: {
			field: 'status',
			label: 'Status',
			values: [
			{
				value: 'new',
				label: 'New'
			},
			{
				value: 'open',
				label: 'Open'
			},
			{
				value: 'fixed',
				label: 'Fixed'
			},
			{
				value: 'closed',
				label: 'Closed'
			},
			]
		}
	};

	/*
 export class BoardLayout {
 columnDefinition:AxisDefinition;
 laneDefinition:AxisDefinition;
 }

 export class AxisDefinition {
 name:string;
 label:string;
 values:BoardCell[];
 field:string;
 }

 export class BoardCell {
 value:string;
 label:string;
 isCollapsed:boolean;
 customData:any;
 }

*/


});


