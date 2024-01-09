const bcrypt = require('bcrypt');
const saltRounds = 10; 

module.exports = (_db) => {
	db = _db
	return UserModel
}


class UserModel {
	
	static saveOneUser(req) {
	    return bcrypt.hash(req.body.password, saltRounds)
		.then(function(hash) {
			return db.query('INSERT INTO user (firstName, lastName, email, password,  address, zip, city, creationTimestamp) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', [req.body.firstName, req.body.lastName, req.body.email, hash, req.body.address, req.body.zip, req.body.city])
        	.then((result)=>{
				return result;
			})
			.catch((err)=>{
				return err;
			})
		});
	}
	
	static getUserByMail(email) {
	    return  db.query('SELECT * FROM user WHERE email = ?', [email])
		.then((userdb)=>{
			console.log('user', userdb);

			if (userdb.length === 0) {
		        return {
		        	status: 401,
		       		error: 'email incorrect'
		      	}
		     } else {
		  		return userdb;
			}
		})
		.catch((err)=>{
			return err;
		})
	}
	
	static getOneUser(id) {
	    return  db.query('SELECT * FROM user WHERE id = ?', [id])
		.then((userdb)=>{
		  	return userdb;
		})
		.catch((err)=>{
			return err;
		})
	}
	
	static updateUser(id, req) {
	    return  db.query('UPDATE user SET firstName= ?, lastName= ?, address=?, zip= ?, city= ? WHERE id= ?', [req.body.firstName, req.body.lastName, req.body.address, req.body.zip, req.body.city, id])
		.then((userdb)=>{
		  	return userdb;
		})
		.catch((err)=>{
			return err;
		})
	}
}