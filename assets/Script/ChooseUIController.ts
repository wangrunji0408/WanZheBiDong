const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseUIController extends cc.Component {

    start () {

    }

    onButtonClicked(_event: TouchEvent, customEventData: string) {
        let sceneID = parseInt(customEventData);
        cc.director.loadScene("dialog");
    }
}
