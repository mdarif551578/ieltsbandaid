'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssessment } from '@/context/assessment-context';
import { useRouter } from 'next/navigation';
import { useTransition, useState, useId } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, X } from 'lucide-react';
import Image from 'next/image';
import type { AssessmentResult } from '@/context/assessment-context';

const API_URL = 'https://ielts-writing-ai-assessor.vercel.app/assess/';

const formSchema = z.object({
  taskType: z.enum(['Task 1 (Academic)', 'Task 1 (General)', 'Task 2'], {
    required_error: 'You need to select a task type.',
  }),
  question: z.string().optional(),
  answer: z.string().optional(),
  questionImages: z.array(z.string()).optional(),
  answerImages: z.array(z.string()).optional(),
  candidateName: z.string().min(1, 'Name is required.'),
  candidateEmail: z.string().email({ message: "Invalid email address." }),
  questionInputType: z.enum(['text', 'image']),
  answerInputType: z.enum(['text', 'image']),
}).superRefine((data, ctx) => {
    if (data.questionInputType === 'text' && (!data.question || data.question.trim().length < 10)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['question'],
            message: 'Question must be at least 10 characters.',
        });
    } else if (data.questionInputType === 'image' && (!data.questionImages || data.questionImages.length === 0)) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['questionImages'],
            message: 'Please upload at least one question image.',
        });
    }

    if (data.answerInputType === 'text' && (!data.answer || data.answer.trim().length < 50)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['answer'],
            message: 'Answer must be at least 50 words to be properly evaluated.',
        });
    } else if (data.answerInputType === 'image' && (!data.answerImages || data.answerImages.length === 0)) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['answerImages'],
            message: 'Please upload at least one answer image.',
        });
    }
});

type FormValues = z.infer<typeof formSchema>;


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


export default function AssessmentForm() {
  const { dispatch } = useAssessment();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [questionInputType, setQuestionInputType] = useState<'text' | 'image'>('text');
  const [answerInputType, setAnswerInputType] = useState<'text' | 'image'>('text');
  
  const [questionPreviews, setQuestionPreviews] = useState<string[]>([]);
  const [answerPreviews, setAnswerPreviews] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskType: 'Task 2',
      question: '',
      answer: '',
      candidateName: '',
      candidateEmail: '',
      questionImages: [],
      answerImages: [],
      questionInputType: 'text',
      answerInputType: 'text',
    },
    mode: 'onBlur'
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'questionImages' | 'answerImages',
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const files = e.target.files;
    if (!files) return;

    const currentValues = form.getValues(fieldName) || [];
    const newValues: string[] = [...currentValues];
    const newPreviews: string[] = fieldName === 'questionImages' ? [...questionPreviews] : [...answerPreviews];

    const filePromises = Array.from(files).map(file => {
      return new Promise<void>((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit per file
          form.setError(fieldName, { message: 'File must be less than 5MB.' });
          reject(new Error('File size exceeded'));
          return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const base64 = loadEvent.target?.result as string;
          newValues.push(base64);
          newPreviews.push(base64);
          resolve();
        };
        reader.onerror = () => {
          form.setError(fieldName, { message: 'Failed to read file.' });
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(() => {
        if (fieldName === 'questionImages') {
            setQuestionPreviews(newPreviews);
        } else {
            setAnswerPreviews(newPreviews);
        }
        form.setValue(fieldName, newValues, { shouldValidate: true });
    }).catch(error => {
        console.error(error);
    });
  };

  const removeImage = (
    index: number,
    fieldName: 'questionImages' | 'answerImages',
    previews: string[],
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newValues = (form.getValues(fieldName) || []).filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setPreviews(newPreviews);
    form.setValue(fieldName, newValues, { shouldValidate: true });
  };
  

  async function onSubmit(data: FormValues) {
    startTransition(async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const formData = new FormData();
      formData.append('task_type', data.taskType);
      formData.append('name', data.candidateName);
      formData.append('email', data.candidateEmail);
      
      if (data.questionInputType === 'text' && data.question) {
          formData.append('question_text', data.question);
      } else if (data.questionInputType === 'image' && data.questionImages) {
        data.questionImages.forEach((uri, index) => {
          const blob = dataURItoBlob(uri);
          formData.append('question_images', blob, `question_image_${index}.png`);
        });
      }

      if (data.answerInputType === 'text' && data.answer) {
          formData.append('answer_text', data.answer);
      } else if (data.answerInputType === 'image' && data.answerImages) {
        data.answerImages.forEach((uri, index) => {
          const blob = dataURItoBlob(uri);
          formData.append('answer_images', blob, `answer_image_${index}.png`);
        });
      }

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            const errorMessage = errorData?.detail || errorData?.error || `Request failed with status ${response.status}`;
            throw new Error(errorMessage);
        }

        const resultData: AssessmentResult = await response.json();

        if ('error' in resultData) {
            // @ts-ignore
            throw new Error(resultData.error);
        }
        
        const finalResult = { ...resultData };

        if (!finalResult.task) {
          finalResult.task = { type: data.taskType, question: '', word_count: 0 };
        }
        if (data.questionInputType === 'text' && data.question) {
          finalResult.task.question = data.question;
        } else {
          finalResult.task.question = 'Question provided as image';
        }

        if (data.answerInputType === 'text' && data.answer) {
          finalResult.task.word_count = data.answer.split(/\s+/).filter(Boolean).length;
        }

        if (!finalResult.transcribedAnswer) {
          finalResult.transcribedAnswer = data.answerInputType === 'text' ? (data.answer || '') : 'Answer provided as image';
        }

        dispatch({ type: 'SET_RESULT', payload: finalResult });
        toast({ title: 'Assessment Complete!', description: 'Redirecting to your results...', variant: 'default' });
        router.push('/results');

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: 'Assessment Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    });
  }
  
  const FileInput = ({
    fieldName,
    previews,
    setPreviews,
  }: {
    fieldName: 'questionImages' | 'answerImages';
    previews: string[];
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  }) => {
    const id = useId();
    return (
      <FormItem>
        <FormControl>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-video rounded-md overflow-hidden group bg-muted">
                <Image src={preview} alt={`Upload preview ${index+1}`} layout="fill" objectFit="contain" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index, fieldName, previews, setPreviews)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
             <label
              htmlFor={id}
              className="flex flex-col items-center justify-center text-center p-4 cursor-pointer aspect-video bg-muted/50 rounded-md hover:bg-muted border-2 border-dashed hover:border-primary transition-colors"
            >
              <PlusCircle className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-xs text-muted-foreground">
                Add Image
              </p>
              <Input
                type="file"
                id={id}
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => handleFileChange(e, fieldName, setPreviews)}
                value=""
                multiple
              />
            </label>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">1. Select Task Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Task 1 (Academic)" />
                    </FormControl>
                    <FormLabel className="font-normal">Task 1 (Academic)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Task 1 (General)" />
                    </FormControl>
                    <FormLabel className="font-normal">Task 1 (General)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Task 2" />
                    </FormControl>
                    <FormLabel className="font-normal">Task 2</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
            <FormLabel className="text-base font-semibold">2. Provide the Question</FormLabel>
            <Tabs value={questionInputType} onValueChange={(value) => {
                const newType = value as 'text' | 'image';
                setQuestionInputType(newType);
                form.setValue('questionInputType', newType, { shouldValidate: true });
            }} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Type/Paste Text</TabsTrigger>
                    <TabsTrigger value="image">Upload Image(s)</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Type or paste the IELTS question here..." {...field} rows={5}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </TabsContent>
                <TabsContent value="image">
                    <FormField
                        control={form.control}
                        name="questionImages"
                        render={() => (
                           <FileInput fieldName="questionImages" previews={questionPreviews} setPreviews={setQuestionPreviews} />
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>

        <div className="space-y-3">
            <FormLabel className="text-base font-semibold">3. Provide Your Answer</FormLabel>
            <Tabs value={answerInputType} onValueChange={(value) => {
                 const newType = value as 'text' | 'image';
                setAnswerInputType(newType);
                form.setValue('answerInputType', newType, { shouldValidate: true });
            }} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Type/Paste Text</TabsTrigger>
                    <TabsTrigger value="image">Upload Image(s)</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Type or paste your full essay here..." {...field} rows={15}/>
                          </FormControl>
                           <FormDescription>
                             Aim for over 150 words for Task 1 and 250 for Task 2.
                           </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </TabsContent>
                <TabsContent value="image">
                    <FormField
                        control={form.control}
                        name="answerImages"
                        render={() => (
                            <FileInput fieldName="answerImages" previews={answerPreviews} setPreviews={setAnswerPreviews} />
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>
        
        <div className="space-y-3">
             <FormLabel className="text-base font-semibold">4. Candidate Info</FormLabel>
             <div className="grid sm:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="candidateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="candidateEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
        </div>

        <Button type="submit" disabled={isPending} className="w-full md:w-auto" size="lg">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assessing...
            </>
          ) : (
            'Get Assessment'
          )}
        </Button>
      </form>
    </Form>
  );
}

    