const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUIController extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    onLoad() {
        cc.audioEngine.play(this.bgm, true, 0.5);
    }

    onButtonClicked(_event: TouchEvent, customEventData: string) {
        let sceneName = customEventData;
        cc.director.loadScene(sceneName);
    }

    // update (dt) {}
}
