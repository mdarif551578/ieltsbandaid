// src/ai/flows/evaluate-ielts-writing.ts
'use server';

/**
 * @fileOverview Evaluates IELTS writing tasks based on official criteria.
 *
 * - evaluateIELTSWriting - A function that evaluates IELTS writing tasks.
 * - EvaluateIELTSWritingInput - The input type for the evaluateIELTSWriting function.
 * - EvaluateIELTSWritingOutput - The return type for the evaluateIELTSWriting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateIELTSWritingInputSchema = z.object({
  taskType: z.enum(['Task 1 (Academic)', 'Task 1 (General)', 'Task 2']).describe('The type of IELTS writing task.'),
  question: z.string().describe('The IELTS writing task question.'),
  answer: z.string().describe('The candidate\'s answer to the IELTS writing task.'),
  candidateName: z.string().optional().describe('The name of the candidate (optional).'),
  candidateEmail: z.string().email().optional().describe('The email of the candidate (optional).'),
});

export type EvaluateIELTSWritingInput = z.infer<typeof EvaluateIELTSWritingInputSchema>;

const EvaluateIELTSWritingOutputSchema = z.object({
  overallBandScore: z.number().describe('The overall band score for the writing task.'),
  cefrLevel: z.string().describe('The Common European Framework of Reference (CEFR) level corresponding to the band score.'),
  taskAchievementResponse: z.object({
    bandScore: z.number().describe('The band score for Task Achievement/Response.'),
    justification: z.string().describe('Justification for the Task Achievement/Response band score.'),
    strengths: z.array(z.string()).describe('Strengths in Task Achievement/Response.'),
    weaknesses: z.array(z.string()).describe('Weaknesses in Task Achievement/Response.'),
    improvements: z.array(z.string()).describe('Suggestions for improvement in Task Achievement/Response.'),
  }).describe('Evaluation of Task Achievement/Response.'),
  coherenceAndCohesion: z.object({
    bandScore: z.number().describe('The band score for Coherence and Cohesion.'),
    justification: z.string().describe('Justification for the Coherence and Cohesion band score.'),
    strengths: z.array(z.string()).describe('Strengths in Coherence and Cohesion.'),
    weaknesses: z.array(z.string()).describe('Weaknesses in Coherence and Cohesion.'),
    improvements: z.array(z.string()).describe('Suggestions for improvement in Coherence and Cohesion.'),
  }).describe('Evaluation of Coherence and Cohesion.'),
  lexicalResource: z.object({
    bandScore: z.number().describe('The band score for Lexical Resource.'),
    justification: z.string().describe('Justification for the Lexical Resource band score.'),
    strengths: z.array(z.string()).describe('Strengths in Lexical Resource.'),
    weaknesses: z.array(z.string()).describe('Weaknesses in Lexical Resource.'),
    improvements: z.array(z.string()).describe('Suggestions for improvement in Lexical Resource.'),
  }).describe('Evaluation of Lexical Resource.'),
  grammaticalRangeAndAccuracy: z.object({
    bandScore: z.number().describe('The band score for Grammatical Range and Accuracy.'),
    justification: z.string().describe('Justification for the Grammatical Range and Accuracy band score.'),
    strengths: z.array(z.string()).describe('Strengths in Grammatical Range and Accuracy.'),
    weaknesses: z.array(z.string()).describe('Weaknesses in Grammatical Range and Accuracy.'),
    improvements: z.array(z.string()).describe('Suggestions for improvement in Grammatical Range and Accuracy.'),
  }).describe('Evaluation of Grammatical Range and Accuracy.'),
  overallStrengths: z.array(z.string()).describe('Overall strengths of the writing task.'),
  overallWeaknesses: z.array(z.string()).describe('Overall weaknesses of the writing task.'),
  keyRecommendations: z.array(z.string()).describe('Key recommendations for improvement.'),
  transcribedAnswer: z.string().describe('The transcribed version of the answer.'),
});

export type EvaluateIELTSWritingOutput = z.infer<typeof EvaluateIELTSWritingOutputSchema>;

export async function evaluateIELTSWriting(input: EvaluateIELTSWritingInput): Promise<EvaluateIELTSWritingOutput> {
  return evaluateIELTSWritingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateIELTSWritingPrompt',
  input: {schema: EvaluateIELTSWritingInputSchema},
  output: {schema: EvaluateIELTSWritingOutputSchema},
  prompt: `You are an IELTS writing examiner. Evaluate the following IELTS writing task submission based on the official IELTS criteria: Task Achievement/Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Provide detailed feedback and suggest areas of improvement.

Task Type: {{{taskType}}}
Question: {{{question}}}
Answer: {{{answer}}}
Candidate Name: {{{candidateName}}}
Candidate Email: {{{candidateEmail}}}

Respond in a JSON format.
`,
});

const evaluateIELTSWritingFlow = ai.defineFlow(
  {
    name: 'evaluateIELTSWritingFlow',
    inputSchema: EvaluateIELTSWritingInputSchema,
    outputSchema: EvaluateIELTSWritingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
