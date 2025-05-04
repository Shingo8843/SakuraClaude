const axios = require('axios');
require('dotenv').config();

class ClaudeService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.model = 'claude-3-7-sonnet-20250219';
    this.baseURL = 'https://api.anthropic.com/v1';
    
    // Check if API key is configured
    this.isConfigured = !!this.apiKey && this.apiKey !== 'your_claude_api_key_here';
    
    if (this.isConfigured) {
      this.client = axios.create({
        baseURL: this.baseURL,
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      });
    }
  }

  async generatePost(userProfile) {
    try {
      if (!this.isConfigured) {
        // Return mock response for testing
        const topics = {
          Technology: ['AI', 'blockchain', 'cloud computing', 'cybersecurity', '5G'],
          Gaming: ['esports', 'indie games', 'game development', 'virtual reality', 'streaming'],
          Science: ['space exploration', 'quantum computing', 'renewable energy', 'biotech', 'neuroscience'],
          Art: ['digital art', 'NFTs', 'creative process', 'art history', 'design trends']
        };

        const topic = topics[userProfile.interest] || topics.Technology;
        const randomTopic = topic[Math.floor(Math.random() * topic.length)];
        
        const tones = {
          Friendly: ['Hey everyone!', 'Just wanted to share', 'What do you all think about', 'Really excited about', 'Love discussing'],
          Professional: ['Interesting development in', 'Recent trends show', 'Analysis of', 'Key insights about', 'Important update on'],
          Casual: ['Check this out:', 'Been thinking about', 'Random thoughts on', 'Anyone else into', 'Cool stuff about'],
          Enthusiastic: ['Amazing news about', 'Can\'t believe the progress in', 'Incredible developments in', 'Mind-blowing updates on', 'Fantastic breakthroughs in']
        };

        const tone = tones[userProfile.tone] || tones.Friendly;
        const randomTone = tone[Math.floor(Math.random() * tone.length)];

        return `${randomTone} ${randomTopic}! As someone deeply interested in ${userProfile.interest}, I find the latest developments fascinating. Would love to hear your thoughts! #${userProfile.interest} #${randomTopic.replace(/\s+/g, '')}`;
      }

      const prompt = `You are ${userProfile.userName}, a user with the following characteristics:
      - Post frequency: ${userProfile.postFrequency} (0-10 scale)
      - Reply rate: ${userProfile.replyRate}%
      - Reply speed: ${userProfile.replySpeed} (0-10 scale)
      - Interest: ${userProfile.interest}
      - Tone: ${userProfile.tone}
      - Time zone: ${userProfile.timeZone}
      
      Generate a social media post that reflects these characteristics. The post should be engaging and reflect the user's personality.
      Include relevant hashtags based on the user's interests.
      The post should be appropriate for the current time of day in the user's timezone.
      
      Respond with only the post content, nothing else.`;

      console.log('Sending post generation request to Claude API...');
      const response = await this.client.post('/messages', {
        model: this.model,
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      console.log('Claude API Response:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.content && response.data.content[0] && response.data.content[0].text) {
        return response.data.content[0].text.trim();
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format from Claude API');
      }
    } catch (error) {
      console.error('Error generating post:', error.response ? error.response.data : error);
      throw new Error('Failed to generate post');
    }
  }

  async generateReply(userProfile, originalPost, context = []) {
    try {
      if (!this.isConfigured) {
        // Return mock response for testing
        if (userProfile.replyRate === 0) {
          return null;
        }

        const tones = {
          Friendly: [
            'Thanks for sharing! I really appreciate your perspective on',
            'Great point! I\'ve also been thinking about',
            'That\'s such an interesting take on',
            'Love how you explained',
            'Really resonates with my thoughts on'
          ],
          Professional: [
            'Your analysis raises some interesting points about',
            'Building on your insights regarding',
            'This aligns with recent developments in',
            'From a technical perspective,',
            'The data suggests that'
          ],
          Casual: [
            'Yeah, totally get what you mean about',
            'Been there! Especially when it comes to',
            'Right? And what\'s even cooler is',
            'Haha, so true about',
            'Same here! Especially with'
          ],
          Enthusiastic: [
            'Absolutely amazing point about',
            'Wow! Never thought about it that way regarding',
            'This is exactly what makes',
            'Incredible insights into',
            'You\'re so right about'
          ]
        };

        const tone = tones[userProfile.tone] || tones.Friendly;
        const randomTone = tone[Math.floor(Math.random() * tone.length)];

        const topic = originalPost.split(' ').find(word => 
          word.toLowerCase().includes(userProfile.interest.toLowerCase())
        ) || userProfile.interest;

        return `${randomTone} ${topic}! From my experience in ${userProfile.interest}, I've noticed similar patterns. Let's explore this further! #${userProfile.interest} #Engagement`;
      }

      // If the agent has a 0% reply rate, they should not reply
      if (userProfile.replyRate === 0) {
        return null;
      }

      const contextString = context.length > 0 
        ? `Previous conversation context:\n${context.map(c => `${c.userName}: ${c.content}`).join('\n')}\n\n`
        : '';

      const prompt = `You are ${userProfile.userName}, a user with the following characteristics:
      - Reply rate: ${userProfile.replyRate}%
      - Reply speed: ${userProfile.replySpeed} (0-10 scale)
      - Interest: ${userProfile.interest}
      - Tone: ${userProfile.tone}
      
      ${contextString}
      Generate a reply to the following post that reflects these characteristics:
      "${originalPost}"
      
      The reply should be engaging and maintain your persona's tone and interests.
      Consider the conversation context if provided.
      Include relevant hashtags if appropriate.
      
      Respond with only the reply content, nothing else.`;

      console.log('Sending reply generation request to Claude API...');
      const response = await this.client.post('/messages', {
        model: this.model,
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      console.log('Claude API Response:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.content && response.data.content[0] && response.data.content[0].text) {
        return response.data.content[0].text.trim();
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format from Claude API');
      }
    } catch (error) {
      console.error('Error generating reply:', error.response ? error.response.data : error);
      throw new Error('Failed to generate reply');
    }
  }

  async analyzeGuess(userGuess, actualProfile) {
    try {
      if (!this.isConfigured) {
        // Return mock response for testing
        return {
          accuracy: 75,
          points: 80,
          feedback: {
            correct: ["Identified the main interest correctly", "Tone analysis was close"],
            incorrect: ["Missed the posting frequency pattern", "Reply speed was higher than guessed"]
          }
        };
      }

      const prompt = `Compare the following user guess with the actual AI agent profile:

      User's Guess:
      ${JSON.stringify(userGuess, null, 2)}

      Actual Profile:
      ${JSON.stringify(actualProfile, null, 2)}

      Calculate:
      1. Accuracy percentage (how close the guess matches the actual profile)
      2. Points earned (0-100 based on accuracy)
      3. Specific feedback on what they got right and wrong
      4. Suggestions for improvement

      Return the response in JSON format with these fields.`;

      console.log('Sending guess analysis request to Claude API...');
      const response = await this.client.post('/messages', {
        model: this.model,
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      console.log('Claude API Response:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.content && response.data.content[0] && response.data.content[0].text) {
        return JSON.parse(response.data.content[0].text);
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format from Claude API');
      }
    } catch (error) {
      console.error('Error analyzing guess:', error.response ? error.response.data : error);
      throw new Error('Failed to analyze guess');
    }
  }

  async generateAgentBehavior(agentProfile, context) {
    try {
      if (!this.isConfigured) {
        // Return mock response for testing
        const now = Date.now();
        const oneHour = 3600000;
        const randomDelay = Math.floor(Math.random() * oneHour * 2); // 0-2 hours

        const actions = ['post', 'reply', 'interact'];
        const weights = [
          agentProfile.postFrequency,
          agentProfile.replyRate / 10,
          (agentProfile.postFrequency + agentProfile.replyRate/10) / 2
        ];
        
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        let action = actions[0];
        for (let i = 0; i < weights.length; i++) {
          if (random < weights[i]) {
            action = actions[i];
            break;
          }
          random -= weights[i];
        }

        const topics = {
          Technology: ['AI advancements', 'blockchain innovations', 'cloud computing trends', 'cybersecurity challenges', '5G implementation'],
          Gaming: ['esports tournaments', 'indie game releases', 'game development tools', 'VR experiences', 'streaming platforms'],
          Science: ['space missions', 'quantum breakthroughs', 'renewable energy solutions', 'biotech innovations', 'neuroscience discoveries'],
          Art: ['digital art trends', 'NFT markets', 'creative workflows', 'art movements', 'design principles']
        };

        const topic = topics[agentProfile.interest] || topics.Technology;
        const randomTopic = topic[Math.floor(Math.random() * topic.length)];

        return {
          action,
          timing: now + randomDelay,
          content: `Excited to discuss ${randomTopic}! What are your thoughts on the latest developments? #${agentProfile.interest} #Innovation`,
          target: context.recentPosts.length > 0 ? context.recentPosts[0]._id : null
        };
      }

      const prompt = `You are an AI agent with the following profile:
      ${JSON.stringify(agentProfile, null, 2)}

      Current context:
      ${JSON.stringify(context, null, 2)}

      Determine the next action for this agent. You must respond with a valid JSON object containing:
      - action: either 'post', 'reply', or 'interact'
      - timing: a timestamp for when to perform the action (in milliseconds since epoch)
      - content: the content to post/reply (if applicable)
      - target: the post/agent to interact with (if applicable)

      Example response format:
      {
        "action": "post",
        "timing": 1714767000000,
        "content": "Hello everyone! Just checking in with my thoughts on technology today.",
        "target": null
      }

      Make sure your response is a valid JSON object and nothing else.`;

      console.log('Sending agent behavior request to Claude API...');
      const response = await this.client.post('/messages', {
        model: this.model,
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      console.log('Claude API Response:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.content && response.data.content[0] && response.data.content[0].text) {
        const text = response.data.content[0].text.trim();
        // Remove any markdown code block markers if present
        const jsonStr = text.replace(/```json\n|\n```/g, '');
        return JSON.parse(jsonStr);
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format from Claude API');
      }
    } catch (error) {
      console.error('Error generating agent behavior:', error.response ? error.response.data : error);
      throw new Error('Failed to generate agent behavior');
    }
  }
}

module.exports = new ClaudeService(); 