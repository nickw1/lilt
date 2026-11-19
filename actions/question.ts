"use server"

import { getRequest } from 'tinyrsc/server';
import QuestionDao from '../dao/question.mjs';
import db from '../db';
import useLoggedIn from '../misc/login';

export async function editQuestion(id: number, question: string, options: string[]) {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can edit questions." };
    }
    const questionDao = new QuestionDao(db);
    try {
        if (question && id.toString().match("^\\d+$")) {
            const nUpdated = questionDao.editQuestion(id, question, options || []);
            return ({ nUpdated });
        } else {
            return ({ error: "No question text provided or invalid ID." });
        }
    } catch (e) {
        return ({ error: "Internal server error" });
    }
}

export async function deleteQuestion(id: number) {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can delete questions." };
    }
    if (id.toString().match("^\\d+$")) {
        const questionDao = new QuestionDao(db);
        try {
            const nUpdated = questionDao.deleteQuestion(id);
            return { nUpdated };
        } catch (e) {
            return { error: "Internal server error" };
        }
    } else {
        return { error: "Invalid ID." };
    }
}
