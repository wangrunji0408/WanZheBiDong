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

    updateUI(dialog: DialogInfo) {
        this.dialog = dialog;
        if(dialog.buttons.length >= 2) {
            this.buttonGroup.active = true;
            this.buttonLabel1.string = dialog.buttons[0].text;
            this.buttonLabel2.string = dialog.buttons[1].text;
        } else {
            this.buttonGroup.active = false;
        }
        this.textLabel.string = dialog.text;
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
