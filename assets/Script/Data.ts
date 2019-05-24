/// Structures used in the game

import * as table from "./TableData";

/// A effect to the number system
export class Effect {
	SS?: number;	// 税收
	JS?: number;	// 军事
	NG?: number;	// 内阁
	SW?: number;	// 声望

	static parse(json: string): Effect {
		return json? JSON.parse(json): {};
	}
}

/// Number system
export class NumberSystem {
	SS: number = 0;
	JS: number = 0;
	NG: number = 0;
	SW: number = 0;

	apply(effect: Effect) {
		this.SS += effect.SS? effect.SS: 0;
		this.JS += effect.JS? effect.JS: 0;
		this.NG += effect.NG? effect.NG: 0;
		this.SW += effect.SW? effect.SW: 0;
	}
}

export class ButtonInfo {
	text: string;
	nextSceneID: number;
	effect: Effect;
}

export class DialogInfo {
	sceneID: number;
	imageName: string;
	speaker: string;
	avatar: string;
	text: string;
	nextSceneID?: number;
	buttons: ButtonInfo[];
	isSceneOver: boolean;

	constructor(info: table.RawDialogInfo) {
		this.sceneID = parseInt(info.sceneID);
		this.imageName = info.imageName;
		this.speaker = info.speaker;
		this.avatar = info.avatar;
		this.text = info.text;
		this.isSceneOver = info.isSceneOver === '1';

		if(info.hasChoice === '1') {
			let button1 = new ButtonInfo();
			button1.text = info.buttonText1;
			button1.nextSceneID = parseInt(info.nextID1);
			button1.effect = Effect.parse(info.result1);
	
			let button2 = new ButtonInfo();
			button2.text = info.buttonText2;
			button2.nextSceneID = parseInt(info.nextID2);
			button2.effect = Effect.parse(info.result2);
			
			this.buttons = [button1, button2];
		} else {
			this.nextSceneID = parseInt(info.nextID1);
			this.buttons = [];
		}
	}
}

export class NumberInfo {
	name: string;
	key: string;
	init: number;
	description: string;
	highDescription: string;
	highEndID: number;
	lowDescription: string;
	lowEndID: number;

	constructor(info: table.RawNumberInfo) {
		this.name = info.name;
		this.key = info.name;
		this.init = parseInt(info.init);
		this.description = info.description;
		this.highDescription = info.highDescription;
		this.lowDescription = info.lowDescription;
		this.highEndID = parseInt(info.highEndID);
		this.lowEndID = parseInt(info.lowEndID);
	}
}

export class ChapterInfo {
	sceneID: number;
	imageName: string;
	speaker: string;
	text: string;
	help: string;
	option1: string;
	result1: Effect;
	feedback1: string;
	option2: string;
	result2: Effect;
	feedback2: string;
	nextID: number;

	constructor(info: table.RawChapterInfo) {
		this.sceneID = parseInt(info.sceneID);
		this.imageName = info.imageName;
		this.speaker = info.speaker;
		this.text = info.text;
		this.help = info.help;
		this.option1 = info.option1;
		this.result1 = Effect.parse(info.result1);
		this.feedback1 = info.feedback1;
		this.option2 = info.option2;
		this.result2 = Effect.parse(info.result2);
		this.feedback2 = info.feedback2;
		this.nextID = parseInt(info.nextID);
	}
}