import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOpenAI({
  model: 'gpt-4',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function enhanceDescription(description: string): Promise<string> {
  try {
    const parser = new StringOutputParser();

    const messages = [
      new SystemMessage(`Enhance the following description`),
      new HumanMessage(description),
    ];
    const output = await model.invoke(messages);
    return parser.invoke(output);
  } catch (error) {
    console.warn(error);
    throw error;
  }
}
