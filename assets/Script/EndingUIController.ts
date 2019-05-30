import UIController from "./UIController";
import { EndingInfo } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndingUIController extends cc.Component {

    @property(cc.Label)
    textLabel: cc.Label = null;

    // set by UIController
    static ending: EndingInfo = null;

    start() {
        this.textLabel.string = EndingUIController.ending.description;
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
