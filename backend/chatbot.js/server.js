const express = require('express');
const cors = require('cors');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
// Import dotenv to load environment variables from a .env file
require('dotenv').config(); // Make sure to install dotenv: npm install dotenv

const app = express();
const port =  4000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3001',  // Match your frontend port
    credentials: true
  }));
app.use(express.json());
// Optional: Serve static files if you have a 'public' directory for HTML/CSS/JS
// app.use(express.static('public'));

// --- Security Improvement ---
// Load API key from environment variable instead of hardcoding
const apiKey = process.env.GEMINI_API_KEY;


if (!apiKey) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
  process.exit(1); // Exit if the API key is missing
}
// --- End Security Improvement ---

// Set up Gemini API
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Using gemini-1.5-flash as gemini-2.0-flash might not be available
});

// Generation config
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64, // Adjusted topK based on typical values for flash model
  maxOutputTokens: 8192,
  // responseMimeType: "text/plain", // Ensure this is supported or remove if not
};

// Safety Settings - Adjust as needed based on your use case
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];


// Store chat sessions for different users
const chatSessions = {};

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: "sessionId is required" });
    }
    if (!message) {
        return res.status(400).json({ error: "message is required" });
    }

    // Create a new chat session if one doesn't exist
    if (!chatSessions[sessionId]) {
      console.log(`Starting new chat session: ${sessionId}`);
      chatSessions[sessionId] = model.startChat({
        generationConfig,
        safetySettings, // Include safety settings
        history: [
          {
            role: "user",
            parts: [
              // This is the system prompt / initial instruction for the AI model
              {text: "Act as StockWise, a helpful AI assistant for the StockWise Inventory Management System. Your capabilities include: Explaining features (real-time tracking, multi-warehouse management, item movement history, role-based access, low-stock/expiry alerts, dashboards, analytics, CSV/PDF exports), guiding users on usage, defining inventory terms (SKU, FIFO, reorder level, stock valuation) and financial terms (COGS, gross margin, holding cost), explaining access control and bulk import/export, and suggesting inventory optimization based on item velocity. Provide clear, simple explanations. Avoid medical advice, emergency help, illegal/unethical guidance (like manipulating reports), sensitive/mental health topics, and unrelated questions. If a query is outside your scope or inappropriate, use one of these replies: 'I'm not qualified to answer that, but I suggest speaking to a professional.', 'If this is an emergency, please contact the appropriate services immediately.', or 'For sensitive issues, it’s best to consult with a licensed expert or authority.' For direct support beyond your capabilities, users can contact help at 1234567891. Keep responses concise and helpful."},
            ],
          },
           { // Add an initial response from the model to set the context
             role: "model",
             parts: [
               {text: "Hello! I'm StockWise, your AI assistant for inventory management. How can I help you optimize your stock or navigate the system today?"},
             ],
           },
        ]
      });

      // --- No need to send an initial "Hello" message here ---
      // The chat is initialized, the first actual user message will continue the conversation.
      // If you need a greeting immediately upon frontend load, the frontend should
      // call this API *without* a message or with a specific "init" message,
      // and the backend should handle returning the initial model greeting.
      // For simplicity now, we'll let the first user message start the exchange.
      // If the frontend *must* get a greeting first, it can send a specific first message like "Hello".
       if (message.toLowerCase() === 'hello') {
            // Respond immediately with the pre-defined greeting if the first message is "Hello"
            // This handles the initial greeting scenario from the React code example
            return res.json({ response: "Hello! I'm StockWise, your AI assistant for inventory management. How can I help you optimize your stock or navigate the system today?" });
       }
       // Otherwise, proceed to get response for the actual first message
    }

    // Send message to existing chat session
    console.log(`[${sessionId}] User: ${message}`);
    const chat = chatSessions[sessionId];
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    console.log(`[${sessionId}] Bot: ${responseText}`);

    res.json({ response: responseText });

  } catch (error) {
    console.error("Chat API Error:", error);
    // Provide a more structured error response
    res.status(500).json({
        error: "An error occurred while processing your chat request.",
        details: error.message || "Unknown error"
    });
  }
});

// Start the server
app.listen(port, () => {
  // Corrected console log message
  console.log(`StockWise chat server is running on port ${port}`);
  console.log(`Make sure the GEMINI_API_KEY environment variable is set.`);
});

// Export the app for testing
module.exports = app;