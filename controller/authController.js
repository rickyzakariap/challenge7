const { User, UserBiodata, UserHistory } = require('../models')
const sequelize = require('sequelize');

const { json } = require('sequelize');


module.exports = {
    registerPostNonAPI: async (req, res, next) => {
        try {
            await User.register(req.body)
            .then((result) => {
                UserBiodata.create({
                    name: result.username,
                    user_id: result.id
                });
                res.redirect('/login')
            })
            .catch(err => next(err));
        } catch (error) {
            console.log(error)
        }
        
    },

    registerPost: async(req, res, next) => {
        try {
            await User.register(req.body)
            .then(result => {
                UserBiodata.create({
                    name: result.username,
                    user_id: result.id
                });
                res.json("Registered!");
            })
            .catch(err => {
                res.json(err)
            })
        } catch (error) {
            console.log(error)
        }
        
    },

    userLogin: async(req, res) => {
        try {
            User.authenticate(req.body)
            .then(user => {
                res.json({
                    id: user.id, 
                    username: user.username, 
                    accessToken: user.generateToken()
                });
            }).catch(err => {
                res.json(err);
                console.log("ERROR: " + err)
            })   
        } catch (error) {
            console.log(error)
        }
    },

    me: (req, res, next) => {
        try {
            res.json(req.user)
            console.log(req.user.role + typeof req.user.role)   
        } catch (error) {
            console.log(error)
        }
    },

    userHistoryAPI: async (req, res, next) =>{
        await UserHistory.findOne({
            where: {
                user_id: req.user.id
            }
        }).then(result =>{
            res.json(result)
        }).catch(err => {
            res.json({message: "ID not found! Make sure you are logged in!"})
        })
    },
    user_info: async (req, res) =>{
        try {
            
            var list = UserBiodata.findOne(
                {
                    where:{user_id: req.user.id},
                }
            ).then(result => res.json(result))
            
            
           
            
        } catch (error) {
            console.log(error);
        }
    },
}