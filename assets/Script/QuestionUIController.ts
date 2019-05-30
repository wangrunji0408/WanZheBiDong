import { QuestionInfo } from "./Data";
import UIController from "./UIController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class QuestionUIController extends cc.Component {

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property(cc.Label)
    choice1Label: cc.Label = null;

    @property(cc.Label)
    choice2Label: cc.Label = null;

    @property(cc.Label)
    choice3Label: cc.Label = null;

    @property(cc.Label)
    choice4Label: cc.Label = null;

    @property(cc.Button)
    choice1Button: cc.Button = null;

    @property(cc.Button)
    choice2Button: cc.Button = null;

    @property(cc.Button)
    choice3Button: cc.Button = null;

    @property(cc.Button)
    choice4Button: cc.Button = null;

    // assigned by UIController
    uiController: UIController = null;

    question: QuestionInfo;

    reorder: number[];

    chose: boolean;

    // stage 1: show
    activate(question: QuestionInfo) {
        this.node.active = true;
        this.question = question;
        let options = [question.option1, question.option2, question.option3, question.option4];
        this.reorder = [0, 1, 2, 3];
        shuffle(this.reorder);
        this.textLabel.string = question.question;
        this.choice1Label.string = options[this.reorder[0]];
        this.choice2Label.string = options[this.reorder[1]];
        this.choice3Label.string = options[this.reorder[2]];
        this.choice4Label.string = options[this.reorder[3]];
        this.choice1Button.interactable = true;
        this.choice2Button.interactable = true;
        this.choice3Button.interactable = true;
        this.choice4Button.interactable = true;
        this.chose = false;
    }

    // stage 2: choose
    onButtonClicked(event: TouchEvent, customEventData: string) {
        if(this.chose) {
            return;
        }
        let choice = parseInt(customEventData);
        choice = this.reorder[choice];
        this.choice1Button.interactable = false;
        this.choice2Button.interactable = false;
        this.choice3Button.interactable = false;
        this.choice4Button.interactable = false;
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

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
