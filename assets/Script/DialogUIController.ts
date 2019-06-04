import { DialogInfo } from "./Data";
import UIController from "./UIController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DialogUIController extends cc.Component {

    @property(cc.Node)
    buttonGroup: cc.Node = null;

    @property(cc.Label)
    buttonLabel1: cc.Label = null;

    @property(cc.Label)
    buttonLabel2: cc.Label = null;

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property(cc.Label)
    speakerLabel: cc.Label = null;

    @property(cc.Sprite)
    lihuiSprite: cc.Sprite = null;

    // assigned by UIController
    uiController: UIController = null;

    dialog: DialogInfo = null;

    // for typewriter effect
    time: number = 0;
    get showLength(): number {
        const CHARS_PER_SEC = 20;
        return Math.floor(this.time * CHARS_PER_SEC);
    }
    get isTyping(): boolean {
        return this.showLength < this.dialog.text.length;
    }

    onGlobalClicked(event: TouchEvent, customEventData: string) {
        console.debug('global clicked');
        if(this.dialog.nextSceneID != null) {
            this.uiController.goNext(0);
        }
    }

    onButtonClicked(event: TouchEvent, customEventData: string) {
        let choice = parseInt(customEventData);
        console.debug(`button ${choice} clicked`)        
        this.uiController.goNext(choice);
    }

    update(dt: number) {
        this.time += dt;
        this.textLabel.string = this.dialog.text.substr(0, this.showLength);
        this.buttonGroup.active = this.dialog.buttons.length >= 2 && !this.isTyping;
    }

    updateUI(dialog: DialogInfo) {
        this.dialog = dialog;
        let isTitle = dialog.sceneID % 1000 === 0;
        this.node.active = !isTitle;
        this.buttonGroup.active = false;    // activated by update()
        if(dialog.buttons.length >= 2) {
            this.buttonLabel1.string = dialog.buttons[0].text;
            this.buttonLabel2.string = dialog.buttons[1].text;
        }
        this.time = 0;  // reset time
        this.textLabel.string = '';
        this.speakerLabel.string = dialog.speaker;
        this.updateLihui(dialog.avatar);
    }

    private updateLihui(name: string) {
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
