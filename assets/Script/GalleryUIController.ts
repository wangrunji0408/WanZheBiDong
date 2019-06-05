import UIController from "./UIController";
import { UserData } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GalleryUIController extends cc.Component {

    @property(cc.Sprite)
    cgSprite: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    names: string[] = '三皇子出生,后金,杨应龙请罪,两个太后,外族攻城,架空皇帝,书房冯保,大学士请辞,武官早朝,书房单人,宁夏投降,汇报战况,书房张居正,尚书与郎中,江南和江北,书房申时行,张居正哭诉,烧毁倭船,书房锦衣卫,战术讨论,登基,争执,拥立亲王,皇帝与太后,五直臣传单,收粮,知府与通判,农民,整治高拱,税收仓库,农民起义,文官早朝,花天酒地,冯保幕僚,早朝,行贿,击败杨应龙,明定陵'.split(',');

    currentIdx: number = 0;

    start() {
        this.updateUI();
    }

    onLeftButtonClicked(_event: TouchEvent, _customEventData: string) {
        let n = this.names.length;
        this.currentIdx = (this.currentIdx + n - 1) % n;
        this.updateUI();
    }

    onRightButtonClicked(_event: TouchEvent, _customEventData: string) {
        let n = this.names.length;
        this.currentIdx = (this.currentIdx + n + 1) % n;
        this.updateUI();
    }

    onBackButtonClicked(_event: TouchEvent, _customEventData: string) {
        cc.director.loadScene("main");
    }

    updateUI() {
        let name = this.names[this.currentIdx];
        let imagePath = "CG/" + name;
        cc.loader.loadRes(imagePath, cc.SpriteFrame, (err, spriteFrame) => {
            this.cgSprite.spriteFrame = spriteFrame;
        });
        this.nameLabel.string = name;
    }
}
