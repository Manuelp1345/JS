const express = require ("express")
const { response } = require("express")
const app = express()

app.get("*",(request,response)=> {
    response.send({message: "hola mundo"})
})

app.listen(3000,()=>console.log("nuestro servidor esta escuchando en el puerto 3000"))