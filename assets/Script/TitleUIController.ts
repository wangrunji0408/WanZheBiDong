import { DialogInfo } from "./Data";
const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleUIController extends cc.Component {

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    activate(dialog: DialogInfo) {
        this.numLabel.string = dialog.text.split('——')[0];
        this.titleLabel.string = dialog.text.split('——')[1];
        
        this.node.active = true;
        this.node.opacity = 255;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(3), 
                cc.fadeOut(1),
                cc.callFunc(() => this.node.active = false)
            )
        );
    }
}
