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

	getEnding(): number {
		// Hard code
		if(this.SS > 100)
			return 7001;
		if(this.SS <= 0)
			return 7002;
		if(this.JS <= 0)
			return 7003;
		if(this.NG > 100)
			return 7004;
		if(this.NG <= 0)
			return 7005;
		if(this.SW <= 0)
			return 7006;
		return 0;
	}

	constructor() {
		// Hard code
		this.SS = 50;
		this.JS = 100;
		this.NG = 50;
		this.SW = 25;
	}
}

/// 游戏存档
export class UserData {
	/// 第i章开始时的数值 i=1-6
	numbers: NumberSystem[] = [null, new NumberSystem(), null, null, null, null, null];

	static value: UserData = new UserData();

	static save() {
		let json = JSON.stringify(UserData.value);
		cc.sys.localStorage.setItem('data', json);
	}

	static load() {
		this.value = new UserData();
		let json = cc.sys.localStorage.getItem('data');
		if(json) {
			let o = JSON.parse(json);
			this.value.numbers = o.numbers;
		}
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
	effect?: Effect;
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
			this.effect = Effect.parse(info.result1);
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
	option: number;
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
		this.option = info.option === ''? null: parseInt(info.option) - 1;
		this.nextID = parseInt(info.nextID);
	}
}

export class QuestionInfo {
	sceneID: number;
	imageName: string;
	question: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	result: Effect;
	nextID: number;

	constructor(info: table.RawQuestionInfo) {
		this.sceneID = parseInt(info.sceneID);
		this.imageName = info.imageName;
		this.question = info.question;
		this.option1 = info.option1;
		this.option2 = info.option2;
		this.option3 = info.option3;
		this.option4 = info.option4;
		this.result = Effect.parse(info.result);
		this.nextID = parseInt(info.nextID);		
	}
}

export class EndingInfo {
	endID: number;
	imageName: string;
	title: string;
	description: string;
	hint: string;

	constructor(info: table.RawEndingInfo) {
		this.endID = parseInt(info.endID);
		this.imageName = info.imageName;
		this.title = info.title;
		this.description = info.description;
		this.hint = info.hint;
	}
}
