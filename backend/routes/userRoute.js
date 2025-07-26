import express from 'express'
import { registerUser,loginUser, getProfile ,updateprofile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay, verifyRazorpay} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'


const userRouter = express.Router()

//create endpoint

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser ,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateprofile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay) //not tested in postman 12:02:00





export default userRouter