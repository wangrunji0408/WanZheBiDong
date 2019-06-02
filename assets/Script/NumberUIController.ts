import { NumberSystem } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NumberUIController extends cc.Component {

    // @property(cc.Label)
    // ssLabel: cc.Label = null;

    // @property(cc.Label)
    // jsLabel: cc.Label = null;

    // @property(cc.Label)
    // ngLabel: cc.Label = null;

    // @property(cc.Label)
    // swLabel: cc.Label = null;

    @property(cc.Node)
    ssMask: cc.Node = null;

    @property(cc.Node)
    jsMask: cc.Node = null;

    @property(cc.Node)
    ngMask: cc.Node = null;

    @property(cc.Node)
    swMask: cc.Node = null;

    updateUI(ns: NumberSystem) {
        // this.ssLabel.string = ns.SS.toString();
        // this.jsLabel.string = ns.JS.toString();
        // this.ngLabel.string = ns.NG.toString();
        // this.swLabel.string = ns.SW.toString();
        this.ssMask.height = this.calcMaskHeight(ns.SS);
        this.jsMask.height = this.calcMaskHeight(ns.JS);
        this.ngMask.height = this.calcMaskHeight(ns.NG);
        this.swMask.height = this.calcMaskHeight(ns.SW);
    }

    calcMaskHeight(percent: number) {
        const MIN = 0;
        const MAX = 100;
        return MIN + (MAX - MIN) * percent / 100;
    }

    onChaozhengButtonClicked(_event: TouchEvent, _customEventData: string) {
        this.node.active = true;
    }

    onGlobalClicked(_event: TouchEvent, _customEventData: string) {
        this.node.active = false;
    }
}
