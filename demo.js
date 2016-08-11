angular.module('planningBoardDemo', ['platform-board']).controller('demoCtrl', function($scope) {
	'use strict';

	this.canMoveMyItem = function(id) {
		console.log('canMoveItem ' + id);
	}
	this.moveMyItem = function(id) {
		console.log('moveItem ' + id);
	}

	this.configurations = {
		'Statuses': {
			layout: {
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
					}
				]
			}
		},
			dataSets: [
				{

				}
			]

		},
		'Week Planner': {
			layout: {
				columnDefinition: {
					field: 'day',
					label: 'Day of week',
					values: [
						{
							value: 'mon',
							label: 'Monday'
						},
						{
							value: 'tue',
							label: 'Tuesday'
						},
						{
							value: 'wed',
							label: 'Wednesday'
						},
						{
							value: 'thu',
							label: 'Thursday'
						},
						{
							value: 'fri',
							label: 'Friday'
						},
						{
							value: 'sat',
							label: 'Saturday'
						},
						{
							value: 'sun',
							label: 'Sunday'
						}
					]
				}
			},
			dataSets: [
				{

				}
			]
		}
	};
	this.selectedConfiguration = this.configurations['Week Planner'];

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


