import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  conversations,
  fetchChecklistItems,
  fetchComplianceData,
  generateSWOTAnalysis,
  mergeChecklistData,
  processQuestion,
} from "./lib/utils.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const PYTHON_SERVER_URL = "http://127.0.0.1:5000/predict";

// API to get failure prediction
app.post("/api/failure-prediction", async (req, res) => {
  try {
    const { businessIdea, industry, investment, targetMarket } = req.body;

    // 🔹 Step 1: Get Insights from Gemini API
    const prompt = `Provide failure risk for ${businessIdea} based on market factors and business insights for a startup in the ${industry} industry targeting ${targetMarket}.`;

    // const geminiResponse = await model.generateContent(prompt);
    // const geminiInsights =
    //   geminiResponse?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    //   "No insights available";

    // 🔹 Step 2: Transform Data for Flask API
    const requestData = {
      category_list: industry || "Unknown",
      funding_total_usd: String(investment), // Default to 1M if undefined
      funding_rounds: "3",
      country_code: "US",
      company_age: 5,
      funding_gap: 730,
    };
    console.log("Request Data Sent to Python:", requestData);

    // 🔹 Step 3: Send Data to Flask ML API
    const flaskResponse = await axios.post(PYTHON_SERVER_URL, requestData);
    console.log("Flask Response:", flaskResponse.data);

    if (!flaskResponse.data || flaskResponse.data.risk_factors === undefined) {
      console.log("Risk factors missing:", flaskResponse.data);
    }

    // 🔹 Step 4: Return Final Response
    res.json({
      success: true,
      message: "Failure prediction data generated successfully",
      prediction: flaskResponse.data, // Contains failure_rate, success_rate, risk_factors
      // insights: geminiInsights, // AI-generated business insights
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

//legal compliance
// Endpoint to get all checklist items (without location-specific details)
app.get("/api/checklist", async (req, res) => {
  const { country, region } = req.query;
  try {
    const items = await fetchChecklistItems(country, region);
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint to get location-specific details for a checklist item
app.get("/api/checklist/:itemId/details", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { country, region } = req.query;

    if (!country || !region) {
      return res.status(400).json({ error: "Country and region are required" });
    }

    const complianceData = await fetchComplianceData(itemId, country, region);
    return res.json(complianceData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint to get complete data for a specific checklist item
// app.get("/api/checklist/:itemId", async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const { country, region } = req.query;

//     if (!country || !region) {
//       return res.status(400).json({ error: "Country and region are required" });
//     }

//     // Get all checklist items
//     const allItems = await fetchChecklistItems();

//     // Find the requested item
//     const item = allItems.find((item) => item.id === itemId);
//     if (!item) {
//       return res.status(404).json({ error: "Checklist item not found" });
//     }

//     // Get location-specific details
//     const complianceData = await fetchComplianceData(itemId, country, region);

//     // Merge and return complete data
//     const completeItem = mergeChecklistData(item, complianceData);
//     return res.json(completeItem);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// Endpoint to process a question and get mentor advice
app.post("/api/mentor/ask", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        error: "Session ID and message are required",
      });
    }

    const response = await processQuestion(sessionId, message);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while processing your question",
      details: error.message,
    });
  }
});

// Endpoint to get suggested starter questions
app.get("/api/mentor/suggested-questions", async (req, res) => {
  try {
    // These could be dynamically generated, but using static ones for reliability
    const suggestedQuestions = [
      "How do I find my first customers?",
      "When should I hire my first employee?",
      "How much equity should I give to co-founders?",
      "What metrics should I focus on in my first year?",
      "How do I create an effective pitch deck?",
      "What's the best way to approach investors?",
      "How do I know if my startup idea is viable?",
      "What legal structure is best for my startup?",
      "How should I price my product or service?",
      "What are the most common mistakes first-time founders make?",
    ];

    return res.json({ questions: suggestedQuestions });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred",
      details: error.message,
    });
  }
});

// Endpoint to reset a conversation
app.post("/api/mentor/reset", (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Clear conversation history
    conversations[sessionId] = [];

    return res.json({
      success: true,
      message: "Conversation reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred",
      details: error.message,
    });
  }
});

//Enpoint to competitor analysis

app.post("/api/analyze/swot", async (req, res) => {
  try {
    const { startupData } = req.body;

    if (!startupData) {
      return res.status(400).json({
        error: "Startup profile data is required",
      });
    }

    const analysis = await generateSWOTAnalysis(startupData);
    return res.json(analysis);
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while generating the analysis",
      details: error.message,
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
