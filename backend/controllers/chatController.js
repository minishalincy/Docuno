import { GoogleGenerativeAI } from "@google/generative-ai";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from 'jsonwebtoken';

const chatWithGemini = async (req, res) => {
    try {
        const { message } = req.body;
        const { token } = req.headers;

        if (!message) {
            return res.json({ success: false, message: "Message is required" });
        }

        // 1. Gather Context
        const doctors = await doctorModel.find({}).select("-password -email -address");

        let appointments = [];
        let userId = null;
        let userName = "Guest";

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
                // Fetch user specific appointments
                appointments = await appointmentModel.find({ userId });
            } catch (error) {
                console.log("Token verification failed or guest user:", error.message);
            }
        }

        // 2. Construct System Prompt with Enhanced Context
        const currentDate = new Date().toDateString();

        // Define personality and role clearly
        let systemPrompt = `You are DocUno Assistant, a warm, professional, and empathetic medical booking assistant.
        Current Date: ${currentDate}
        
        Your Core Responsibilities:
        1. Help patients find the right doctor based on their symptoms or speciality request.
        2. Check and inform patients about their scheduled appointments when asked (e.g., "Do I have an appointment tomorrow?").
        3. Provide general, safe medical guidance (always add a disclaimer that you are an AI and not a doctor).
        
        Tone & Style:
        - Be human-like, conversational, and direct. 
        - Avoid robotic lists unless asked for "all doctors".
        - If the user asks "Do I have an appointment?", look at the "User's Appointments" section below.
        - If the user asks about a specific doctor, share their details.
        
        --- SYSTEM DATA START ---

        [Available Doctors]
        ${JSON.stringify(doctors.map(doc => ({
            name: doc.name,
            speciality: doc.speciality,
            experience: doc.experience + " experience",
            fees: "$" + doc.fees,
            available: doc.available ? "Yes" : "No",
            about: doc.about
        })))}

        [User's Appointments]
        `;

        if (userId && appointments.length > 0) {
            // Simplify appointment data for the AI to understand dates better
            const simplerAppointments = appointments.map(app => ({
                doctor: app.docData.name,
                date_str: app.slotDate, // Ensure this format matches "24_01_2004" or similar if that's how it's stored, or standard string.
                time: app.slotTime,
                status: app.isCompleted ? "Completed" : (app.cancelled ? "Cancelled" : "Scheduled"),
            }));
            systemPrompt += JSON.stringify(simplerAppointments);
        } else if (userId) {
            systemPrompt += "User has no appointments found in the system.";
        } else {
            systemPrompt += "User is not logged in. You cannot see their appointments.";
        }

        systemPrompt += `\n--- SYSTEM DATA END ---
        
        User Query: "${message}"
        
        Response:
        `;

        // 3. Call Gemini API with Fallback using Models available in list
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Prioritize the model confirmed to work
        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
        let result = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(systemPrompt); // Pass the full prompt string directly
                break;
            } catch (err) {
                console.warn(`Model ${modelName} failed:`, err.message);
                lastError = err;
            }
        }

        if (!result && lastError) {
            throw lastError;
        }

        const response = await result.response;
        const text = response.text();

        res.json({ success: true, response: text });

    } catch (error) {
        console.error("Gemini API Error (All models failed):", error.message);
        if (error.response) {
            console.error("Error Response:", JSON.stringify(error.response, null, 2));
        }
        res.status(500).json({ success: false, message: "I'm having a little trouble connecting right now. Please try again in a moment." });
    }
}

export { chatWithGemini };
