import GameManager from "./Game";
import NumberUIController from "./NumberUIController";
import ChapterUIController from "./ChapterUIController";
import DialogUIController from "./DialogUIController";
import { CSVToDicts } from "./Utils";
import { RawDialogInfo, RawChapterInfo } from "./TableData";
import { DialogInfo, ChapterInfo } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIController extends cc.Component {

    @property(cc.Sprite)
    cgSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    defaultCG: cc.SpriteFrame = null;

    @property(NumberUIController)
    numberUIController: NumberUIController = null;

    @property(ChapterUIController)
    chapterUIController: ChapterUIController = null;

    @property(DialogUIController)
    dialogUIController: DialogUIController = null;

    @property(cc.TextAsset)
    dialogData: cc.TextAsset = null;

    @property(cc.TextAsset)
    chapterData: cc.TextAsset = null;

    @property(cc.EditBox)
    debugSceneID: cc.EditBox = null;

    gameManager: GameManager = null;

    start () {
        this.dialogUIController.uiController = this;
        this.chapterUIController.uiController = this;
        let scenes = CSVToDicts(this.dialogData.text) as unknown[] as RawDialogInfo[];
        let chapters = CSVToDicts(this.chapterData.text) as unknown[] as RawChapterInfo[];
        this.gameManager = new GameManager(scenes, chapters);
        this.updateUI();
    }

    // move to next state
    // update number UI
    // but don't update other UI
    choose(choice: number) {
        this.gameManager.goNext(choice);
        this.numberUIController.updateUI(this.gameManager.numbers);
    }

    goNext(choice: number) {
        this.gameManager.goNext(choice);
        this.updateUI();
    }

    goTo(sceneID: number) {
        this.gameManager.goTo(sceneID);
        this.updateUI();
    }

    onDebugSceneIDEntered(editBox: cc.EditBox, _customEventData: string) {
        console.debug('debug scene ID entered');
        let sceneID = parseInt(editBox.string);
        this.goTo(sceneID);
    }

    updateUI() {
        let scene = this.gameManager.get();
        this.debugSceneID.string = this.gameManager.currentID.toString();
        if(scene instanceof DialogInfo) {
            this.dialogUIController.updateUI(scene);
            this.chapterUIController.exit();
            this.updateCG(scene.imageName);
        } else if(scene instanceof ChapterInfo) {
            this.chapterUIController.activate(scene);
        }
        this.numberUIController.updateUI(this.gameManager.numbers);
    }

    updateCG(name: string) {
        let imagePath = "CG/" + name;
        cc.loader.loadRes(imagePath, cc.SpriteFrame, (err, spriteFrame) => {
            if(err) {
                // no image found, use default
                spriteFrame = this.defaultCG;
            }
            this.cgSprite.spriteFrame = spriteFrame;
        });
    }
}
