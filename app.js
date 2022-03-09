const express = require('express')
const port = process.env.port || 8000;
var cookieParser = require('cookie-parser');
var path = require ('path');

// include session & flash
const session = require('express-session')
const flash = require('express-flash')

const app = express()

//router
var usersRouter = require('./routes/users')
var apiRouter = require('./routes/api')


// Setting template engine EJS
app.set('view engine', 'ejs')

//set support body 
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

//important to link css and other static file that in public folder
app.use(express.static('public'));

app.use(express.static(path.join(__dirname + '../public')));
app.use(cookieParser());




  
//Setting session passport
const passport = require('./lib/passport');
app.use(passport.initialize())
// app.use(passport.session())

// // setting flash
// app.use(flash());

//routes
app.use('/', usersRouter)
app.use('/api', apiRouter)





 
app.listen(port, () => {
  console.log(`Go to http://localhost:${port}`)
})

