import { ChapterInfo } from "./Data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChapterUIController extends cc.Component {

    @property(cc.Label)
    speakerLabel: cc.Label = null;

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property(cc.Label)
    choice1Label: cc.Label = null;

    @property(cc.Label)
    choice2Label: cc.Label = null;

    @property(cc.Label)
    feedbackLabel: cc.Label = null;

    chapter: ChapterInfo;

    chose: boolean;

    // stage 1: show chapter
    activate(chapter: ChapterInfo) {
        console.debug('activate chapter UI');
        this.node.active = true;
        this.chose = false;
        this.chapter = chapter;
        this.speakerLabel.string = chapter.speaker + '奏';
        this.textLabel.string = chapter.text;
        this.choice1Label.string = chapter.option1;
        this.choice2Label.string = chapter.option2;
        this.feedbackLabel.node.active = false;
    }

    // stage 2: choose
    onButtonClicked(event: TouchEvent, customEventData: string) {
        if(this.chose) {
            return;
        }
        let choice = parseInt(customEventData);
        this.feedbackLabel.node.active = true;
        this.feedbackLabel.string = choice === 0? this.chapter.feedback1: this.chapter.feedback2;
        this.chose = true;
        // TODO: effect
    }

    // stage 3: exit
    onGlobalClicked(event: TouchEvent, _: string) {
        if(!this.chose) {
            return;
        }
        this.node.active = false;
    }
}
