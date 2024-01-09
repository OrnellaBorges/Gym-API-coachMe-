const bcrypt = require('bcrypt');
const saltRounds = 10;
const withAuth = require('../withAuth');
let config
if(!process.env.HOST_DB) {
	config = require('../config');
} else {
	config = require('../config_exemple');
}
const secret = process.env.SECRET || config.token.secret;
const jwt = require('jsonwebtoken');

module.exports =  (app, db)=> {
	const CoachModel = require('../models/coachModel')(db);

    //route de récupération d'un coach par son id
    app.get('/api/v1/coach/one/:id', async (req, res, next)=>{
		const id = req.params.id
		let coach = await CoachModel.getOneCoach(id);
		if(coach.code) {
			res.json({status: 500, error : coach})
		}
		res.json({status: 200, result : coach[0]})
	})
    
    //route d'ajout d'un coach
    app.post('/api/v1/coach/save', async (req, res, next)=>{
        let verifemail = await CoachModel.getCoachByMail(req.body.email)
		
		if(verifemail.status === 401){
		    let coach = await CoachModel.saveOneCoach(req);
			if(coach.code) {
		        res.json({status: 500, error: coach})
		    }
			res.json({status: 200, results: coach})
		}else{
		    res.json({status: 403, error: "Impossible d'enregistrer sur cet email"})
		}
    })  
    
    //route de login d'un coach
    app.post('/api/v1/coach/login', async (req, res, next)=>{
		let coach = await CoachModel.getCoachByMail(req.body.email);
		if(coach.code){
			res.json({status: 500, error: coach})
		}
		if(coach.status === 401){
			res.json({status: 401, error: coach.error})
		}else{
			let same = await bcrypt.compare(req.body.password, coach[0].password)
		
			if (same) {
			   	const payload = { email: req.body.email, id:coach[0].id };
		        const token = jwt.sign(payload, secret);
		        console.log(token);
		        res.json({ status: 200, token:token, coach: coach[0] }) 
		   	} else {
	     			res.json({status: 401, error: 'Votre mot de passe est incorrect'})
	        }
		}
		
    })	
    
    //route de modification d'un coach
    app.put('/api/v1/coach/update/:id', withAuth, async (req, res, next)=>{
		let id = req.params.id;
		let coach = await CoachModel.updateCoach(id, req);
        if(coach.code){
			res.json({status: 500, error: coach})
		}
		res.json({status: 200, result: coach})
	})
    
    //route de récupération de tous les coach dans rayon
    app.post('/api/v1/coach/distance', async (req, res, next)=>{
		let coachs = await CoachModel.getAllCoachByDistance(req);

		if(coachs.code) {
			res.json({status: 500, error : coachs})
		}

		res.json({status: 200, result: coachs})
	})
    
    //route de modification d'une image
    app.post('/api/v1/coach/updateImg', withAuth, async (req, res, next)=>{
		let coach = await CoachModel.updateImg(req);

		if(coach.code) {
			res.json({status: 500, error : coach})
		}

		res.json({status: 200, result: coach})
	})

}