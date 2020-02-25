const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port =3000 ||process.env.port
const dotenv = require('dotenv')
dotenv.config()

//Connect to Database:
mongoose.connect(process.env.MONGO_URI,({
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}),(error)=>{
if(error){
    console.log(error)
}
})
const db = mongoose.connection
db.on('error',()=>console.log('Failed to connect to DB'));
db.on('open',()=>console.log('Connected to MongoDB'))

//Middlewares:
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended:true
}))


//import routes
const authRoutes = require('./routes/auth')
app.use("/api/user",authRoutes)
//import post route: PRIVATE ROUTES
const postRoutes = require('./routes/posts')
app.use('/api/posts',postRoutes)
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});