import UIController from "./UIController";
import { EndingInfo, UserData } from "./Data";

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

    @property(cc.Node)
    retryNode: cc.Node = null;

    @property(cc.Node)
    returnNode: cc.Node = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    // for typing effect
    time: number = 0;
    typing: boolean = false;
    get showLength(): number {
        const CHARS_PER_SEC = 20;
        return Math.floor(this.time * CHARS_PER_SEC);
    }

    // set by UIController
    static ending: EndingInfo = null;
    static lastSceneID: number = 0;

    start() {
        let ending = EndingUIController.ending;
        this.titleLabel.string = '结局：' + ending.title;
        this.descLabel.string = ''; // set in update()
        this.hintLabel.string = '提示：' + ending.hint;
        this.retryNode.active = ending.endID !== 7000;
        this.cgSprite.spriteFrame = null;
        let imagePath = "CG/" + ending.imageName;
        cc.loader.loadRes(imagePath, cc.SpriteFrame, (err, spriteFrame) => {
            if(err) {
                throw 'failed to load image';
            }
            this.cgSprite.spriteFrame = spriteFrame;
        });
        this.runAction1();
    }

    private runAction1() {
        this.maskNode.opacity = 0;
        this.maskNode.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.fadeTo(2, 128),
            )
        );
        this.titleLabel.node.opacity = 0;
        this.titleLabel.node.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.fadeIn(2),
                cc.callFunc(() => {
                    // start typing
                    this.time = 0;
                    this.typing = true;
                }),
            )
        );
        this.retryNode.opacity = 0;
        this.returnNode.opacity = 0;
        this.hintLabel.node.opacity = 0;
        // fadeIn in update()
    }

    update(dt: number) {
        if(!this.typing) {
            return;
        }
        let ending = EndingUIController.ending;
        this.time += dt;
        this.descLabel.string = ending.description.substr(0, this.showLength);
        // on end typing
        if(this.showLength >= ending.description.length) {
            this.typing = false;
            this.runAction2(ending.endID !== 7000);
        }
    }

    private runAction2(showRetry: boolean) {
        let action = cc.sequence(
            cc.delayTime(1),
            cc.fadeIn(0.5),
        );
        if(showRetry) {
            this.retryNode.runAction(action.clone());
        }
        this.returnNode.runAction(action.clone());
        this.hintLabel.node.runAction(action.clone());
    }

    onRetryButtonClicked(_event: TouchEvent, _customEventData: string) {
        let chapterID = Math.floor(EndingUIController.lastSceneID / 1000);
        let sceneID = chapterID * 1000;
        UIController.initNumber = UserData.value.numbers[chapterID];
        UIController.initSceneID = sceneID;
        cc.director.loadScene("dialog");
    }

    onMainButtonClicked(_event: TouchEvent, _customEventData: string) {
        cc.director.loadScene("main");
    }
}
