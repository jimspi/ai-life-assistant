import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeImageWithAI = async (imageBase64, userProfile) => {
  try {
    const prompt = createPersonalizedPrompt(userProfile);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and provide personalized insights based on my profile."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    return parseAIResponse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw new Error('Failed to analyze image');
  }
};

const createPersonalizedPrompt = (userProfile) => {
  return `You are a smart AI life assistant. Analyze images and provide personalized insights.

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Profession: ${userProfile.profession}
- Lifestyle: ${userProfile.lifestyle}
- Budget: ${userProfile.budget}
- Location: ${userProfile.location}
- Goals: ${userProfile.goals?.join(', ')}

Provide analysis in this JSON format:
{
  "category": "Category name",
  "name": "Specific item/situation name",
  "summary": "Brief summary tailored to user",
  "insights": ["3-4 personalized insights"],
  "actionItems": [
    {
      "text": "Specific action",
      "priority": "high|medium|low",
      "timeEstimate": "estimated time",
      "costBreakdown": "cost analysis",
      "whyRecommended": "personalized reasoning"
    }
  ],
  "suggestions": ["personalized suggestions"]
}

Focus on their ${userProfile.lifestyle} lifestyle, ${userProfile.budget} budget, and goals: ${userProfile.goals?.join(', ')}.`;
};

const parseAIResponse = (content) => {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      category: "General Analysis",
      name: "Image Analysis",
      summary: content.substring(0, 200),
      insights: [content],
      actionItems: [{
        text: "Review the analysis and consider next steps",
        priority: "medium",
        timeEstimate: "5 minutes",
        costBreakdown: "No cost",
        whyRecommended: "Based on AI analysis"
      }],
      suggestions: ["Consider uploading more specific images for better insights"]
    };
  } catch (error) {
    console.error('Parse error:', error);
    throw new Error('Failed to parse AI response');
  }
};

export default openai;
