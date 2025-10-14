import xss from 'xss';

export default class ExerciseDao {
    
    constructor(db) {
        this.db = db;
    }

    addExercise(topicid, intro, moduleid) {
        const stmt0 = this.db.prepare("SELECT COUNT(*) AS count FROM exercises WHERE moduleid=? AND topic=?");
        const { count } = stmt0.get(moduleid, topicid);
        const stmt = this.db.prepare("INSERT INTO exercises(topic, exercise, publicNumber, moduleid) VALUES (?,?,?,?)");
        const info = stmt.run(topicid, xss(intro), count+1, moduleid);
        return info.lastInsertRowid;
    }

    getExercisesForTopic(topicId) {
        const stmt = this.db.prepare("SELECT * FROM exercises WHERE topic=?");
        const results = stmt.all(topicId);
        return results;        
    }

    getExerciseByPublicNumber(topicId, publicNumber) {
        const stmt = this.db.prepare("SELECT * FROM exercises WHERE topic=? AND publicNumber=?");
        return stmt.get(topicId, publicNumber);
    }

    getFullExercise(exerciseId) {
        const stmt0 = this.db.prepare("SELECT exercise, unlocked FROM exercises WHERE id=?");
        const results0 = stmt0.get(exerciseId);
        if(results0 !== undefined) {
            const ex = {
                id: exerciseId,
                intro : results0.exercise,
                unlocked: results0.unlocked,
                questions: []
            };
            const stmt = this.db.prepare("SELECT q.id AS qid, qo.id AS qoid, q.question, qo.option FROM questions q LEFT JOIN qoptions qo ON q.id=qo.qid WHERE q.eid=? ORDER BY qid, qoid");
            const results = stmt.all(exerciseId);

            let currentQuestion = null;
            let currentOptionsObject = { options: [] };
            results.forEach( (result, i) => {
                if(result.qoid === null) {
                    ex.questions.push({qid: result.qid, question: result.question});
                } else {
                    currentOptionsObject.options.push(result.option);
                    if(result.qid !== currentQuestion) {
                        currentOptionsObject.qid = result.qid;
                        currentOptionsObject.question = result.question;
                        currentQuestion = result.qid;
                
                    } else {
                        if(i == results.length - 1 || results[i+1].qoid === null || results[i+1].qid != result.qid) {
                            ex.questions.push(currentOptionsObject);
                            currentOptionsObject = { options: [] };
                        }    
                    }
                }
            });
            return ex;        
        } else {
            return null;
        }
    }    


    getModuleAndPublicNumberFromId(eid) {
        const stmt = this.db.prepare("SELECT e.publicNumber, m.code FROM exercises e INNER JOIN modules m ON e.moduleid=m.id");
        return stmt.get();
    }

    getAll() {
        const stmt = this.db.prepare("SELECT e.*, m.code AS moduleCode FROM exercises e INNER JOIN modules m ON e.moduleid=m.id ORDER BY m.code, e.topic, e.publicNumber");
        return stmt.all();
    }

    editExercise(id, exercise) {
        const stmt = this.db.prepare("UPDATE exercises SET exercise=? WHERE id=?");
        const info = stmt.run(xss(exercise), id);
        return info.changes; 
    }

    setUnlocked(id, unlocked) {
        const stmt = this.db.prepare("UPDATE exercises SET unlocked=? WHERE id=?");
        const info = stmt.run(unlocked ? 1:0, id);
        return info.changes; 
    }

    deleteExercise(id) {
        const stmt = this.db.prepare("DELETE FROM exercises WHERE id=?");
        const info = stmt.run(id);
        return info.changes; 
    }
}
