const bcrypt = require('bcrypt');
const saltRounds = 10;
const withAuthUser = require('../withAuthUser');
let config
if(!process.env.HOST_DB) {
	config = require('../config');
} else {
	config = require('../config_exemple');
} 
const secret = process.env.SECRET_USER || config.token.secret_user;
const jwt = require('jsonwebtoken');

module.exports =  (app, db)=> {
	const UserModel = require('../models/userModel')(db);
		
	//route de récupération d'un utilisateur par son id
	app.get('/api/v1/user/one/:id', async (req, res, next)=>{
		const id = req.params.id
		let user = await UserModel.getOneUser(id);
		if(user.code) {
			res.json({status: 500, error : user})
		}
		res.json({status: 200, result : user[0]})
	})	
	
	//route de sauvegarde d'un utilisateur
	app.post('/api/v1/user/save', async (req, res, next)=>{
		
		let verifemail = await UserModel.getUserByMail(req.body.email)
		
		if(verifemail.status === 401){
			let user = await UserModel.saveOneUser(req);
			if(user.code) {
		        res.json({status: 500, error: user})
		    }else{
		    	res.json({status: 200, results: user})
		    }
		}else{
			res.json({status: 403, error: "Impossible d'enregistrer sur cet email"})
		}		
		
	})
	
	//route de login d'un utilisateur
	app.post('/api/v1/user/login', async (req, res, next)=>{
		
		let user = await UserModel.getUserByMail(req.body.email)
		
		if(user.code){
			res.json({status: 500, error: user})
		}
		if(user.status === 401){
			res.json({status: 401, error: user.error})
		} else{
			let same = await bcrypt.compare(req.body.password, user[0].password)
		
			if (same) {
			   	const payload = { email: req.body.email, id:user[0].id };
		        const token = jwt.sign(payload, secret);
		        console.log(token);
		        res.json({ status: 200, token:token, user: user[0] }) 
		   	} else {
	     		res.json({status: 401, error: 'Votre mot de passe est incorrect'})
	    	}
		}
		
	})
	
	//route de modification d'un utilisateur
	app.put('/api/v1/user/update/:id', withAuthUser, async (req, res, next)=>{
		let id = req.params.id;
		let user = await UserModel.updateUser(id, req);
		if(user.code){
			res.json({status: 500, error: user})
		}
		res.json({status: 200, result: user})
	})
	

}