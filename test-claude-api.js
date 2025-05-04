const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.CLAUDE_API_KEY;
const MODEL = 'claude-3-7-sonnet-20250219';

async function testClaudeAPI() {
    try {
        console.log('Testing Claude API...');
        console.log('Using model:', MODEL);

        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: MODEL,
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: 'Hello, this is a test message. Please respond with a simple greeting.'
            }]
        }, {
            headers: {
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            }
        });

        console.log('API Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error testing Claude API:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else {
            console.error(error.message);
        }
    }
}

testClaudeAPI(); 