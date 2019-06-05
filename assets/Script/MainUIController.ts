import { UserData } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUIController extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    static loaded: boolean = false;

    start() {
        if(!MainUIController.loaded) {
            cc.game.setFrameRate(30);
            UserData.load();
            cc.audioEngine.play(this.bgm, true, 0.5);
            MainUIController.loaded = true;
        }
    }

    onButtonClicked(_event: TouchEvent, customEventData: string) {
        let sceneName = customEventData;
        cc.director.loadScene(sceneName);
    }
}
