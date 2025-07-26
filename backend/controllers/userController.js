import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'


//API to register the user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }

        //validating email formaat
        if (!validator.isEmail(email)) {

            return res.json({ success: false, message: "enter a valid email" })

        }

        //validating a strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })

        }

        //hashing the user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userdata = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userdata)
        const user = await newUser.save()

        //_id to create a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//api for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })

        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}



//api to get user profile data
const getProfile = async (req, res) => {
    try {
        const userId = req.userId //u have changed here
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//api to update user profile
const updateprofile = async (req, res) => {
    try {
        const userId = req.userId;

        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file


        if (!name || !phone || !address || !dob || !gender) {

            return res.json({ success: false, message: "Data Missing" })

        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload img to cloudinary

            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })

            const imageURL = imageUpload.secure_url


            await userModel.findByIdAndUpdate(userId, { image: imageURL })

        }

        res.json({ success: true, message: "Profile Updated" })



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API to book an appointment
const bookAppointment = async (req, res) => {
    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {

            return res.json({ success: false, message: 'Doctor not available' })

        }

        let slots_booked = docData.slots_booked

        //checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' })

            } else {
                slots_booked[slotDate].push(slotTime)
            }

        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}


//API to get user appoointments for frontend my-appointment page
const listAppointment = async (req, res) => {
    try {
        const userId = req.userId

        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const userId = req.userId

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (!appointmentData) return res.json({ success: false, message: "Appointment not found" })

        if (appointmentData.userId.toString() !== userId) {
            return res.json({ success: false, message: 'Unauthorised action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//# public keys from the razor pay dev docs
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


//API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {

    try {

        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)


        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" })

        }

        //creating option for the payment

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.currency,
            receipt: appointmentId,
        }

        //creation of an order
        const order = await razorpayInstance.orders.create(options)
        res.json({ success: true, order })

    }

    catch (error) {
        res.json({ success: false, message: error.message })

    }
}

//api to verify payment rz ///remove for noww if not working

const verifyRazorpay = async(req,res)=>{
    try {
        const {razorpay_order_id}=req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"Payment Successfull"})
            
        }else{
            res.json({success:false,message:"Payment failed"})
        }
        
    } catch (error) {
         res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, getProfile, updateprofile, bookAppointment, listAppointment, cancelAppointment,paymentRazorpay, verifyRazorpay}