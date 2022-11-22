export interface Category {
    name: string;
    _id: number;
    amount: number;
    singleAmount: number;
    multiAmount: number;
    openAmount: number;
}

export interface Answer {
    content: string;
    isRight: boolean;
}

export interface Question {
    _id: string;
    answers: Answer[];
    category: string;
    img: string | null;
    questionContent: string;
    type: 'singleSelect' | 'multiSelect' | 'open'
}

export interface User {
    _id: string;
    displayName: string;
    email: string;
    emoticon: string;
    isAdmin: boolean;
    password: string;
    primaryEmoticon: string;
    shortName: string;
    background: string;
}

export interface Test {
    author: string;
    date: string;
    questions: {
        singleSelect: Question[],
        multiSelect: Question[],
        open: Question[]
    };
    category: string;
}

export interface TestToSave {
    author: string;
    questions: {
        singleSelect: Question[],
        multiSelect: Question[],
        open: Question[]
    };
    category: string;
}