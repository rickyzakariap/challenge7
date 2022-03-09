const { User, UserBiodata, UserHistory } = require('../models')
const sequelize = require('sequelize');

module.exports = {
    showDash: async(req, res)=>{
        try{
            var list = await UserBiodata.findAll()
                                // .then((data) => {console.log(data)})
            res.render('admin/alluser', {
                user: list
            })

        }catch(error) {
            console.log(error)
        }
        
    },
    showDashAPI: async (req, res) =>{
        try {
            await User.findAll()
                        .then(result => res.json(result))
        } catch (error) {
            console.log(error);
        }
    },
    deleteUserAPI: async (req, res) => {
        const {userID} = req.body
        await User.destroy({
            where: {
              id: userID
            }
        }).then(res.json("User Deleted"))
    },

    deleteUser: async(req, res)=>{
        try {
            const { userID, deleteUser } = req.body;

            if (deleteUser) {
                //Delete username, email, password
                await User.destroy({
                    where: {
                      id: userID
                    }
                });
                res.redirect('/admin/user')                                
            } else {
                res.status(404).json({
                    message: "Email or Password is wrong"
                })
                console.log("Failed!")
            } 
        } catch (error) {
            console.log(error);
        }
    }
}