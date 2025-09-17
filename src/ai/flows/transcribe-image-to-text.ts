// The AI agent to transcribe images of handwritten responses or questions to text for assessment.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeImageToTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a handwritten response or question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeImageToTextInput = z.infer<typeof TranscribeImageToTextInputSchema>;

const TranscribeImageToTextOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the image.'),
});
export type TranscribeImageToTextOutput = z.infer<typeof TranscribeImageToTextOutputSchema>;

export async function transcribeImageToText(
  input: TranscribeImageToTextInput
): Promise<TranscribeImageToTextOutput> {
  return transcribeImageToTextFlow(input);
}

const transcribeImageToTextPrompt = ai.definePrompt({
  name: 'transcribeImageToTextPrompt',
  input: {schema: TranscribeImageToTextInputSchema},
  output: {schema: TranscribeImageToTextOutputSchema},
  prompt: `You are an AI that transcribes images to text. Extract the text in the image provided.

Image: {{media url=photoDataUri}}`,
});

const transcribeImageToTextFlow = ai.defineFlow(
  {
    name: 'transcribeImageToTextFlow',
    inputSchema: TranscribeImageToTextInputSchema,
    outputSchema: TranscribeImageToTextOutputSchema,
  },
  async input => {
    const {output} = await transcribeImageToTextPrompt(input);
    return output!;
  }
);
