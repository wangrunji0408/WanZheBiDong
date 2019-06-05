import UIController from "./UIController";
import { UserData } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AboutUIController extends cc.Component {

    onBackButtonClicked(_event: TouchEvent, _customEventData: string) {
        cc.director.loadScene("main");
    }
}
