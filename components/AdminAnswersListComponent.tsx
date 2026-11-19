"use client"
import { useActionState } from 'react';
import { authoriseQuestionAnswers } from '../actions/answer';
import type { Answer, AnswersForQuestion, AdminAnswersListProps, AuthoriseQuestionAnswerState } from '../types';

export default function AdminAnswersListComponent({ answers }: AdminAnswersListProps) {

    const [authorisedQuestions, authoriseAnswersWithState] = useActionState<AuthoriseQuestionAnswerState, FormData>(authoriseQuestionAnswers, { qids: [] as number[] });

    const output = answers.filter((qAnswer: AnswersForQuestion) => authorisedQuestions.qids.indexOf(qAnswer.qid) == -1).map((answer: AnswersForQuestion, i: number) => {
        const answersForQuestion = answer.answers.map(
            (indivAnswer: Answer) =>
                <li key={indivAnswer.id}>{indivAnswer.answer}</li>
        );
        return <div style={{ whiteSpace: 'pre-wrap' }} key={answer.qid}>
            <h4>Question ID {answer.qid}</h4>
            <ul>{answersForQuestion}</ul>
            {answersForQuestion.length > 0 ?
                <form action={authoriseAnswersWithState}>
                    <input type='hidden' name='qid' value={answer.qid} />
                    <input type='submit' value='Authorise All' />
                </form> : ''}
        </div>;
    });

    return <div>
        {output.length > 0 ? output : "No answers."}
    </div>;
}
