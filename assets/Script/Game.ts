import { DialogInfo, NumberSystem, ChapterInfo, QuestionInfo, EndingInfo } from "./Data";
import { RawDialogInfo, RawChapterInfo, RawQuestionInfo, RawEndingInfo, RawNumberInfo } from "./TableData";

type State = DialogInfo | ChapterInfo | QuestionInfo | EndingInfo;

/// Game logic state machine
export default class GameManager {
	scenes: { [id: number]: State } = {};
	lastID: number = 0;
	currentID: number = GameManager.INIT_SCENE_ID;
	numbers: NumberSystem = new NumberSystem();

	static INIT_SCENE_ID = 1000;

	constructor(
		scenes: RawDialogInfo[], 
		chapters: RawChapterInfo[], 
		questions: RawQuestionInfo[],
		numbers: RawNumberInfo[],
		endings: RawEndingInfo[],
	) {
		for(let rawInfo of scenes) {
			let info = new DialogInfo(rawInfo);
			this.scenes[info.sceneID] = info;
		}
		for(let rawInfo of chapters) {
			let info = new ChapterInfo(rawInfo);
			this.scenes[info.sceneID] = info;
		}
		for(let rawInfo of questions) {
			let info = new QuestionInfo(rawInfo);
			this.scenes[info.sceneID] = info;
		}
		for(let rawInfo of endings) {
			let info = new EndingInfo(rawInfo);
			this.scenes[info.endID] = info;
		}
		console.log(this.scenes);
	}

	reset() {
		this.lastID = 0;
		this.currentID = GameManager.INIT_SCENE_ID;
	}

	get(): State {
		return this.scenes[this.currentID];
	}

	goNext(choice: number) {
		let scene = this.get(); 
		if(scene instanceof DialogInfo) {
			if(scene.nextSceneID == null) {
				// choice
				let button = scene.buttons[choice];
				this.numbers.apply(button.effect);
				this.goTo(button.nextSceneID);
			} else {
				// no choice
				this.numbers.apply(scene.effect);
				this.goTo(scene.nextSceneID);
			}
		} else if(scene instanceof ChapterInfo) {
			let effect = choice === 0? scene.result1: scene.result2;
			this.numbers.apply(effect);
			this.goTo(scene.nextID);			
		} else if(scene instanceof QuestionInfo) {
			// effect only corrent
			if(choice === 0) {
				this.numbers.apply(scene.result);
			}
			this.goTo(scene.nextID);			
		}
		// check number
		let ending = this.numbers.getEnding();
		if(ending !== 0) {
			this.goTo(ending);
		}
	}

	goTo(sceneID: number) {
		this.lastID = this.currentID;
		this.currentID = sceneID;
		console.debug(`goto: ${this.currentID}`);
		// check new sceneID
		if(!(this.currentID in this.scenes)) {
			throw `invalid scene ID ${this.currentID}`;
		}
	}
}
