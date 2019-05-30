import UIController from "./UIController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseUIController extends cc.Component {

    onButtonClicked(_event: TouchEvent, customEventData: string) {
        let sceneID = parseInt(customEventData);
        UIController.initSceneID = sceneID;
        cc.director.loadScene("dialog");
    }
}
