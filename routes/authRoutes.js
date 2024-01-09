const withAuth = require('../withAuth');
const withAuthUser = require('../withAuthUser');
const jwt = require('jsonwebtoken');
let config
if(!process.env.HOST_DB) {
	config = require('../config');
} else {
	config = require('../config_exemple');
}
const secret = process.env.SECRET || config.token.secret;
const secret_user = process.env.SECRET_USER || config.token.secret_user;

// routes permettant la gestion de la connexion par token
module.exports = function (app, db) {
	const CoachModel = require('../models/coachModel')(db);
	const UserModel = require('../models/userModel')(db);
	// test des tokens
	app.get('/api/v1/coach/checkToken',withAuth , async (req, res, next)=>{
		let coach = await CoachModel.getOneCoach(req.id);
		if(coach.code){
	    	res.json({status: 500, error: coach})
		}
		res.json({ status: 200, coach: coach })
	})

	app.get('/api/v1/user/checkToken',withAuthUser , async (req, res, next)=>{
		let user = await UserModel.getOneUser(req.id);
	    if(user.code){
	    	res.json({status: 500, error: user})
	    }
	    res.json({ status: 200, user: user[0] })
	})
}