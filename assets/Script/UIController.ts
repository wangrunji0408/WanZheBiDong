import GameManager from "./Game";
import NumberUIController from "./NumberUIController";
import ChapterUIController from "./ChapterUIController";
import DialogUIController from "./DialogUIController";
import QuestionUIController from "./QuestionUIController";
import EndingUIController from "./EndingUIController";
import TitleUIController from "./TitleUIController";
import { CSVToDicts } from "./Utils";
import { RawDialogInfo, RawChapterInfo, RawQuestionInfo, RawEndingInfo, RawNumberInfo } from "./TableData";
import { DialogInfo, ChapterInfo, QuestionInfo, EndingInfo, UserData, NumberSystem } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIController extends cc.Component {

    @property(cc.Sprite)
    cgSprite: cc.Sprite = null;

    @property(cc.Sprite)
    lastCGSprite: cc.Sprite = null;

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

    @property(TitleUIController)
    titleUIController: TitleUIController = null;

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

    @property(cc.Node)
    transitionNode: cc.Node = null;

    gameManager: GameManager = null;

    // set by choose scene
    static initSceneID: number = GameManager.INIT_SCENE_ID;
    static initNumber: NumberSystem = new NumberSystem();

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
        this.gameManager.numbers = UIController.initNumber;
        // reset init settings
        UIController.initSceneID = GameManager.INIT_SCENE_ID;
        UIController.initNumber = new NumberSystem();
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
        let oldScene = this.gameManager.get();
        this.gameManager.goNext(choice);
        let newScene = this.gameManager.get();
        let transition = oldScene.imageName !== newScene.imageName
            && oldScene instanceof DialogInfo
            && newScene instanceof DialogInfo;
        this.updateUI();
        if(transition) {
            // freeze CG
            this.lastCGSprite.spriteFrame = this.cgSprite.spriteFrame;
            // temp disable dialog UI
            let dialogActivation = this.dialogUIController.node.active;
            this.dialogUIController.node.active = false;
            // delay show title UI
            let titleActivation = this.titleUIController.node.active;
            this.titleUIController.node.active = false;
            // enable transition animation
            this.transitionNode.active = true;
            this.transitionNode.runAction(
                cc.sequence(
                    cc.fadeIn(1),
                    cc.callFunc(() => {
                        this.lastCGSprite.spriteFrame = null;
                        this.titleUIController.node.active = titleActivation;
                    }),
                    cc.fadeOut(1),
                    cc.callFunc(() => {
                        this.transitionNode.active = false;
                        this.dialogUIController.node.active = dialogActivation;
                    }),
                )
            );
        }
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
            if(this.gameManager.currentID % 1000 === 0) {
                this.titleUIController.activate(scene);
                // auto save on chapter beginning
                let chapterID = this.gameManager.currentID / 1000;
                UserData.value.numbers[chapterID] = this.gameManager.numbers;
                UserData.save();
            }
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
            EndingUIController.lastSceneID = this.gameManager.lastID;
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
