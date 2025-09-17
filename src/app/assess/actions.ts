'use server';

import {transcribeImageToText} from '@/ai/flows/transcribe-image-to-text';
import {evaluateIELTSWriting} from '@/ai/flows/evaluate-ielts-writing';
import { z } from 'zod';
import { AssessmentResult } from '@/context/assessment-context';

const formSchema = z.object({
  taskType: z.enum(['Task 1 (Academic)', 'Task 1 (General)', 'Task 2']),
  question: z.string().min(10, { message: 'Question must be at least 10 characters long.' }),
  answer: z.string().min(50, { message: 'Answer must be at least 50 characters long.' }),
  questionImages: z.array(z.string()).optional(),
  answerImages: z.array(z.string()).optional(),
  candidateName: z.string().min(1, { message: 'Name is required.' }),
  candidateEmail: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

type ActionResult = 
    | { success: true; data: AssessmentResult }
    | { success: false; error: string };

export async function assessWriting(data: FormValues): Promise<ActionResult> {
  try {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(' ');
      return { success: false, error: `Invalid form data: ${errorMessages}` };
    }

    let { question, answer } = validation.data;

    // Transcribe images if they exist
    if (validation.data.questionImages && validation.data.questionImages.length > 0) {
      const transcriptionResult = await transcribeImageToText({ photoDataUris: validation.data.questionImages });
      question = transcriptionResult.transcription;
    }
    
    if (validation.data.answerImages && validation.data.answerImages.length > 0) {
      const transcriptionResult = await transcribeImageToText({ photoDataUris: validation.data.answerImages });
      answer = transcriptionResult.transcription;
    }

    // Call the evaluation flow
    const evaluationResult = await evaluateIELTSWriting({
      taskType: validation.data.taskType,
      question,
      answer,
      candidateName: validation.data.candidateName,
      candidateEmail: validation.data.candidateEmail,
    });

    const resultData: AssessmentResult = {
      candidate: {
        name: validation.data.candidateName,
        email: validation.data.candidateEmail,
      },
      task: {
        type: validation.data.taskType,
        question: question,
        word_count: answer.split(/\s+/).filter(Boolean).length,
      },
      assessment: {
        task_achievement_or_response: {
          band: evaluationResult.taskAchievementResponse.bandScore,
          justification: evaluationResult.taskAchievementResponse.justification,
          examples: {
            strengths: evaluationResult.taskAchievementResponse.strengths,
            weaknesses: evaluationResult.taskAchievementResponse.weaknesses,
          },
          improvements: evaluationResult.taskAchievementResponse.improvements,
        },
        coherence_and_cohesion: {
          band: evaluationResult.coherenceAndCohesion.bandScore,
          justification: evaluationResult.coherenceAndCohesion.justification,
          examples: {
            strengths: evaluationResult.coherenceAndCohesion.strengths,
            weaknesses: evaluationResult.coherenceAndCohesion.weaknesses,
          },
          improvements: evaluationResult.coherenceAndCohesion.improvements,
        },
        lexical_resource: {
          band: evaluationResult.lexicalResource.bandScore,
          justification: evaluationResult.lexicalResource.justification,
          examples: {
            strengths: evaluationResult.lexicalResource.strengths,
            weaknesses: evaluationResult.lexicalResource.weaknesses,
          },
          improvements: evaluationResult.lexicalResource.improvements,
        },
        grammatical_range_and_accuracy: {
          band: evaluationResult.grammaticalRangeAndAccuracy.bandScore,
          justification: evaluationResult.grammaticalRangeAndAccuracy.justification,
          examples: {
            strengths: evaluationResult.grammaticalRangeAndAccuracy.strengths,
            weaknesses: evaluationResult.grammaticalRangeAndAccuracy.weaknesses,
          },
          improvements: evaluationResult.grammaticalRangeAndAccuracy.improvements,
        },
        overall_band_score: evaluationResult.overallBandScore,
      },
      feedback: {
        overall_strengths: evaluationResult.overallStrengths,
        overall_weaknesses: evaluationResult.overallWeaknesses,
        key_recommendations: evaluationResult.keyRecommendations,
        summary: `This response exemplifies a solid performance, achieving an overall Band ${evaluationResult.overallBandScore}, which corresponds to CEFR level ${evaluationResult.cefrLevel}. Continue to build on the strengths and address the weaknesses to further improve your score.`
      },
      transcribedAnswer: answer,
      cefrLevel: evaluationResult.cefrLevel
    };

    return { success: true, data: resultData };

  } catch (error) {
    console.error('An error occurred during assessment:', error);
    let errorMessage = 'An unexpected error occurred on the server. Please try again.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
