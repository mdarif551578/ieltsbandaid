'use server';

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

const MOCK_EVALUATION_DATA: AssessmentResult = {
  overallBandScore: 7.5,
  cefrLevel: 'C1',
  taskAchievementResponse: {
    bandScore: 7.0,
    justification: "The response addresses all parts of the task and presents a clear position throughout. The main ideas are relevant and well-supported with examples.",
    strengths: ["Effectively addresses all parts of the prompt.", "Presents a clear and consistent argument."],
    weaknesses: ["Some supporting details could be further developed.", "The conclusion could be slightly stronger."],
    improvements: ["Expand on your examples with more specific details.", "Consider rephrasing the conclusion to be more impactful."],
  },
  coherenceAndCohesion: {
    bandScore: 8.0,
    justification: "The essay is well-organized with clear paragraphing. Cohesive devices are used effectively and appropriately, and there is a clear overall progression.",
    strengths: ["Logical paragraphing, with each paragraph having a clear central topic.", "Good use of a range of cohesive devices (e.g., 'Furthermore,' 'In contrast')."],
    weaknesses: ["Occasionally, sentence-level linking could be smoother."],
    improvements: ["Vary your sentence starters to improve flow.", "Review the use of pronouns to ensure clear referencing."],
  },
  lexicalResource: {
    bandScore: 7.5,
    justification: "The candidate uses a wide range of vocabulary with some sophistication. There are occasional errors in word choice, but meaning is rarely obscured.",
    strengths: ["Uses less common vocabulary accurately (e.g., 'ubiquitous', 'detrimental').", "Shows good awareness of collocation."],
    weaknesses: ["Minor errors in word formation (e.g., 'benefitial' instead of 'beneficial').", "Slightly repetitive use of some vocabulary."],
    improvements: ["Use a thesaurus to find synonyms for commonly used words.", "Proofread for errors in word form after writing."],
  },
  grammaticalRangeAndAccuracy: {
    bandScore: 7.0,
    justification: "A variety of complex structures are used with reasonable accuracy. While there are some grammatical errors, they do not impede communication.",
    strengths: ["Uses a mix of simple and complex sentence structures.", "Good control of verb tenses."],
    weaknesses: ["Some errors with articles (a/an/the).", "Occasional mistakes in subject-verb agreement."],
    improvements: ["Review the rules for definite and indefinite articles.", "Pay close attention to subject-verb agreement in complex sentences."],
  },
  overallStrengths: ["Clear structure and logical flow.", "Strong vocabulary range.", "Good use of complex sentences."],
  overallWeaknesses: ["Minor but noticeable grammatical errors.", "Supporting details could be more developed."],
  keyRecommendations: ["Focus on proofreading for grammatical accuracy, especially articles and subject-verb agreement.", "Practice expanding on main ideas with more detailed examples.", "Strengthen your conclusions to leave a lasting impression."],
  transcribedAnswer: "This is a placeholder for the transcribed answer. The actual answer provided by the user will be shown here. This allows us to simulate how the final report will look, including the formatting of the text and the word count calculation.",
  question: "This is a placeholder for the question. The actual question provided by the user will appear here."
};

export async function assessWriting(data: FormValues): Promise<ActionResult> {
  try {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(' ');
      return { success: false, error: `Invalid form data: ${errorMessages}` };
    }

    let { question, answer } = validation.data;

    if (validation.data.questionImages && validation.data.questionImages.length > 0) {
        question = "Placeholder for transcribed question from images.";
    }
    
    if (validation.data.answerImages && validation.data.answerImages.length > 0) {
        answer = "Placeholder for transcribed answer from images. This demonstrates that the image upload was successful and would be processed by the backend AI in a real scenario. The text is long enough to pass the minimum character validation.";
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const resultData = {
      ...MOCK_EVALUATION_DATA,
      question: question,
      transcribedAnswer: answer,
      taskType: validation.data.taskType,
    };

    return { success: true, data: resultData };

  } catch (error) {
    console.error('An error occurred during assessment:', error);
    return { success: false, error: 'An unexpected error occurred on the server. Please try again.' };
  }
}
