import GameManager from "./Game";
import NumberUIController from "./NumberUIController";
import ChapterUIController from "./ChapterUIController";
import DialogUIController from "./DialogUIController";
import QuestionUIController from "./QuestionUIController";
import EndingUIController from "./EndingUIController";
import { CSVToDicts } from "./Utils";
import { RawDialogInfo, RawChapterInfo, RawQuestionInfo, RawEndingInfo, RawNumberInfo } from "./TableData";
import { DialogInfo, ChapterInfo, QuestionInfo, EndingInfo } from "./Data";

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

    @property(QuestionUIController)
    questionUIController: QuestionUIController = null;

    @property(cc.TextAsset)
    dialogData: cc.TextAsset = null;

    @property(cc.TextAsset)
    chapterData: cc.TextAsset = null;

    @property(cc.TextAsset)
    questionData: cc.TextAsset = null;

    @property(cc.TextAsset)
    numberData: cc.TextAsset = null;

    @property(cc.TextAsset)
    endingData: cc.TextAsset = null;

    @property(cc.EditBox)
    debugSceneID: cc.EditBox = null;

    gameManager: GameManager = null;

    // set by choose scene
    static initSceneID: number = 1;

    start () {
        this.dialogUIController.uiController = this;
        this.chapterUIController.uiController = this;
        this.questionUIController.uiController = this;

        let scenes = CSVToDicts(this.dialogData.text) as unknown[] as RawDialogInfo[];
        let chapters = CSVToDicts(this.chapterData.text) as unknown[] as RawChapterInfo[];
        let questions = CSVToDicts(this.questionData.text) as unknown[] as RawQuestionInfo[];
        let numbers = CSVToDicts(this.numberData.text) as unknown[] as RawNumberInfo[];        
        let endings = CSVToDicts(this.endingData.text) as unknown[] as RawEndingInfo[];
        
        this.gameManager = new GameManager(scenes, chapters, questions, numbers, endings);
        this.gameManager.goTo(UIController.initSceneID);
        UIController.initSceneID = 1;   // reset init ID
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
            this.questionUIController.exit();
            this.updateCG(scene.imageName);
        } else if(scene instanceof ChapterInfo) {
            this.chapterUIController.activate(scene);
        } else if(scene instanceof QuestionInfo) {
            this.questionUIController.activate(scene);
        } else if(scene instanceof EndingInfo) {
            EndingUIController.ending = scene;
            cc.director.loadScene("ending");
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
