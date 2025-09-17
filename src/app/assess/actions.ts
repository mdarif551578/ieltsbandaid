'use server';

import { z } from 'zod';
import { AssessmentResult } from '@/context/assessment-context';

const API_URL = 'https://ielts-writing-ai-assessor.vercel.app/assess/';

// This schema is for client-side validation before sending to the backend
const formSchema = z.object({
  taskType: z.enum(['Task 1 (Academic)', 'Task 1 (General)', 'Task 2']),
  question: z.string().optional(),
  answer: z.string().optional(),
  questionImages: z.array(z.string()).optional(),
  answerImages: z.array(z.string()).optional(),
  candidateName: z.string().min(1, { message: 'Name is required.' }),
  candidateEmail: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

type ActionResult = 
    | { success: true; data: AssessmentResult }
    | { success: false; error: string };

// Helper to convert data URI to Blob
function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

export async function assessWriting(data: FormValues): Promise<ActionResult> {
  try {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(' ');
      return { success: false, error: `Invalid form data: ${errorMessages}` };
    }
    
    const formData = new FormData();
    formData.append('task_type', validation.data.taskType);
    formData.append('name', validation.data.candidateName);
    formData.append('email', validation.data.candidateEmail);
    
    // Handle question
    if (validation.data.question) {
        formData.append('question_text', validation.data.question);
    }
    if (validation.data.questionImages && validation.data.questionImages.length > 0) {
      validation.data.questionImages.forEach((uri, index) => {
        const blob = dataURItoBlob(uri);
        formData.append('question_images', blob, `question_image_${index}.png`);
      });
    }

    // Handle answer
    if (validation.data.answer) {
        formData.append('answer_text', validation.data.answer);
    }
     if (validation.data.answerImages && validation.data.answerImages.length > 0) {
      validation.data.answerImages.forEach((uri, index) => {
        const blob = dataURItoBlob(uri);
        formData.append('answer_images', blob, `answer_image_${index}.png`);
      });
    }

    // Make the API call to the FastAPI backend
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        const errorMessage = errorData?.detail || errorData?.error || `Request failed with status ${response.status}`;
        return { success: false, error: errorMessage };
    }
    
    const resultData: AssessmentResult = await response.json();
    
    // Check if the model returned an error within the JSON
    if ('error' in resultData) {
        // @ts-ignore
        return { success: false, error: resultData.error };
    }

    // Add word count and other frontend-specific data if not present
    if (!resultData.task) {
      resultData.task = {
        type: validation.data.taskType,
        question: validation.data.question || 'Image question',
        word_count: 0
      }
    }
    if (validation.data.answer) {
      resultData.task.word_count = validation.data.answer.split(/\s+/).filter(Boolean).length;
    }
    if (!resultData.candidate) {
      resultData.candidate = {
        name: validation.data.candidateName,
        email: validation.data.candidateEmail
      }
    }
    if(!resultData.transcribedAnswer) {
      resultData.transcribedAnswer = validation.data.answer || 'Image answer';
    }


    return { success: true, data: resultData };

  } catch (error) {
    console.error('An error occurred during assessment:', error);
    let errorMessage = 'An unexpected error occurred. Please check your connection and try again.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
