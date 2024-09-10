
export default class ExerciseDao {
    
    constructor(db) {
        this.db = db;
    }

    getExercisesForTopic(topicId) {
        const stmt = this.db.prepare("SELECT * FROM exercises WHERE topic=?");
        const results = stmt.all(topicId);
        return results;        
    }


    getFullExercise(exerciseId) {
        const stmt = this.db.prepare("SELECT q.id AS qid, qo.id AS qoid, q.question, qo.option FROM questions q LEFT JOIN qoptions qo ON q.id=qo.qid WHERE q.eid=? ORDER BY qid, qoid");
        const results = stmt.all(exerciseId);

        const ex = [ ];
        let currentQuestion = null;
        let currentOptionsObject = { options: [] };
        results.forEach( (result, i) => {
            if(result.qoid === null) {
                ex.push({qid: result.qid, question: result.question});
            } else {
                currentOptionsObject.options.push(result.option);
                if(result.qid !== currentQuestion) {
                    currentOptionsObject.qid = result.qid;
                    currentOptionsObject.question = result.question;
                    currentQuestion = result.qid;
                
                } else {
                    if(i == results.length - 1 || results[i+1].qoid === null || results[i+1].qid != result.qid) {
                        ex.push(currentOptionsObject);
                        currentOptionsObject = { options: [] };
                    }    
                }
            }
        });
        return ex;        
    }    
}
