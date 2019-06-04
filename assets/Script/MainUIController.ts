import { UserData } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUIController extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    onLoad() {
        UserData.load();
        cc.audioEngine.play(this.bgm, true, 0.5);
    }

    onButtonClicked(_event: TouchEvent, customEventData: string) {
        let sceneName = customEventData;
        cc.director.loadScene(sceneName);
    }

    // update (dt) {}
}
