const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuUIController extends cc.Component {

    onMenuButtonClicked(_event: TouchEvent, _customEventData: string) {
        this.node.active = true;
    }

    onResumeButtomClicked(_event: TouchEvent, _customEventData: string) {
        this.node.active = false;
    }

    onReturnButtonClicked(_event: TouchEvent, _customEventData: string) {
        cc.director.loadScene('main');
    }

    onLoadButtonClicked(_event: TouchEvent, _customEventData: string) {
        cc.director.loadScene('chapter');
    }
}
