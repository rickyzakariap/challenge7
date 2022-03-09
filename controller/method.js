//Models here
const { User, UserBiodata, UserHistory } = require('../models')
const Sequelize = require('sequelize')

module.exports= {
    updateGet: async(req, res) => {
        res.render('users/user_update')
    },

    deleteGet: async(req, res) => {
        res.render('users/user_delete')
    },

     //Read method here
    user_list: async (req, res) => {
        try{
            var list = await UserBiodata.findAll()
                                // .then((data) => {console.log(data)})
            res.render('users/user_list', {
                userList: list
            })

        }catch(error) {
            console.log(error)
        }
    },

    user_info: async (req, res) =>{
        try {
            const{ username, email, password } = req.body;
            User.authenticate({username, password})
                .then(result =>{
                    getID = result.dataValues.id
                    var list = UserBiodata.findOne({where:{
                        user_id: getID
                    }})
                    res.render()
                })
        } catch (error) {
            console.log(error);
        }
    },

    //update method here
    updateInfo: async(req, res) =>{
        try{
            //Taking login method
            const {
                username,
                password,
                email,
                description
            } = req.body
            
            User.authenticate({username, password})
                .then(result => {
                    User.update({
                        email
                    }),{
                        where:{
                            id: result.id
                        }
                    }
                    UserBiodata.update({
                        description
                    },{
                        where:{
                            user_id: result.id
                        }
                    }).
                    res.json('Updated')

                }).catch(err => res.json(err))
                       

        }catch(error){
            console.log(error);
        }
    },

    deleteDestroy: async(req, res) =>{
        try{
        //Taking login method
            const {
                username,
                password,
            } = req.body
            // console.log(`input: ${email}, Password: ${password}`)
            User.authenticate({username, password})
                .then(result =>{
                     User.destroy({
                        where: {
                          id: result.id
                        }
                    });
                    console.log(result.id)
                }).catch(err =>{
                    res.json(err);
                    console.log(err);
                })
                
            // const userFind = await User.findOne({
            //     where: {
            //         username: username,
            //         password: password
            //     }
            // })
            // if (userFind) {
            //     //Delete username, email, password
            //     await User.destroy({
            //         where: {
            //           id: userFind.id
            //         }
            //     });
            //     res.redirect('/')                                
            // } else {
                
            // } 
        }catch(error){
            console.log(error);
        }
    }

}