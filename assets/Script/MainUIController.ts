const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUIController extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onButtonClicked(_event: TouchEvent, customEventData: string) {
        let sceneName = customEventData;
        cc.director.loadScene(sceneName);
    }

    // update (dt) {}
}
