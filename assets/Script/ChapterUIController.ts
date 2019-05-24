import { ChapterInfo } from "./Data";
import UIController from "./UIController";

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

    @property(cc.Button)
    choice1Button: cc.Button = null;

    @property(cc.Button)
    choice2Button: cc.Button = null;

    // assigned by UIController
    uiController: UIController = null;

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
        this.choice1Button.interactable = true;
        this.choice2Button.interactable = true;
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
        console.debug(this.feedbackLabel.string);
        this.choice1Button.interactable = false;
        this.choice2Button.interactable = false;
        this.chose = true;
        this.uiController.choose(choice);
    }

    // stage 3: exit
    onGlobalClicked(event: TouchEvent, _: string) {
        if(!this.chose) {
            return;
        }
        this.uiController.updateUI();
    }

    exit() {
        this.node.active = false;
    }
}
