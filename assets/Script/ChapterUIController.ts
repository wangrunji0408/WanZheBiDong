import { ChapterInfo } from "./Data";
import UIController from "./UIController";

const {ccclass, property} = cc._decorator;

const LINE_PER_PAGE = 12;

@ccclass
export default class ChapterUIController extends cc.Component {

    @property(cc.Label)
    speakerLabel: cc.Label = null;

    @property(cc.Node)
    textRegion: cc.Node = null;

    @property(cc.Label)
    textLabel: cc.Label = null;

    @property(cc.Label)
    commentLabel: cc.Label = null;

    @property(cc.Label)
    commentLabel2: cc.Label = null;

    @property(cc.Label)
    choice1Label: cc.Label = null;

    @property(cc.Label)
    choice2Label: cc.Label = null;

    @property(cc.Button)
    choice1Button: cc.Button = null;

    @property(cc.Button)
    choice2Button: cc.Button = null;

    @property(cc.Button)
    nextButton: cc.Button = null;

    @property(cc.Button)
    prevButton: cc.Button = null;

    @property(cc.Node)
    dialogNode: cc.Node = null;

    @property(cc.Node)
    dialogLihui: cc.Node = null;

    @property(cc.Node)
    dialogSpeaker: cc.Node = null;

    @property(cc.Label)
    dialogLabel: cc.Label = null;

    @property(cc.Node)
    sealNode: cc.Node = null;

    // assigned by UIController
    uiController: UIController = null;

    chapter: ChapterInfo;

    lines: string[];

    pageID: number;
    get totalPages(): number {
        return Math.ceil(this.lines.length / LINE_PER_PAGE);
    }

    chose: boolean;

    // stage 1: show chapter
    activate(chapter: ChapterInfo) {
        console.debug('activate chapter UI');
        this.node.active = true;
        this.chose = false;
        this.chapter = chapter;
        this.speakerLabel.string = chapter.speaker + '奏';
        this.lines = this.splitContent(chapter.text);
        this.pageID = 0;
        this.choice1Label.string = chapter.option1;
        this.choice2Label.string = chapter.option2;
        this.commentLabel.string = '';
        this.commentLabel2.string = '';
        this.choice1Button.interactable = true;
        this.choice2Button.interactable = true;
        this.sealNode.active = false;
        this.updateUI();
    }

    // stage 2: choose
    onButtonClicked(event: TouchEvent, customEventData: string) {
        if(this.chose) {
            return;
        }
        let choice = parseInt(customEventData);
        // force choose
        if(this.chapter.option !== null && choice !== this.chapter.option) {
            let reply = choice === 0? this.chapter.feedback1: this.chapter.feedback2;
            this.showDialog(reply, true);
            return;
        }
        let feedback = choice === 0? this.chapter.feedback1: this.chapter.feedback2;
        if(feedback) {
            this.showDialog(feedback, false);
        }
        let comment = choice === 0? this.chapter.option1: this.chapter.option2
        this.commentLabel.string = comment.substr(0, 12);
        this.commentLabel2.string = comment.substr(12, 12);
        this.choice1Button.interactable = false;
        this.choice2Button.interactable = false;
        this.chose = true;
        this.uiController.choose(choice);
        this.updateUI();
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

    splitContent(text: string): string[] {
        const CHAR_PER_LINE = 15;
        let lines = [];
        for(let line of text.split('\\n')) {
            lines.push(line.substr(0, CHAR_PER_LINE + 1));
            for(let i=CHAR_PER_LINE + 1; i<line.length; i+=CHAR_PER_LINE) {
                lines.push('　' + line.substr(i, CHAR_PER_LINE));
            }
        }
        return lines;
    }

    updateUI() {
        const DELTA_X = 56;
        // clear exist labels
        this.textRegion.removeAllChildren();
        // instantiate labels
        for(let i = 0; i < LINE_PER_PAGE; i += 1) {
            let idx = LINE_PER_PAGE * this.pageID + i;
            if(idx >= this.lines.length) {
                break;
            }
            let node = cc.instantiate(this.textLabel.node);
            node.setParent(this.textRegion);
            node.setPosition(-i * DELTA_X, 0); 
            node.getComponent(cc.Label).string = this.lines[idx];
        };
        // show buttons
        let isFirstPage = this.pageID === 0;
        let isLastPage = this.pageID + 1 === this.totalPages;
        this.choice1Button.node.active = isLastPage;
        this.choice2Button.node.active = isLastPage;
        this.nextButton.node.active = !isLastPage;
        this.prevButton.node.active = !isFirstPage;
        // show comment
        let showComment = isLastPage && this.chose;
        this.commentLabel.node.active = showComment;
        this.commentLabel2.node.active = showComment;
        this.sealNode.active = showComment;
    }

    showDialog(reply: string, fengbao: boolean) {
        this.dialogNode.active = true;
        this.dialogLabel.string = reply;
        this.dialogLihui.active = fengbao;
        this.dialogSpeaker.active = fengbao;
    }

    onDialogClicked(_event: TouchEvent, _: string) {
        this.dialogNode.active = false;
    }

    onNextPageClicked(_event: TouchEvent, _: string) {
        this.pageID = Math.min(this.totalPages - 1, this.pageID + 1);
        this.updateUI();
    }

    onPrevPageClicked(_event: TouchEvent, _: string) {
        this.pageID = Math.max(0, this.pageID - 1);
        this.updateUI();
    }
}
