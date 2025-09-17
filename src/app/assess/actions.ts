'use server';

import { z } from 'zod';
import { evaluateIELTSWriting, EvaluateIELTSWritingOutput } from '@/ai/flows/evaluate-ielts-writing';
import { transcribeImageToText } from '@/ai/flows/transcribe-image-to-text';

const formSchema = z.object({
  taskType: z.enum(['Task 1 (Academic)', 'Task 1 (General)', 'Task 2']),
  question: z.string().min(10),
  answer: z.string().min(50),
  questionImage: z.string().optional(),
  answerImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ActionResult = 
    | { success: true; data: EvaluateIELTSWritingOutput }
    | { success: false; error: string };

export async function assessWriting(data: FormValues): Promise<ActionResult> {
  try {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: 'Invalid form data.' };
    }

    let { taskType, question, answer, questionImage, answerImage } = validation.data;

    if (questionImage) {
        console.log('Transcribing question image...');
        const result = await transcribeImageToText({ photoDataUri: questionImage });
        question = result.transcription;
    }
    
    if (answerImage) {
        console.log('Transcribing answer image...');
        const result = await transcribeImageToText({ photoDataUri: answerImage });
        answer = result.transcription;
    }

    if (!question || question.length < 10) {
        return { success: false, error: 'Failed to get a valid question from text or image.' };
    }
    if (!answer || answer.length < 50) {
        return { success: false, error: 'Failed to get a valid answer from text or image. Ensure your writing is at least 50 characters long.' };
    }

    console.log('Evaluating IELTS writing...');
    const evaluationResult = await evaluateIELTSWriting({
      taskType,
      question,
      answer,
    });

    console.log('Evaluation complete.');
    return { success: true, data: evaluationResult };

  } catch (error) {
    console.error('An error occurred during assessment:', error);
    return { success: false, error: 'An unexpected error occurred on the server. Please try again.' };
  }
}
