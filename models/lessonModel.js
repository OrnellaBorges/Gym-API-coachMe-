module.exports = (_db) => {
	db = _db
	return LessonModel
}

class LessonModel {
	
	static getAllLesson(coach_id) {
	    return db.query('SELECT lesson.id, coach_id, user_id, status, start, end, lesson.creationTimestamp, firstName, lastName,email, sport, address, zip, city, lat, lng, tjm  FROM lesson INNER JOIN coach ON lesson.coach_id = coach.id WHERE coach_id = ? ORDER BY start', [coach_id])
    	.then((result)=>{
			return result;
		})
		.catch((err)=>{
				return err;
		})
	 
	}
	
	static getOneLesson(id) {
	    return db.query('SELECT lesson.id, coach_id, user_id, status, start, end, lesson.creationTimestamp, firstName, lastName,email, sport, address, zip, city, lat, lng, tjm  FROM lesson INNER JOIN coach ON lesson.coach_id = coach.id WHERE lesson.id = ?', [id])
    	.then((result)=>{

			return result;
		})
		.catch((err)=>{
				return err;
		})
	}
	
	static saveOneLesson(req) {
	    return db.query('INSERT INTO lesson (coach_id, status, start, end, creationTimestamp) VALUES (?, "free", ?, ?, NOW())', [req.body.coach_id, req.body.start, req.body.end])
    	.then((result)=>{
			return result;
		})
		.catch((err)=>{
				return err;
		})
	}
	
	static deleteLesson(id) {
	    return db.query('DELETE FROM lesson WHERE id =? ', [id])
    	.then((result)=>{

			return result;
		})
		.catch((err)=>{
				return err;
		})
	}
	
	
	static updateLesson(id, req) {
	    return db.query( 'UPDATE lesson SET start= ?, end = ?  WHERE id= ?', [req.body.start, req.body.end, id])
    	.then((result)=>{
			return result;
		})
		.catch((err)=>{
				return err;
		})
	}
	
	static updateStatus(user_id, status,price, id) {
	    return db.query( 'UPDATE lesson SET user_id= ?, status = ?, totalAmount = ?  WHERE id= ?', [user_id, status, price, id])
    	.then((result)=>{

			return result;
		})
		.catch((err)=>{
				return err;
		})
	    
	}
}