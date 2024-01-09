const stripe = require('stripe')('sk_test_51IzetcLJHwOB3xS8Scys4aqt0tTpGSnpiRxPXgZye7zDrOYabfTBw2tJGHfC7BcEZoy8VitDlpjlfG69RICNzKMV00z6pK7PXN');
const withAuth = require('../withAuth');
const withAuthUser = require('../withAuthUser');
const moment = require('moment');
let config
if(!process.env.HOST_DB) {
	config = require('../config');
} else {
	config = require('../config_exemple');
}
const secret = process.env.SECRET || config.token.secret;
const secret_user = process.env.SECRET_USER || config.token.secret_user;
// routes permettant la gestion de la connexion par token
module.exports = function (app, connection) {
	const LessonModel = require('../models/lessonModel')(db);
	
	//route d'ajout d'un lesson
	app.post('/api/v1/lesson/save',withAuth , async (req, res, next)=>{
		let coach = await LessonModel.saveOneLesson(req);
	    if(coach.code){
	    	res.json({status: 500, err: coach})
	    }
	    res.json({ status: 200, coach: coach })
	})
	
	//route de récupération de toutes les lessons d'un coach
	app.get('/api/v1/lesson/all/:coachId' , async (req, res, next)=>{
		let coach_id = req.params.coachId
		let lessons = await LessonModel.getAllLesson(coach_id);
		console.log(lessons)
		if(lessons.code){
			res.json({status: 500, err: lessons})
		}
	    res.json({ status: 200, result: lessons })
	})
	
	
	//route de récupération d'une lesson
	app.get('/api/v1/lesson/one/:id' , async (req, res, next)=>{
		let id = req.params.id
		let lesson = await LessonModel.getOneLesson(id);
	    
	    if(lesson.code){
			res.json({status: 500, err: lesson})
		}
		
	    res.json({ status: 200, result: lesson[0] })
	})
	
	//route de suppression d'une lesson
	app.delete('/api/v1/lesson/delete/:id' , withAuth, async (req, res, next)=>{
		let id = req.params.id
		let lesson = await LessonModel.deleteLesson(id);
		
		if(lesson.code){
			res.json({status: 500, err: lesson})
		}
	    
	    res.json({ status: 200, result: lesson })
	})
	
	
	//route de modification d'une lesson
	app.put('/api/v1/lesson/update/:id' , withAuth, async (req, res, next)=>{
		let id = req.params.id
		let lesson = await LessonModel.updateLesson(id, req);
	    
	    if(lesson.code){
			res.json({status: 500, err: lesson})
		}
	
	    res.json({ status: 200, result: lesson })
	})
	
	
	//route de payment d'une lesson
	app.post('/api/v1/lesson/payment', withAuthUser, async (req, res, next)=>{
		//on calcul le montant total de notre panier
	 	//on initialise à zero
        let totalAmount = 0;
        
        //promise.all va attendre que toutes ne requètes soient éxécutés avant d'enregistrer dans notre data result le résultat de toutes ces promesses
	 	let result = await Promise.all(req.body.basket.map(async (lesson)=>{
	 		//on boucle sur chaque éléments du panier
	 		//on récupère les infos de la leçon concernée
	 		let lessonInfo = await LessonModel.getOneLesson(lesson.id);
	 		//on aditionne le montant de cette leçon au montant total en fonction du Tarif moyen du prof
	 		totalAmount += ((moment(lessonInfo[0].end) - moment(lessonInfo[0].start))/ 3600000 ) * lessonInfo[0].tjm
	 		//si le status est payé
	 		if(lessonInfo[0].status ==="payed") {
	 			//on envoi une erreur que le cours est déjà reservé (pour éviter qu'il paye dans le vide)
	 			res.json({status: 500, msg: "cours déjà pris", lesson: lessonInfo[0]})
	 		}
	 	}))
	 	
	 	console.log('final', totalAmount)
        //on crée le suivi de la tentative de paiement en nous branchant à notre api stripe
        const paymentIntent = await stripe.paymentIntents.create({
	        amount: totalAmount* 100,
	        currency: 'eur',
	        // Verify your integration in this guide by including this parameter
	        metadata: {integration_check: 'accept_a_payment'},
	        receipt_email: req.body.email,
	      });
        //console.log(client_secret)
	      //on renvoi la réponse de la tentative de paiement dans un objet protégé (infos bancaire sensible qui ne regarde personne)
	      res.json({client_secret: paymentIntent['client_secret']})
		
		
	})
	
	
    //route de validation dans la bdd de payment effectué
	app.put('/api/v1/lesson/validate', withAuthUser, async (req, res, next)=>{
        //on récup les infos du panier qui vien d'être payé
        let result = await Promise.all(req.body.basket.map(async (lesson)=>{
	 		let lessonInfo = await LessonModel.getOneLesson(lesson.id);
	 		//on récupère la somme totale du panier additionné pour chaque tour de boucle
	 		let total = ((moment(lessonInfo[0].end) - moment(lessonInfo[0].start))/ 3600000 ) * lessonInfo[0].tjm
	 		console.log(lessonInfo)
	 		
	 		//on met à jour le status de la commande à payed avec son prix total
	 		let updateLesson = await LessonModel.updateStatus(req.body.user_id, "payed", total , lesson.id)
	 	}))

		res.json({status: 200, msg: "paiement validé"})
    })
	
	
}