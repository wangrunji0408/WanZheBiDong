import UIController from "./UIController";
import { EndingInfo } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndingUIController extends cc.Component {

    @property(cc.Sprite)
    cgSprite: cc.Sprite = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.Label)
    hintLabel: cc.Label = null;

    // set by UIController
    static ending: EndingInfo = null;

    start() {
        let ending = EndingUIController.ending;
        this.titleLabel.string = '结局：' + ending.title;
        this.descLabel.string = ending.description;
        this.hintLabel.string = '提示：' + ending.hint;
        let imagePath = "CG/" + ending.imageName;
        cc.loader.loadRes(imagePath, cc.SpriteFrame, (err, spriteFrame) => {
            if(err) {
                throw 'failed to load image';
            }
            this.cgSprite.spriteFrame = spriteFrame;
        });
    }

    onButtonClicked(_event: TouchEvent, customEventData: string) {
        let sceneID = parseInt(customEventData);
        UIController.initSceneID = sceneID;
        cc.director.loadScene("dialog");
    }

    onMainButtonClicked(_event: TouchEvent, _customEventData: string) {
        cc.director.loadScene("main");
    }
}
