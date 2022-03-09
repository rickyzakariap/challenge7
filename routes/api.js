var router = require('express').Router();

//Middlewares
const restrict = require('../middlewares/restrict')
const superAdmin = require('../middlewares/SuperAdmin')

// Controllers
const auth = require('../controller/authController');
const room = require('../controller/room')
const method = require('../controller/method')
const admin = require('../controller/admin')

router.post('/register', auth.registerPost)
router.post('/login', auth.userLogin);

// Get user details
router.get('/me', restrict, auth.me);
router.get('/user_history', restrict, auth.userHistoryAPI)
router.get('/user_info', restrict, auth.user_info)


//Just admin things
router.get('/user', restrict, superAdmin, admin.showDashAPI)
router.post('/user/delete', restrict, superAdmin, admin.deleteUserAPI)



//game 
router.post('/create', restrict, room.createRoom)
router.post('/fight/:id', restrict, room.fight)
router.get('/result/:id', room.getResult)







module.exports = router;
