"use client"

import { useState, useEffect } from 'react';
import EditQuestion from './EditQuestionComponent';
import AddWholeQuestionComponent from './AddWholeQuestionComponent';
import ConfirmDeleteComponent from './ConfirmDeleteComponent';
import Flash from './Flash';
import { editExercise, deleteExercise, addQuestionsToExercise, setUnlocked } from '../actions/exercise';
import type { EditExerciseProps, Exercise, Question } from '../types';

export default function EditExerciseComponent({ exercise, onExerciseDeleted }: EditExerciseProps) {
    const [exDetails, setExDetails] = useState<Exercise>({ intro: "", questions: [] })

    const [editStatus, setEditStatus] = useState<{ message?: string, error?: string }>({ message: "" });
    const [addQuestionStatus, setAddQuestionStatus] = useState<{ message?: string, error?: string }>({ message: "" });

    useEffect(() => {
        setExDetails(exercise);
    }, [exercise]);

    const qOutput = exDetails.questions?.map((question, i) => <EditQuestion key={question.qid} question={question} num={i + 1} onQuestionDeleted={qid => {
        const newExDetails = {
            id: exDetails.id,
            publicNumber: exDetails.publicNumber,
            intro: exDetails.intro,
            unlocked: exDetails.unlocked,
            questions: exDetails.questions?.filter(question => question.qid != qid) ?? []
        };
        setExDetails(newExDetails);
    }} />);


    return exDetails.questions === undefined ? "" : <div>
        <div style={{ marginTop: '10px' }}>
            <h3 style={{ display: 'inline' }}>Exercise {exDetails.publicNumber} (ID {exDetails.id})</h3>
            <span title='Delete exercise'><ConfirmDeleteComponent color='red' onDeleteConfirmed={del} /></span>
        </div>
        <div>
            <textarea style={{ width: "40%", height: "200px" }}
                onChange={e => {
                    const newExDetails = structuredClone(exDetails);
                    newExDetails.intro = e.target.value;
                    setExDetails(newExDetails);
                    setEditStatus({ message: "" });
                }
                } value={exDetails.intro} />
            <br />
            <button onClick={edit}>Save</button>
            <div>Visibility:
                <select value={exDetails.unlocked ? '1' : '0'} onChange={async (e) => {
                    try {
                        const newUnlockedStatus = await setUnlocked(exDetails.id!, e.target.value == '1' ? true : false);
                        if (newUnlockedStatus?.error) {
                            setEditStatus(newUnlockedStatus);
                        }
                        else if (newUnlockedStatus !== null) {
                            const newExDetails = structuredClone(exDetails);
                            newExDetails.unlocked = newUnlockedStatus.unlockStatus;
                            setExDetails(newExDetails);
                        }
                    } catch (e: any) {
                        setEditStatus({ error: e.message });
                    }
                }}>
                    <option value='0'>Default</option>
                    <option value='1'>Unlocked</option>
                </select>
            </div>
            <Flash style={{ backgroundColor: editStatus.error ? '#ffc0c0' : '#c0ffc0' }} msg={editStatus.error || editStatus.message} />
            {qOutput}
            <h3>Add new questions</h3>
            <AddWholeQuestionComponent btnText='Save Questions To Database' onQuestionsSubmitted={(questions) => {
                return saveQuestionsToServer(exDetails.id!, questions as any); // TODO fix this question versus inputquestion issue
            }} />
            <Flash style={{ backgroundColor: addQuestionStatus.error ? '#ffc0c0' : '#c0ffc0' }} msg={addQuestionStatus.error || addQuestionStatus.message} />
        </div>
    </div>;

    async function edit() {
        try {
            const results = await editExercise(exDetails.id!, exDetails.intro!);
            setEditStatus(results.error ? { error: results.error } : { message: "Successfully updated." });
        } catch (e: any) {
            setEditStatus({ error: e.message });
        }
    }

    async function del() {
        try {
            const results = await deleteExercise(exDetails.id!);
            setEditStatus(results.error ? { error: results.error } : { message: "Successfully deleted." });
            onExerciseDeleted(exDetails.id!);
        } catch (e: any) {
            setEditStatus({ error: e.message });
        }
    }

    async function saveQuestionsToServer(id: number, questions: Question[]) {
        try {
            const results = await addQuestionsToExercise(id, questions);
            if (results.qids) {
                const newExDetails = structuredClone(exDetails);
                questions.forEach((q, i) => {
                    q.qid = results.qids[i];
                });
                newExDetails.questions!.push(...questions);
                setExDetails(newExDetails);
                setAddQuestionStatus({ message: "Questions added successfully" });
                return true;
            } else {
                setAddQuestionStatus({ error: results.error });
                return false;
            }
        } catch (e: any) {
            setAddQuestionStatus({ error: e.message });
            return false;
        }
    }
}
