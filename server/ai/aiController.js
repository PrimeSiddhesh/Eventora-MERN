const { GoogleGenerativeAI } = require('@google/generative-ai');
const Event = require('../models/Event');

// Initialize Gemini Client
if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is missing in environment variables!');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate Event Description
exports.generateDescription = async (req, res) => {
    try {
        console.log('--- AI Description Generation Started ---');
        const { title, category } = req.body;
        
        if (!title) return res.status(400).json({ message: 'Event title is required for generation.' });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('❌ CRITICAL: GEMINI_API_KEY is missing in process.env');
            return res.status(500).json({ message: 'AI API Key not configured on server.' });
        }

        // Initialize fresh instance to ensure env var is picked up
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Act as an expert event planner and copywriter. Generate an engaging, professional, and convincing event description for an upcoming event titled: "${title}". 
        ${category ? `The category of the event is "${category}".` : ''}
        Keep it concise, between 3 to 5 sentences. Emphasize why someone would want to attend. Output only the description text.`;

        console.log('Sending prompt to Gemini (Model: gemini-1.5-flash)...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        if (!generatedText) {
            throw new Error('Gemini returned an empty response.');
        }

        console.log('✅ AI Response Success');
        res.status(200).json({ description: generatedText });

    } catch (error) {
        console.error('❌ AI GENERATION FAILED:', error);
        res.status(500).json({ 
            message: 'Failed to generate description via AI.', 
            error: error.message,
            tip: 'Check if your GEMINI_API_KEY is valid and has billing enabled (if required).'
        });
    }
};

// Handle Chatbot Queries
exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required.' });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ message: 'Chat service not configured.' });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Retrieve upcoming events to provide as context
        const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
            .select('title category date location ticketPrice availableSeats description')
            .sort({ date: 1 })
            .limit(10); 

        // Format events into a lightweight string for context
        const eventContext = upcomingEvents.map((e, index) => 
            `[${index + 1}] Title: ${e.title}
             Category: ${e.category}
             Date: ${e.date.toDateString()}
             Location: ${e.location}
             Price: ${e.ticketPrice === 0 ? 'Free' : '₹' + e.ticketPrice}
             Seats Left: ${e.availableSeats}`
        ).join('\n---\n');

        const systemInstruction = `You are a helpful and enthusiastic AI assistant for "Eventora", an event management platform. 
        Answer the user's questions about events, recommend events based on their queries, and be polite. 
        Only recommend events that exist in the context provided below. If they ask for something not in the list, politely inform them there are no matching upcoming events.
        
        Upcoming Events Context:
        ${eventContext || 'No upcoming events at the moment.'}`;

        const prompt = `${systemInstruction}\n\nUser Question: ${message}\nAssistant Answer:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error('Error in AI Chatbot:', error);
        res.status(500).json({ message: 'Failed to process chat query.', error: error.message });
    }
};
