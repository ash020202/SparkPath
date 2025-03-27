// Gemini API Integration for Legal Compliance Checklist
// This module handles fetching both checklist metadata and detailed compliance data

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
// Initialize the Gemini API client
const API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//checklist utils functions
async function fetchChecklistItems(country, region) {
  try {
    // Define the prompt for Gemini to get checklist metadata
    const prompt = `
      Generate a comprehensive legal and compliance checklist for startups in ${region}, ${country}.
      Include 10 essential items covering: that is must do for startups in ${region}, ${country}.
      
      Format the response as a JSON array with the following structure for each item:
      [
        {
          "id": "item-id-in-kebab-case",
          "title": "Human readable title",
          "description": "Brief description of what this requirement entails",
          "priority": "high/medium/low"
        },
        ...
      ]
      
      Ensure each description is concise but informative enough for entrepreneurs to understand the requirement.
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }

    const checklistItems = JSON.parse(jsonMatch[0]);
    return checklistItems;
  } catch (error) {
    console.error("Error fetching checklist items:", error);
    throw error;
  }
}

//Fetches detailed compliance data for a specific checklist item based on user's location

async function fetchComplianceData(checklistItemId, country, region) {
  try {
    // Define the prompt for Gemini based on checklist item and location
    const prompt = `
      Provide detailed compliance information for ${checklistItemId} in ${region}, ${country}.
      Format the response as a JSON object with the following structure:
      {
        "locationContent": {
          "${country}": {
            "${region}": {
              "what": "Clear explanation of what this requirement is",
              "why": "Importance and consequences of non-compliance",
              "how": ["Step 1", "Step 2", "Step 3", ...],
              "timeline": "Expected completion time",
              "cost": "Range of costs",
              "resources": [
                {"title": "Resource 1", "url": "https://example.com"},
                ...
              ],
              "documents": ["Document 1", "Document 2", ...]
            }
          }
        }
      }
      
      Ensure all information is accurate, up-to-date, and specific to ${region}, ${country}.
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }

    const complianceData = JSON.parse(jsonMatch[0]);

    // Validate the response has the expected structure
    if (!complianceData.locationContent?.[country]?.[region]) {
      throw new Error(`No data available for ${region}, ${country}`);
    }

    return complianceData;
  } catch (error) {
    console.error("Error fetching compliance data:", error);
    throw error;
  }
}

//* Merges basic checklist item with its detailed location-specific content

function mergeChecklistData(checklistItem, complianceData) {
  return {
    ...checklistItem,
    locationContent: complianceData.locationContent,
  };
}

// Store conversation history (in a real app, use a database)
export const conversations = {};

// Generate system instructions for the AI Mentor

function getSystemInstructions() {
  return `
    You are an AI Mentor specialized in providing guidance to startup founders and entrepreneurs.
    
    IMPORTANT RULES:
    1. Only provide information related to business, startups, entrepreneurship, and legal compliance.
    2. Do not discuss topics unrelated to business or startups.
    3. Keep responses concise, practical, and actionable.
    4. For legal questions, emphasize that you're providing general guidance and recommend consulting with legal professionals.
    5. Base your advice on established business practices and startup methodologies.
    6. If asked about something outside your expertise, politely redirect to business topics.
    7. Avoid political opinions, personal advice unrelated to business, or controversial topics.
    8. Focus on providing value to early-stage entrepreneurs with clear, actionable steps.
    
    RESPONSE FORMAT:
    - Keep responses under 250 words unless detailed explanation is specifically requested
    - Use bullet points for steps or lists
    - Highlight important points or warnings in bold
    - Include a short, actionable conclusion
  `;
}

//Create a prompt that includes system instructions and conversation history

function createPrompt(userMessage, history = []) {
  const systemInstructions = getSystemInstructions();

  let prompt = `${systemInstructions}\n\nConversation history:\n`;

  // Add conversation history
  history.forEach((msg) => {
    const role = msg.role === "user" ? "Human" : "AI Mentor";
    prompt += `${role}: ${msg.content}\n`;
  });

  // Add current user message
  prompt += `Human: ${userMessage}\n\nAI Mentor:`;

  return prompt;
}

// Process startup-related questions and provide mentorship

async function processQuestion(sessionId, message) {
  try {
    // Initialize conversation history if it doesn't exist
    if (!conversations[sessionId]) {
      conversations[sessionId] = [];
    }

    // Add user message to history
    conversations[sessionId].push({
      role: "user",
      content: message,
    });

    // Create prompt with system instructions and history
    const prompt = createPrompt(message, conversations[sessionId]);

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text();

    // Add AI response to history (limit history to last 10 messages to avoid context limits)
    conversations[sessionId].push({
      role: "assistant",
      content: aiMessage,
    });

    if (conversations[sessionId].length > 10) {
      conversations[sessionId] = conversations[sessionId].slice(-10);
    }

    // Generate suggested follow-up questions
    const followUps = await generateFollowUpQuestions(
      sessionId,
      aiMessage,
      message
    );

    return {
      message: aiMessage,
      followUpQuestions: followUps,
    };
  } catch (error) {
    console.error("Error processing question:", error);
    throw error;
  }
}

//Generate follow-up questions based on the conversation context

async function generateFollowUpQuestions(sessionId, aiResponse, userQuestion) {
  try {
    const followUpPrompt = `
      Based on this conversation about startups and business:
      
      User Question: ${userQuestion}
      
      AI Response: ${aiResponse}
      
      Generate exactly 3 short, specific follow-up questions that the user might want to ask next.
      These should be natural continuations of the conversation and strictly related to business and startups.
      
      Format your response as a JSON array of strings with no explanation:
      ["Question 1?", "Question 2?", "Question 3?"]
    `;

    const result = await model.generateContent(followUpPrompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return [
        "How do I find my first customers?",
        "What metrics should I focus on initially?",
        "How should I structure my founding team?",
      ];
    }

    const followUps = JSON.parse(jsonMatch[0]);
    return followUps.slice(0, 3); // Ensure we only return 3 questions
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    // Return default questions if there's an error
    return [
      "How do I find my first customers?",
      "What metrics should I focus on initially?",
      "How should I structure my founding team?",
    ];
  }
}

//--------------------------------------------------------------------------
//competitor analysis utils

// Assume this is added to your existing app.js file

// Generate a SWOT analysis based on startup profile data

async function generateSWOTAnalysis(startupData) {
  try {
    // 1. Enrich the data with industry benchmarks and statistics
    const enrichedData = await enrichWithIndustryData(startupData);

    // 2. Create a specialized prompt for the AI that focuses on concrete analysis
    const prompt = createSWOTPrompt(enrichedData);

    // 3. Generate the analysis using Gemini

    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysis = response.text();

    // 4. Extract structured SWOT data from the response
    const structuredAnalysis = parseAnalysisResponse(analysis);

    // 5. Add competitor insights
    const competitors = await identifyCompetitors(startupData);

    return {
      swot: structuredAnalysis,
      competitors: competitors,
      fullAnalysis: analysis,
    };
  } catch (error) {
    console.error("Error generating SWOT analysis:", error);
    throw error;
  }
}

/**
 * Enrich startup data with industry statistics and benchmarks
 * @param {Object} startupData - Basic startup profile
 * @returns {Promise<Object>} Enriched data with market insights
 */
async function enrichWithIndustryData(startupData) {
  // This would connect to real data sources in production
  // For MVP, you can use publicly available APIs or create a curated database

  try {
    // Example: Get industry growth rates from a market research API
    // Replace with your actual data source
    const industryStats = await fetchIndustryStats(startupData.industry);

    // Get region-specific business environment data
    const regionalData = await fetchRegionalData(
      startupData.country,
      startupData.region
    );

    // Get funding trends for similar startups
    const fundingTrends = await fetchFundingTrends(
      startupData.industry,
      startupData.stage
    );

    return {
      ...startupData,
      industryStats,
      regionalData,
      fundingTrends,
    };
  } catch (error) {
    console.error("Error enriching data:", error);
    // Fall back to basic data if enrichment fails
    return startupData;
  }
}

/**
 * Create a specialized prompt for SWOT analysis
 * @param {Object} enrichedData - Startup data with industry benchmarks
 * @returns {string} Detailed prompt for the AI
 */
function createSWOTPrompt(enrichedData) {
  return `
      You are an expert startup analyst with deep knowledge of the ${
        enrichedData.industry
      } industry.
      
      TASK: Generate a detailed, fact-based SWOT analysis for a startup with the following profile:
      
      STARTUP PROFILE:
      - Industry: ${enrichedData.industry}
      - Budget Range: ${enrichedData.budgetRange}
      - Team Size: ${enrichedData.teamSize}
      - Target Market: ${enrichedData.targetMarketSize}
      - Location: ${enrichedData.country}, ${enrichedData.region}
      - Problem Statement: ${enrichedData.problemStatement}
      - Target Customer: ${enrichedData.targetCustomer}
      - Unique Value Proposition: ${enrichedData.uniqueValueProposition}
      
      INDUSTRY CONTEXT:
      ${JSON.stringify(enrichedData.industryStats, null, 2)}
      
      REGIONAL BUSINESS ENVIRONMENT:
      ${JSON.stringify(enrichedData.regionalData, null, 2)}
      
      FUNDING LANDSCAPE:
      ${JSON.stringify(enrichedData.fundingTrends, null, 2)}
      
      IMPORTANT INSTRUCTIONS:
      1. Base your analysis ONLY on the provided data and verifiable industry facts
      2. Identify SPECIFIC strengths, weaknesses, opportunities and threats - not generic statements
      3. Reference actual market conditions, competitors and trends in ${
        enrichedData.industry
      }
      4. For each point, provide a brief explanation of its business impact
      5. Include quantitative metrics whenever possible
      6. Focus on actionable insights relevant to ${
        enrichedData.country
      } and specifically ${enrichedData.region}
      7. Include 5-7 points for each SWOT category, ordered by importance
      
      FORMAT YOUR RESPONSE AS JSON:
      {
        "strengths": [
          {"point": "Strength 1", "impact": "Business impact", "evidence": "Supporting evidence"},
          ...
        ],
        "weaknesses": [...],
        "opportunities": [...],
        "threats": [...]
      }
    `;
}

/**
 * Parse and structure the AI-generated SWOT analysis
 * @param {string} analysisText - Raw text from the AI
 * @returns {Object} Structured SWOT data
 */
function parseAnalysisResponse(analysisText) {
  try {
    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback parsing if JSON extraction fails
    const sections = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    };

    // Simple parsing logic - would be more robust in production
    let currentSection = null;

    analysisText.split("\n").forEach((line) => {
      if (line.toLowerCase().includes("strengths")) {
        currentSection = "strengths";
      } else if (line.toLowerCase().includes("weaknesses")) {
        currentSection = "weaknesses";
      } else if (line.toLowerCase().includes("opportunities")) {
        currentSection = "opportunities";
      } else if (line.toLowerCase().includes("threats")) {
        currentSection = "threats";
      } else if (currentSection && line.trim() && line.match(/^\d+\.|^\-|\*/)) {
        // Format bullet points into structured data
        const point = line.replace(/^\d+\.|\-|\*/, "").trim();
        if (point) {
          sections[currentSection].push({
            point: point,
            impact: "Impact analysis not available in non-JSON format",
            evidence: "Supporting data not available in non-JSON format",
          });
        }
      }
    });

    return sections;
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    throw new Error("Failed to parse SWOT analysis");
  }
}

/**
 * Identify relevant competitors based on startup profile
 * @param {Object} startupData - Startup profile information
 * @returns {Promise<Array>} List of competitors with comparison data
 */
async function identifyCompetitors(startupData) {
  try {
    // In production, this would connect to a competitor intelligence API
    // For MVP, you could build a curated database of competitors by industry

    // Substitute with your actual data source
    const competitorPrompt = `
        You are a competitive intelligence analyst specializing in the ${startupData.industry} industry.
        
        TASK: Identify 3-5 relevant competitors for a startup with this profile:
        - Problem solving: ${startupData.problemStatement}
        - Target customer: ${startupData.targetCustomer}
        - Value proposition: ${startupData.uniqueValueProposition}
        - Region: ${startupData.country}, ${startupData.region}
        
        For each competitor, provide:
        1. Company name (use REAL companies that actually exist)
        2. Brief description of their solution
        3. Key differentiators
        4. Strengths relative to this startup
        5. Weaknesses relative to this startup
        6. Approximate market share or size if available
        
        Format as JSON array:
        [
          {
            "name": "Competitor Name",
            "description": "What they do",
            "differentiators": ["diff1", "diff2"],
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "marketShare": "estimate or N/A"
          },
          ...
        ]
        
        IMPORTANT: Only include REAL companies that actually exist in this market.
        Verify that each competitor is active in ${startupData.country} or serves this market remotely.
      `;

    // Generate competitor analysis
    const result = await model.generateContent(competitorPrompt);
    const response = result.response;
    const competitorsText = response.text();

    // Extract and parse competitor data
    const jsonMatch = competitorsText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse competitor data");
    }

    let competitors = JSON.parse(jsonMatch[0]);

    // Optional: Verify competitors exist using a company data API
    competitors = await verifyCompetitorData(competitors);

    return competitors;
  } catch (error) {
    console.error("Error identifying competitors:", error);
    // Return empty array or default competitors as fallback
    return [];
  }
}

/**
 * Verify competitor data against a company database
 * @param {Array} competitors - List of potential competitors
 * @returns {Promise<Array>} Verified competitors with additional data
 */
async function verifyCompetitorData(competitors) {
  // In production, you would verify against Crunchbase, LinkedIn, etc.
  // For MVP, you can manually curate competitor data

  // This is a placeholder for the actual implementation
  return competitors.map((competitor) => {
    // Add a verification flag
    return {
      ...competitor,
      verified: true,
      lastUpdated: new Date().toISOString(),
    };
  });
}

// Sample placeholder functions for data fetching
// Replace with actual API integrations in production
async function fetchIndustryStats(industry) {
  // Placeholder - connect to real data source in production
  const industryData = {
    growthRate: "14.5%",
    averageFundingRound: "$2.1M",
    keyPlayers: ["Company A", "Company B", "Company C"],
    trendsToWatch: [
      "AI integration",
      "Subscription models",
      "Remote-first operations",
    ],
    challenges: [
      "Talent acquisition",
      "Regulatory changes",
      "Market saturation",
    ],
  };

  return industryData;
}

async function fetchRegionalData(country, region) {
  // Placeholder - connect to real data source in production
  // For India/Tamil Nadu example
  const regionalData = {
    techHubs: ["Chennai", "Coimbatore", "Madurai"],
    governmentInitiatives: ["Startup TN", "TANSTIA"],
    fundingAvailability: "Medium",
    talentPool: "Large technical talent pool, especially in IT/software",
    costOfOperation: "30% lower than Bangalore",
    regulatoryEnvironment: "Favorable with recent startup-friendly policies",
  };

  return regionalData;
}

async function fetchFundingTrends(industry, stage) {
  // Placeholder - connect to real data source in production
  const fundingData = {
    averagePreSeed: "$150K-$300K",
    averageSeed: "$1M-$2M",
    averageSeriesA: "$5M-$10M",
    activeInvestors: ["Investor A", "Investor B", "Investor C"],
    valuationMultiples: "5-7x ARR",
    burnRateAverage: "$50K-$100K/month",
  };

  return fundingData;
}

export {
  fetchChecklistItems,
  fetchComplianceData,
  mergeChecklistData,
  processQuestion,
  generateSWOTAnalysis,
};
