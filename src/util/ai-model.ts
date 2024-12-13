import { VertexAI } from '@google-cloud/vertexai';

const project = process.env.GCP_PROJECT;
const location = process.env.GCP_LOCATION;
const model = process.env.GCP_MODEL;

const vertextAi = new VertexAI({
  project: project,
  location: location,
});

const generativeModel = vertextAi.getGenerativeModel({
  model,
  //   generationConfig: { maxOutputTokens: 100 },
  systemInstruction: {
    role: 'instructor',
    parts: [{ text: 'You have to act like an instructor and help the students with their queries' }],
  },
});

export const PromptAI = async (prompt: string): Promise<string> => {
  const response = await generativeModel.generateContent(prompt);

  console.log(response.response.candidates[0].content.parts[0].text);
  return response.response.candidates[0].content.parts[0].text;
};
