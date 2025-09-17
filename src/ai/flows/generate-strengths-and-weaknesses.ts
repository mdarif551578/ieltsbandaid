'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying and listing the strengths and weaknesses in an IELTS writing text.
 *
 * - generateStrengthsAndWeaknesses - A function that handles the generation of strengths and weaknesses.
 * - GenerateStrengthsAndWeaknessesInput - The input type for the generateStrengthsAndWeaknesses function.
 * - GenerateStrengthsAndWeaknessesOutput - The return type for the generateStrengthsAndWeaknesses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrengthsAndWeaknessesInputSchema = z.object({
  text: z
    .string()
    .describe('The IELTS writing text to analyze.'),
});
export type GenerateStrengthsAndWeaknessesInput = z.infer<typeof GenerateStrengthsAndWeaknessesInputSchema>;

const GenerateStrengthsAndWeaknessesOutputSchema = z.object({
  strengths: z.array(z.string()).describe('A list of the strengths identified in the text, with specific examples.'),
  weaknesses: z.array(z.string()).describe('A list of the weaknesses identified in the text, with specific examples.'),
});
export type GenerateStrengthsAndWeaknessesOutput = z.infer<typeof GenerateStrengthsAndWeaknessesOutputSchema>;

export async function generateStrengthsAndWeaknesses(input: GenerateStrengthsAndWeaknessesInput): Promise<GenerateStrengthsAndWeaknessesOutput> {
  return generateStrengthsAndWeaknessesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrengthsAndWeaknessesPrompt',
  input: {schema: GenerateStrengthsAndWeaknessesInputSchema},
  output: {schema: GenerateStrengthsAndWeaknessesOutputSchema},
  prompt: `You are an expert IELTS writing assessor. Analyze the following text and identify the key strengths and weaknesses, providing specific examples from the text for each point.\n\nText: {{{text}}}`,
});

const generateStrengthsAndWeaknessesFlow = ai.defineFlow(
  {
    name: 'generateStrengthsAndWeaknessesFlow',
    inputSchema: GenerateStrengthsAndWeaknessesInputSchema,
    outputSchema: GenerateStrengthsAndWeaknessesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
