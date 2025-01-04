import fetch from 'node-fetch';

const apiKey = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
    // Ensure the method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract the message from the request body
    const { message } = req.body;

    // Validate the input
    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    // Validate API key
    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: API key missing.' });
    }

    try {
        console.log('Received message:', message);
        console.log('Sending request to OpenAI...');

        // Send the request to OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a thoughtful Republican voter." },
                    { role: "user", content: message }
                ]
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error('OpenAI API error:', data.error);
            return res.status(500).json({ error: data.error.message });
        }

        console.log('OpenAI response:', data);

        // Return the bot's response
        res.status(200).json({ botMessage: data.choices[0].message.content });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
