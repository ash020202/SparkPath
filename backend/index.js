import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  conversations,
  fetchLegalComplianceData,
  fetchLegalChecklistItems,
  generateRoadmapTaskGuidance,
  generateStartupRoadmap,
  generateSWOTAnalysis,
  processQuestion,
  getFailurePrediction,
} from "./lib/utils.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Endpoint to generate a startup roadmap
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const roadmapData = await generateStartupRoadmap(req.body);

    res.json({
      success: true,
      roadmap: roadmapData,
    });
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate roadmap",
      error: error.message,
    });
  }
});

// Endpoint to generate roadmap task details
app.post("/api/task-guidance", async (req, res) => {
  try {
    const { taskTitle, formData } = req.body;
    if (!taskTitle || !formData) {
      return res.status(400).json({
        success: false,
        message: "Task title and form data are required.",
      });
    }

    const taskGuidance = await generateRoadmapTaskGuidance(taskTitle, formData);
    res.json({ success: true, data: taskGuidance });
  } catch (error) {
    console.error("Task Guidance API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate task guidance",
      error: error.message,
    });
  }
});

app.post("/api/failure-prediction", async (req, res) => {
  try {
    const { businessIdea, industry, investment, targetMarket } = req.body;

    // Call the utility function to process failure prediction
    const result = await getFailurePrediction(
      businessIdea,
      industry,
      investment,
      targetMarket,
      model
    );

    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
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

//Endpoints for legal compliance checklist and checklist details

app.post("/api/checklist", async (req, res) => {
  const {
    country,
    region,
    industry,
    budget,
    teamSize,
    targetMarket,
    problemStatement,
    targetCustomer,
    uniqueValueProposition,
  } = req.body;

  if (!country || !region) {
    return res.status(400).json({ error: "Country and region are required" });
  }

  try {
    const items = await fetchLegalChecklistItems(
      country,
      region,
      industry,
      budget,
      teamSize,
      targetMarket,
      problemStatement,
      targetCustomer,
      uniqueValueProposition
    );
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/checklist/:itemId/details", async (req, res) => {
  const { itemId } = req.params;
  const {
    country,
    region,
    industry,
    budget,
    teamSize,
    targetMarket,
    problemStatement,
    targetCustomer,
    uniqueValueProposition,
  } = req.body;

  if (!country || !region) {
    return res.status(400).json({ error: "Country and region are required" });
  }

  try {
    const complianceData = await fetchLegalComplianceData(
      itemId,
      country,
      region,
      industry,
      budget,
      teamSize,
      targetMarket,
      problemStatement,
      targetCustomer,
      uniqueValueProposition
    );
    return res.json(complianceData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
