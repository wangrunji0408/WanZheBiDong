import { QuestionInfo } from "./Data";
import UIController from "./UIController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class QuestionUIController extends cc.Component {

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property([cc.Label])
    choiceLabels: cc.Label[] = [];

    @property([cc.Button])
    choiceButtons: cc.Button[] = [];

    @property([cc.Sprite])
    resultSprites: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    rightSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    wrongSprite: cc.SpriteFrame = null;

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
        for(let i=0; i<4; ++i) {
            this.choiceLabels[i].string = options[this.reorder[i]];
            this.choiceButtons[i].interactable = true;
            this.resultSprites[i].spriteFrame = null;
        }
        this.chose = false;
    }

    // stage 2: choose
    onButtonClicked(event: TouchEvent, customEventData: string) {
        if(this.chose) {
            return;
        }
        let rawChoice = parseInt(customEventData);
        let choice = this.reorder[rawChoice];
        for(let i=0; i<4; ++i) {
            this.choiceButtons[i].interactable = false;
        }
        this.resultSprites[rawChoice].spriteFrame = this.wrongSprite;
        this.resultSprites[this.reorder.indexOf(0)].spriteFrame = this.rightSprite;
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
