export interface User {
    _id: string,
    background: string,
    displayName: string,
    email: string,
    emoticon: string,
    isAdmin: boolean,
    password: string,
    primaryEmoticon: string,
    shortName: string,
}

export interface NavOption {
    name: NavName,
    active: boolean
}

export type NavName = 'generator' | 'add-question' | 'questions' | 'categories';

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
    category: string
    type: QuestionType
    questionContent: string,
    answers: Answer[],
    img: string,
    author: string,
}
