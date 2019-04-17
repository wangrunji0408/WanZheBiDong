import { NumberSystem } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NumberUIController extends cc.Component {

    @property(cc.Label)
    ssLabel: cc.Label = null;

    @property(cc.Label)
    jsLabel: cc.Label = null;

    @property(cc.Label)
    ngLabel: cc.Label = null;

    @property(cc.Label)
    swLabel: cc.Label = null;

    updateUI(ns: NumberSystem) {
        this.ssLabel.string = ns.SS.toString();
        this.jsLabel.string = ns.JS.toString();
        this.ngLabel.string = ns.NG.toString();
        this.swLabel.string = ns.SW.toString();
    }
}
