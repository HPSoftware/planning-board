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
