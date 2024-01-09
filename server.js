const express = require('express');
const app = express();
const mysql = require('promise-mysql');
const cors = require('cors');
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
let config;
console.log(process.env.HOST_DB)
if(!process.env.HOST_DB) {
	config = require('./config');
} else {
	config = require('./config_exemple');
}
// Mes routes api
const coachRoutes = require('./routes/coachRoutes');
const authRoutes = require('./routes/authRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const userRoutes = require('./routes/userRoutes');


const host = process.env.HOST_DB || config.db.host;
const database = process.env.DATABASE_DB || config.db.database;
const user = process.env.USER_DB || config.db.user;
const password = process.env.PASSWORD_DB || config.db.password;

console.log(host);
console.log(database);
console.log(user);
console.log(password);

mysql.createConnection({
	host: host,
	database: database,
	user: user,
	password: password
}).then((db) => {
	console.log('connecté bdd');
	setInterval(async function () {
		let res = await db.query('SELECT 1');
		//console.log(res);
	}, 5000);

    app.get('/', (req, res, next)=>{
    	res.json({status: 200, results: "welcome to api"});
    });
    
    //appel de mes routes
    coachRoutes(app, db);
	authRoutes(app, db);
	lessonRoutes(app, db);
	userRoutes(app, db);
    
})
.catch(err=>console.log(err))

const PORT = process.env.PORT || 9500;
app.listen(PORT, ()=>{
	console.log('listening port '+PORT+' all is ok');
})