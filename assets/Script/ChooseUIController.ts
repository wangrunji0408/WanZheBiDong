import UIController from "./UIController";
import { UserData } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseUIController extends cc.Component {

    @property([cc.Button])
    buttons: cc.Button[] = [];

    @property([cc.Node])
    masks: cc.Node[] = [];

    start() {
        for(let i=0; i<6; ++i) {
            let enable = UserData.value.numbers[i+1] !== null;
            this.buttons[i].interactable = enable;
            this.masks[i].opacity = enable? 64: 192;
        }
    }

    onButtonClicked(_event: TouchEvent, customEventData: string) {
        let sceneID = parseInt(customEventData);
        let chapterID = sceneID / 1000;
        UIController.initSceneID = sceneID;
        UIController.initNumber = UserData.value.numbers[chapterID];
        cc.director.loadScene("dialog");
    }

    onBackButtonClicked(_event: TouchEvent, _customEventData: string) {
        cc.director.loadScene("main");
    }
}
