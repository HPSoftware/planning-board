/*
 (c) Copyright 2016 Hewlett Packard Enterprise Development LP

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */


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


