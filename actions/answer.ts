"use server"

import db from '../db';
import AnswerDao from '../dao/answer.mjs';
import getLoginStatus from '../misc/login';
import xss from 'xss';
import { getRequest } from 'tinyrsc/server';
import type { AnswerQuestionsState, AuthoriseQuestionAnswerState } from '../types';
import TopicDao from '../dao/topic.mjs';


export async function answerQuestions(prevState: AnswerQuestionsState, formData: FormData): Promise<AnswerQuestionsState> {
    const request = getRequest()!;
    const answerDao = new AnswerDao(db);
    const { uid } = await getLoginStatus(request);
    const answered = [];
    if (uid !== null) {
        const status = [];
        for (let [key, answer] of formData) {
            const qid = key.substring(1);
            if (qid && answer && qid.match("^\\d+$")) {
                const info = answerDao.addAnswer(xss(uid.toString()), xss(qid), xss(answer as string));
                if (info === null) {
                    status.push(`Question ${qid} already answered, ignoring.`);
                } else if (info.changes) {
                    answered.push(parseInt(qid));
                }
            }
        }
        return {
            status: status.length > 0 ? status : "Answered all questions",
            answered
        };
    } else {
        return { "error": "Not logged in. Your login may have timed out, please login again." };
    }
}


export async function authoriseQuestionAnswers(prevState: AuthoriseQuestionAnswerState, formData: FormData): Promise<AuthoriseQuestionAnswerState> {
    const request = getRequest()!;
    const { isAdmin } = await getLoginStatus(request);
    if (!isAdmin) {
        return { "error": "Only admins can authorise answers.", qids: [] };
    }
    const answerDao = new AnswerDao(db), topicDao = new TopicDao(db);
    let qid = formData.get("qid") as string | null, qidInt;
    if (qid && qid.match("^\\d+$")) {
        qidInt = parseInt(qid);
        const authorised = answerDao.authoriseQuestionAnswers(qidInt);
        if (authorised) {
            topicDao.markUpdatedByQuestion(qidInt);
            const newState = structuredClone(prevState);
            newState.qids.push(qidInt);
            return newState;
        }
    }
    return prevState;
}

