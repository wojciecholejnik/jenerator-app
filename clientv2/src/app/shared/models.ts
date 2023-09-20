export interface User {
    _id?: string,
    displayName: string,
    login: string,
    emoticon: string,
    isAdmin: boolean,
    password?: string,
    primaryEmoticon: string,
    shortName: string,
}

export interface UserFields {
    _id: string,
    displayName?: string,
    login?: string,
    emoticon?: string,
    isAdmin?: boolean,
    password?: string,
    shortName?: string,
}

export interface NavOption {
    name: NavName,
    active: boolean
}

export type NavName = 'generator' | 'generator' | 'questions' | 'categories' | 'help' | 'manage';

export interface Category {
    _id: string,
    name: string
}

export interface Question {
    _id?: string,
    answers: Answer[],
    author: {
        shortName: string,
        _id: string
    },
    category: {
        name: string,
        _id: string
    },
    img: string | null,
    questionContent: string,
    type: QuestionType,
    creationDate: Date,
    blocked: boolean,
    species: QuestionSpecies
}

export interface QuestionsFilter {
    content: string,
    author: string,
    type: 'open' | 'singleSelect' | 'multiSelect' | '',
    status: 'active' | 'blocked' | '',
    species: QuestionSpecies | undefined
  }

export interface Answer {
    content: string,
    isRight: boolean
}

export type QuestionType = 'open' | 'singleSelect' | 'multiSelect' | string;

export interface QuestionFilter {
    content: string,
    type: QuestionType | string
}

export interface QuestionToSaveDTO {
    _id?: string,
    category: string
    type: QuestionType
    questionContent: string,
    answers: Answer[],
    img: string,
    author: string,
    blocked: boolean
    species: QuestionSpecies | undefined
}

export interface Test {
    _id: string,
    name: string,
    author: {
        _id: string,
        shortName: string,
        emoticon: string
    }
    date: Date;
    questions: Question[];
    category: {
        _id: string,
        name: string
    };
}

export interface NewTest {
    _id?: string,
    name?: string,
    author: {
        _id: string,
        shortName: string,
        emoticon: string
    }
    date: Date;
    questions: Question[];
    category?: {
        _id: string,
        name: string
    };
}

export interface TestToSaveDTO {
    author: string;
    questions: {
        singleSelect: Question[],
        multiSelect: Question[],
        open: Question[]
    };
    category: string;
}

export enum QuestionSpecies {
    countingTask = 0,
    knowledgeTask = 1
}

export const translateQuestionSpecies = (species: QuestionSpecies): string => {
    if (species === QuestionSpecies.countingTask) {
      return 'wiedza'
    } else if (species === QuestionSpecies.knowledgeTask) {
      return 'kalkulacja'
    } else {
      return 'brak info'
    }
  }
