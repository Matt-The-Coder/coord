require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000 || process.env.port
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('hello')
})
app.listen(port, ()=>{
    console.log(`Server started at port ${port}`)
})