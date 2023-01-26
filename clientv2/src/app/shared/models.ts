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