const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (_db) => {
	db = _db
	return CoachModel
}


class CoachModel {
	
	static saveOneCoach(req) {
	    return bcrypt.hash(req.body.password, saltRounds)
		.then(function(hash) {
			return db.query('INSERT INTO coach (firstName, lastName, email, password, description, sport,  address, zip, city, lat, lng, tjm, creationTimestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [req.body.firstName, req.body.lastName, req.body.email, hash, req.body.description, req.body.sport, req.body.address, req.body.zip, req.body.city, req.body.lat, req.body.lng, req.body.tjm])
        	.then((result)=>{
				return result;
			})
			.catch((err)=>{
				return err;
			})
		});
	   
	}
	
	static getCoachByMail(email) {
	    return  db.query('SELECT * FROM coach WHERE email = ?', [email])
		.then((coachdb)=>{
			if (coachdb.length === 0) {
		        return {
		        	status: 401,
		       		error: 'email incorrect'
		      	}
		     } else {
		  		return coachdb;
			}
		})
		.catch((err)=>{
			return err;
		})
	    
	}
	
	static getOneCoach(id) {
	    return  db.query('SELECT * FROM coach WHERE id = ?', [id])
		.then((coachdb)=>{
		  	return coachdb;
		})
		.catch((err)=>{
			return err;
		})
	}
	
	static updateCoach(id, req) {
	    return  db.query('UPDATE coach SET firstName= ?, lastName= ?, description = ?, address=?, zip= ?, city= ?, sport= ?, tjm = ?, lat =?, lng = ? WHERE id= ?', [req.body.firstName, req.body.lastName, req.body.description, req.body.address, req.body.zip, req.body.city, req.body.sport, req.body.tjm, req.body.lat, req.body.lng, id])
		.then((coachdb)=>{
		  	return coachdb;
		})
		.catch((err)=>{
			return err;
		})
	}
	
	static getAllCoachByDistance(req) {
	    return db.query('SELECT * FROM coach WHERE Lat > ? AND Lat < ? AND Lng > ? AND Lng < ? AND sport= ?',
						 [req.body.min_lat, req.body.max_lat, req.body.min_lng, req.body.max_lng, req.body.sport])
		.then((result)=>{
			console.log('resultatttt',result);
			return result;
		})
		.catch((err)=>{
			return err;
		})
	    
	}
	
	static updateImg(req) {
	    return db.query('UPDATE coach SET imageUrl = ? WHERE id = ?', [req.body.imageUrl, req.body.id])
		.then((result)=>{
			return result;
		})
		.catch((err)=>{
			return err;
		})
	    
	}
	
}