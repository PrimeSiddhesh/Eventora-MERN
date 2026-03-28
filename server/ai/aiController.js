const { GoogleGenAI } = require('@google/genai');
const Event = require('../models/Event');

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generate Event Description
exports.generateDescription = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title) return res.status(400).json({ message: 'Event title is required for generation.' });

        const prompt = `Act as an expert event planner and copywriter. Generate an engaging, professional, and convincing event description for an upcoming event titled: "${title}". 
        ${category ? `The category of the event is "${category}".` : ''}
        Keep it concise, between 3 to 5 sentences. Emphasize why someone would want to attend. Output only the description text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        const generatedText = response.text;
        res.status(200).json({ description: generatedText });

    } catch (error) {
        console.error('Error in generated description:', error);
        res.status(500).json({ message: 'Failed to generate description via AI.', error: error.message });
    }
};

// Handle Chatbot Queries
exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required.' });

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

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        res.status(200).json({ reply: response.text });

    } catch (error) {
        console.error('Error in AI Chatbot:', error);
        res.status(500).json({ message: 'Failed to process chat query.', error: error.message });
    }
};
