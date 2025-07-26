import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"


const changeAvailability = async (req, res) => {

    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })


    }
}


//controller fuc: API for doctor login
const loginDoctor = async (req, res) => {
    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {

            return res.json({ success: false, message: 'Invalid Credentials' })

        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: 'Invalid Credentials' })

        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//func to get API for doctor appointment in doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const token = req.headers.dtoken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const appointments = await appointmentModel.find({ docId: decoded.id });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API to mark appointment completed in doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const token = req.headers.dtoken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const docId = decoded.id;

        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId.toString() === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: 'Appointment Completed' });
        } else {
            return res.json({ success: false, message: 'Mark Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//API to cancel appointment from doc panel

const appointmentCancel = async (req, res) => {
    try {
        const token = req.headers.dtoken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const docId = decoded.id;

        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId.toString() === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: 'Appointment Cancelled' });
        } else {
            return res.json({ success: false, message: 'Cancellation Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//API for doc dashboard in doc panel
const doctorDashboard = async (req, res) => {
    try {
        const token = req.headers.dtoken;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Doctor token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const docId = decoded.id;

        const appointments = await appointmentModel.find({ docId });

        let earning = 0;
        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earning += item.amount;
            }
        });

        const patients = [];
        appointments.forEach((item) => {
            if (!patients.includes(item.userId.toString())) {
                patients.push(item.userId.toString());
            }
        });

        const dashData = {
            earning,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.slice().reverse().slice(0, 5),
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//API to get the doctor profile in the doc panel
const doctorProfile = async (req, res) => {
    try {
        const token = req.headers.dtoken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const docId = decoded.id;

        const profileData = await doctorModel.findById(docId).select('-password');
        if (!profileData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        res.json({ success: true, profileData });
    } catch (error) {
        console.log("Error fetching profile:", error);
        res.json({ success: false, message: error.message });
    }
};


const updateDoctorProfile = async (req, res) => {
    try {
        const token = req.headers.dtoken;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Doctor token missing' });
        }

        // Decode doctor ID from token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const docId = decoded.id;

        // Extract the updated fields from the request body
        const { fees, address, available } = req.body;

        // Update doctor profile
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log("Error updating doctor profile:", error);
        res.json({ success: false, message: error.message });
    }
};





export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}