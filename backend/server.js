import express, { response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import connnectDB  from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

//app config

const app = express()
const port = process.env.PORT || 4000
connnectDB()
connectCloudinary()

//MIDDLEWARES

app.use(express.json())
app.use(cors())  //helps to connnect frontend with the backend

//API endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
//localhost:4000/api/admin/add-doctor

app.get('/',(req,res)=>{
    res.send('API WORKING')

})
app.listen(port,()=> console.log("Server running" ,port))

