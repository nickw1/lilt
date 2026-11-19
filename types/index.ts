import { CSSProperties, ReactNode } from "react";
import { StringLiteralUnion } from "shiki";

export type LoginState = {
    usercode: number | null,
    error: string | null
}
export type LogoutState = {
    loggedout: boolean,
    error: string | null
};
export type AdminLoginState = {
    adminLoggedIn: boolean,
    error: string | null
};

export interface Module {
    id: number;
    code: string;
    name: string;
    visible: boolean;
    topics?: Topic[];
}

export interface LinkModuleChooseProps {
    modules: Module[];
    curModule: string;
}

export interface ModuleChooseProps {
    modules: Module[];
    onModuleChosen?: (module: string) => void;
    msg?: string;
}

export interface UidSession {
    uid: number;
    admin?: string | null;
}

export interface UsercodeProps {
    usercode: number
}

export interface NullableUsercodeProps {
    usercode: number | null
}

export interface Stylable {
    style?: CSSProperties
}

export interface AdminProps {
    isAdmin: boolean;
    modules: Module[]
}

export interface AdminMainProps {
    modules: Module[];
    editNotesEnabled: string | undefined;
}

export interface NotesProps {
    module: string;
    initTopic: number;
}

export interface SyntaxHighlightProps {
    lang?: string;
    children: ReactNode
}

export interface MathProps {
    math: string
}


export interface Topic {
    id: number;
    number: number;
    title: string;
    visibility: number;

}

export interface TopicListProps {
    moduleCode: string;
    topics: Topic[];
}

export interface TopicNavProps extends TopicListProps {
    currentTopic: number
}

export interface Exercise {
    id?: number;
    intro: string;
    questions: any[];
    topic?: number;
    topicNumber?: number;
    unlocked?: boolean;
    publicNumber?: number;
    moduleCode?: string;
}

export interface Question {
    qid?: number;
    question: string;
    options: string[];
}

export interface ExerciseComponentProps {
    exercise: Exercise;
    submittable: boolean;
}

export interface AnswerQuestionsState {
    status?: string | string[];
    error?: string;
    answered?: number[];
}

export interface ConfirmDeleteProps {
    onDeleteConfirmed: () => void;
    color: string;
    message?: string;
}

export interface AddTopicProps {
    moduleCode: string;
    onTopicAdded: (topic: Topic) => void
}

export interface AddWholeQuestionProps {
    onQuestionsSubmitted: (questions: Question[]) => Promise<boolean>,
    btnText: string,
    allowNoQuestions?: boolean
}

export interface AddQuestionProps {
    qType: number;
    onQuestionAdded: (question: Question) => void;
}

export interface QOptionsProps {
    options: string;
    onOptionsChanged: (options: string) => void;
}

export interface EditTopicProps {
    topic: Topic;
    editLink: string | null;
}

export interface ModulesComponentProps {
    modules: Module[];
    onModulesChanged: (modules: Module[]) => void;
}

export interface AddModuleProps {
    onModuleAdded: (module: Module) => void;
}

export interface AdminExerciseManagementProps {
    allExercises: Exercise[];
}

export interface EditExerciseProps {
    exercise: Exercise;
    onExerciseDeleted: (exid: number) => void;
}

export interface EditQuestionProps {
    question: Question;
    num: number;
    onQuestionDeleted: (qid: number) => void;
}

export interface Answer {
    id: number;
    answer: string;
    qid: number;
}

export interface AnswersForQuestion {
    qid: number;
    answers: Answer[];
}

export interface AdminAnswersListProps {
    answers: AnswersForQuestion[]
}

export interface EditTopicState { 
    id?: number;
    number?: number;
    title?: string;
    error?: string;
}

export interface AddExerciseReturn {
    eid?: number;
    qids?: number[];
    error?: string;
}

export interface AddModuleReturn {
    id?: number;
    warning?: string;
    error?: string;
}

export interface AuthoriseQuestionAnswerState {
    qids: number[];
    error?: string;
}

export interface DeleteTopicReturn {
    errors?: string[]
};

export interface SetUnlockedReturn {
    unlockStatus?: boolean;
    error?: string;
}

export interface DeleteModuleReturn {
    errors: string[];
    warning?: string;
}