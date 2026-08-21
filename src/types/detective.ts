export type DetectivePhase = 'intro' | 'case1' | 'case2' | 'case3' | 'final_eval' | 'result';

export interface FeedItem {
  id: string;
  category: 'sports' | 'news' | 'opinion' | 'gaming' | 'education' | 'tech' | 'discussion';
  icon: string;
  title: string;
  author: string;
  tag: string;
  likes: number;
  comments: number;
  highlighted?: boolean;
  isFiltered?: boolean;
}

export interface EvidenceItem {
  id: string;
  iconType: 'like' | 'watch' | 'follow' | 'skip' | 'search';
  title: string;
  subtitle: string;
  detail: string;
  discovered: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ActionCardItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  isCorrect: boolean;
}

export interface DetectiveState {
  currentPhase: DetectivePhase;
  currentCaseIndex: number; // 0, 1, 2
  case1State: {
    evidenceDiscovered: string[]; // ids
    questionAnswered: boolean;
    selectedOption: string | null;
    attempts: number;
    showExplanation: boolean;
    isCorrect: boolean;
  };
  case2State: {
    question1Answered: boolean;
    selectedOption1: string | null;
    question1Correct: boolean;
    showBubbleAnimation: boolean;
    question2Answered: boolean;
    selectedOption2: string | null;
    question2Correct: boolean;
  };
  case3State: {
    selectedActions: string[]; // ids
    actionsEvaluated: boolean;
    actionsCorrect: boolean;
    feedTransformed: boolean;
    finalQuestionAnswered: boolean;
    finalSelectedOption: string | null;
    finalCorrect: boolean;
  };
  scores: {
    algorithmAwareness: number;
    bubbleDetection: number;
    infoEvaluation: number;
    totalScore: number;
  };
  reflectionText: string;
  reflectionSaved: boolean;
}
