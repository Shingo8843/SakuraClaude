// Get Claude API configuration
exports.getClaudeConfig = () => {
  const apiKey = process.env.CLAUDE_API_KEY;
  const model = process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229';

  if (!apiKey) {
    throw new Error('Claude API key is not configured');
  }

  return {
    apiKey,
    model
  };
}; 