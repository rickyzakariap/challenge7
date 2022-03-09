var router = require('express').Router();

//Middlewares
const restrict = require('../middlewares/restrict')
const superAdmin = require('../middlewares/SuperAdmin')

// Controllers
const auth = require('../controller/authController');
const method = require('../controller/method')
const admin = require('../controller/admin')

router.get('/', async (req, res) => {
    res.render('homepage')
},)

//GAMEPLAY
router.get('/game', async (req, res) =>{
    res.render('game', {
        username: req.query.username || 'PLAYER 1'
    })
})


router.get('/register', (req, res) => res.render('register'))
router.post('/register', auth.registerPostNonAPI)

router.get('/login', (req, res) => res.render('login'))
router.post('/login', auth.userLogin)

// router.get('/admin/user', admin.showDash)
// router.post('/admin/user/delete', admin.deleteUser)
//Read Method here
router.get('/user_list', method.user_list)

//Update Method here
router.get('/user_update', method.updateGet)
router.post('/user_update', method.updateInfo) 

//Delete Method here
router.get('/user_delete', method.deleteGet)
router.post('/user_delete', method.deleteDestroy)


module.exports = router;
