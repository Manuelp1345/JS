const express = require("express")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const users = require("../models/users")
const {isAuthenticated} = require("../auth")

const router = express.Router()

const signtToken = (_id)=>{
    return jwt.sign({_id},"mi-secreto",{expiresIn:60 * 60 * 24 * 365})
}

router.post("/register", (req,res) =>{
    const { email, password} = req.body
    crypto.randomBytes(16,(err,salt)=> {
        const newSalt = salt.toString("base64")
        crypto.pbkdf2(password, newSalt, 10000, 64, "sha1", (err,key)=>{
            const encrytedPassword = key.toString("base64")
            users.findOne({email}).exec()
            .then(user => {
                if(user){
                    return res.send(false)
                }
                users.create({
                    email,
                    password: encrytedPassword,
                    salt: newSalt
                })
                .then(()=> {
                    res.send(true)
                })
            })
        })
    })
})

router.post("/login", (req,res) =>{
    const {email, password} = req.body
    users.findOne({email}).exec()
    .then(user => {
        if(!user){
            return res.send(false)
        }
        crypto.pbkdf2(password, user.salt, 10000, 64, "sha1", (err,key)=>{
            const encrytedPassword = key.toString("base64")
            if(user.password === encrytedPassword){
                const token = signtToken(user._id)
                return res.send({token})
            }
            return res.send(false)
        })
        
    })
    
})
router.get("/me",isAuthenticated, (req,res)=>{
    res.send(req.user)
})


module.exports = router