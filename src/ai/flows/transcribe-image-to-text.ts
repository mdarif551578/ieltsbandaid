// The AI agent to transcribe images of handwritten responses or questions to text for assessment.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeImageToTextInputSchema = z.object({
  photoDataUris: z
    .array(z.string())
    .describe(
      "Photos of a handwritten response or question, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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
  prompt: `You are an AI that transcribes images to text. Extract the text in the images provided. Combine the text from all images into a single response.

{{#each photoDataUris}}
Image: {{media url=this}}
{{/each}}
`,
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
