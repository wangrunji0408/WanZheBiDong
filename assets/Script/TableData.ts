/// Structures loaded from CSV

/// A line in 'dialog.csv'
/// 对话场景
export class RawDialogInfo {
	sceneID: string;
	imageName: string;
	speaker: string;
	avatar: string;
	text: string;
	hasChoice: string;
	buttonText1: string;
	result1: string;
	nextID1: string;
	buttonText2: string;
	result2: string;
	nextID2: string;
	isSceneOver: string;
	comment: string;
}

/// A line in 'number.csv'
/// 数值表
export class RawNumberInfo {
	name: string;
	key: string;
	init: string;
	description: string;
	highDescription: string;
	highEndID: string;
	lowDescription: string;
	lowEndID: string;
}

/// A line in 'ending.csv'
/// 结局表
export class RawEndingInfo {
	endID: string;
	imageName: string;
	title: string;
	description: string;
	hint: string;
	comment: string;
}

/// A line in 'chapter.csv'
/// 奏章场景
export class RawChapterInfo {
	sceneID: string;
	imageName: string;
	speaker: string;
	text: string;
	help: string;
	option1: string;
	result1: string;
	feedback1: string;
	option2: string;
	result2: string;
	feedback2: string;
	nextID: string;
	option: string;
	comment: string;
}

/// A line in 'question.csv'
/// 答题场景
export class RawQuestionInfo {
	sceneID: string;
	imageName: string;
	question: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	result: string;
	nextID: string;
}
