const { Room, UserHistory } = require('../models')
const sequelize = require('sequelize')
const express = require('express')

async function roundResult (getId){
    let getWinner = (result) =>{
        Room.update(
            {
                roundResult: sequelize.fn('array_append', sequelize.col('roundResult'), result)
            },
            {where: {id: getId}, returning: true}
        )  
    }
    Room.findOne({where: {id: getId}})
        .then((result)=>{
            let numofOne = 1;
            let numofTwo = 1;
            let winner;
            let loser;
            let roomID = result.dataValues.id;
            let playerOneId = result.dataValues.playerOneId;
            let playerTwoId = result.dataValues.playerTwoId;
            let playerOne = result.dataValues.playerOneMove;
            let playerTwo = result.dataValues.playerTwoMove;
            for (var i = 0; i < 3; i++){
                if(playerOne[i] === playerTwo[i]){
                    getWinner("Draw");
                    console.log("Index: " + i + " " + "Draw")
                }else if(playerOne[i] === "rock"){
                    if (playerTwo[i] === "paper") {
                        getWinner("Player 2 Win!");
                        numofTwo++;
                        // console.log("Index: " + i + " " + "P2Win")                                                   
                    } else {
                        getWinner("Player 1 Win!");
                        numofOne++
                        // console.log("Index: " + i + " " + "P1Win")                                                   
                    }
                }else if(playerOne[i] ==="paper"){
                    if (playerTwo[i] === "scissor") {
                        getWinner("Player 2 Win!");
                        numofTwo++;
                        // console.log("Index: " + i + " " + "P2Win")                                                   
                    } else {
                        getWinner("Player 1 Win!");
                        numofOne++
                        // console.log("Index: " + i + " " + "P1Win")                                                   
                    }
                }else if(playerOne[i] === "scissor"){
                    if (playerTwo[i] === "rock") {
                        getWinner("Player 2 Win!");
                        numofTwo++;
                        // console.log("Index: " + i + " " + "P2Win")                                                   
                    } else {
                        getWinner("Player 1 Win!");
                        numofOne++
                        // console.log("Index: " + i + " " + "P1Win")                                                   
                    }
                }
            }
            //function to create UserHistory for both players
            if(numofOne == numofTwo){
                winner = "draw"
            }else if(numofOne > numofTwo){
                winner = playerOneId;
                loser = playerTwoId;
            }else if(numofOne < numofTwo){
                winner = playerTwoId;
                loser = playerOneId;
            }
            console.log("UserHistory is being added");
            if(winner != "draw"){
                UserHistory.create({
                    date: new Date(),
                    user_id: winner,
                    result: `WIN against ${loser} in room id: ${roomID}`
                }).then(
                    UserHistory.create({
                        date: new Date(),
                        user_id: loser,
                        result: `LOSE against ${winner} in room id: ${roomID}`
                    })
                )
            }else{
                UserHistory.create({
                    date: new Date(),
                    user_id: playerOneId,
                    result: `DRAW against ${playerTwoId} in room id: ${roomID}`
                }).then(
                    UserHistory.create({
                        date: new Date(),
                        user_id: playerTwoId,
                        result: `DRAW against ${playerOneId} in room id: ${roomID}`
                    })
                )
            }
            

        })
        .catch((err) => console.log(err));
}



module.exports = {
    showRoomList: async (req, res) => {
        await Room.findAll()
            .then((room) => {
                res.json(room)
            })
    },

    createRoom: async (req, res) =>{
        await Room.create({playerOneId: req.user.id})
            .then((room)=>{res.json(room)})
    },

    deleteRoom: async (req, res)=>{
        await Room.destroy({
            where: {id: req.params.id}
        })
    },
    

    getResult : async (req, res) => {
        try {
            // roundResult(req.params.id)
            await Room.findOne({where: {id: req.params.id}})
            .then((result) =>{
                let round = result.dataValues.roundResult
                res.json(round)
            })
        } catch (error) {
            console.log(error)
        }
    },
    

    fight: async (req, res, next) => {
        const{ playerOneMove, playerTwoMove } = req.body
        //if function to determine which is player one and two
        Room.findOne({where: {id: req.params.id}})
            .then((result) =>{
                let playerOneId = result.dataValues.playerOneId
                let playerOneMoveDB = result.dataValues.playerOneMove
                let playerTwoMoveDB = result.dataValues.playerTwoMove
                //if this is not player one
                if(req.user.id !== playerOneId){
                    if(playerTwoMoveDB === null || playerTwoMoveDB.length < 3){
                        Room.update(
                            {
                                playerTwoId: req.user.id,
                                playerTwoMove: sequelize.fn('array_append', sequelize.col('playerTwoMove'), playerTwoMove)
                            },
                            {where: {id: req.params.id}, returning: true}
                        ).then((update)=>{
                            res.status(200).json(update)
                        }) .catch((err) => {
                            console.log(err);
                          });
                    }
                }
                //if this is player one
                else if (req.user.id === playerOneId){
                    if(playerOneMoveDB === null || playerOneMoveDB.length < 3){
                        Room.update(
                            {
                                playerOneMove: sequelize.fn('array_append', sequelize.col('playerOneMove'), playerOneMove)
                            },
                            {where: {id: req.params.id}, returning: true}
                        ).then((update)=>{
                            res.status(200).json(update)
                        }) .catch((err) => {
                            console.log(err);
                          });                            
                    }
                }
                if(playerOneMoveDB.length == 3 && playerTwoMoveDB.length == 3){
                    roundResult(req.params.id)
                    res.json({message: `result has been recorded! Please go to /api/result/${req.params.id}`})
                    console.log(playerOneMoveDB.length);
                    console.log("roundResult is working");
                }
            })
            .catch((err) => {
                console.log(err);
              });
            
    }

}