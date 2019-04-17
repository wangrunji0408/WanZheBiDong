import { DialogInfo, NumberSystem, ChapterInfo } from "./Data";
import { RawDialogInfo, RawChapterInfo } from "./TableData";

/// Game logic state machine
export default class GameManager {
	scenes: { [id: number]: DialogInfo | ChapterInfo } = {};
	currentID: number = 1;
	numbers: NumberSystem = new NumberSystem();

	constructor(scenes: RawDialogInfo[], chapters: RawChapterInfo[]) {
		for(let rawInfo of scenes) {
			let info = new DialogInfo(rawInfo);
			this.scenes[info.sceneID] = info;
		}
		for(let rawInfo of chapters) {
			let info = new ChapterInfo(rawInfo);
			this.scenes[info.sceneID] = info;
		}
		console.log(this.scenes);
	}

	reset() {
		this.currentID = 1;
	}

	get(): DialogInfo | ChapterInfo {
		return this.scenes[this.currentID];
	}

	goNext(choice: number) {
		let scene = this.get(); 
		if(scene instanceof DialogInfo) {
			if(scene.nextSceneID == null) {
				// choice
				let button = scene.buttons[choice];
				this.currentID = button.nextSceneID;
				this.numbers.apply(button.effect);
			} else {
				// no choice
				this.currentID = scene.nextSceneID;
			}
		} else if(scene instanceof ChapterInfo) {
			this.currentID = scene.nextID;
		}
		console.debug(`goto: ${this.currentID}`);
		// check new sceneID
		if(!(this.currentID in this.scenes)) {
			throw `invalid scene ID ${this.currentID}`;
		}
	}
}
