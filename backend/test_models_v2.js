import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

async function testSpecificModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ["gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-2.5-flash"];

    for (const modelName of models) {
        console.log(`\nTesting ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            console.log(`✅ ${modelName} SUCCESS:`, response.text());
        } catch (error) {
            console.error(`❌ ${modelName} FAILED:`, error.message);
        }
    }
}

testSpecificModels();
