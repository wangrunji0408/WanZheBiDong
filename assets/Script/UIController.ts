import GameManager from "./Game";
import NumberUIController from "./NumberUIController";
import ChapterUIController from "./ChapterUIController";
import { CSVToDicts } from "./Utils";
import { RawDialogInfo, RawChapterInfo } from "./TableData";
import { DialogInfo, ChapterInfo } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIController extends cc.Component {

    @property(cc.Node)
    buttonGroup: cc.Node = null;

    @property(cc.Node)
    backgroundNode: cc.Node = null;

    @property(cc.Label)
    buttonLabel1: cc.Label = null;

    @property(cc.Label)
    buttonLabel2: cc.Label = null;

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property(cc.Label)
    speakerLabel: cc.Label = null;

    @property(cc.Sprite)
    cgSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    defaultCG: cc.SpriteFrame = null;

    @property(cc.Sprite)
    lihuiSprite: cc.Sprite = null;

    @property(NumberUIController)
    numberUIController: NumberUIController = null;

    @property(ChapterUIController)
    chapterUIController: ChapterUIController = null;

    @property(cc.TextAsset)
    sceneData: cc.TextAsset = null;

    @property(cc.TextAsset)
    chapterData: cc.TextAsset = null;

    gameManager: GameManager = null;

    start () {
        let scenes = CSVToDicts(this.sceneData.text) as unknown[] as RawDialogInfo[];
        let chapters = CSVToDicts(this.chapterData.text) as unknown[] as RawChapterInfo[];
        this.gameManager = new GameManager(scenes, chapters);
        this.updateUI();
    }

    onGlobalClicked(event: TouchEvent, customEventData: string) {
        console.debug('global clicked');
        let scene = this.gameManager.get();
        if(scene instanceof DialogInfo) {
            if(scene.nextSceneID != null) {
                this.gameManager.goNext(0);
            }
        }
        this.updateUI();
    }

    onButtonClicked(event: TouchEvent, customEventData: string) {
        let choice = parseInt(customEventData);
        console.debug(`button ${choice} clicked`)        
        this.gameManager.goNext(choice);
        this.updateUI();
    }

    updateUI() {
        let scene = this.gameManager.get();
        console.debug(typeof scene);
        if(scene instanceof DialogInfo) {
            this.updateDialog(scene)
            this.updateCG(scene.imageName);
            this.updateLihui(scene.speaker);
        } else if(scene instanceof ChapterInfo) {
            this.chapterUIController.activate(scene);
        }
        this.numberUIController.updateUI(this.gameManager.numbers);
    }

    updateDialog(dialog: DialogInfo) {
        if(dialog.buttons.length >= 2) {
            this.buttonGroup.active = true;
            this.buttonLabel1.string = dialog.buttons[0].text;
            this.buttonLabel2.string = dialog.buttons[1].text;
        } else {
            this.buttonGroup.active = false;
        }
        this.textLabel.string = dialog.text;
        this.speakerLabel.string = dialog.speaker;
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

    updateLihui(name: string) {
        let lihuiPath = "立绘/" + name;
        cc.loader.loadRes(lihuiPath, cc.SpriteFrame, (err, spriteFrame) => {
            if(err) {
                // no image found, disable it
                this.lihuiSprite.node.active = false;
                return;
            }
            this.lihuiSprite.node.active = true;
            this.lihuiSprite.spriteFrame = spriteFrame;
        });
    }
}
