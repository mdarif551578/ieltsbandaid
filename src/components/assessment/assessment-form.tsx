'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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
import { Card, CardContent } from '@/components/ui/card';
import { useAssessment } from '@/context/assessment-context';
import { useRouter } from 'next/navigation';
import { useTransition, useState, useId } from 'react';
import { assessWriting } from '@/app/assess/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  taskType: z.enum(['Task 1 (Academic)', 'Task 1 (General)', 'Task 2'], {
    required_error: 'You need to select a task type.',
  }),
  question: z.string().optional(),
  answer: z.string().optional(),
  questionImage: z.string().optional(),
  answerImage: z.string().optional(),
  candidateName: z.string().optional(),
  candidateEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (!data.question && !data.questionImage) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['question'],
            message: 'Please provide the question by typing or uploading an image.',
        });
    }
    if (data.question && data.question.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['question'],
        message: 'Question must be at least 10 characters.',
      });
    }
    if (!data.answer && !data.answerImage) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['answer'],
            message: 'Please provide your answer by typing or uploading an image.',
        });
    }
    if (data.answer && data.answer.length < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['answer'],
        message: 'Answer must be at least 50 characters to be evaluated.',
      });
    }
});

type FormValues = z.infer<typeof formSchema>;

export default function AssessmentForm() {
  const { dispatch } = useAssessment();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [questionInputType, setQuestionInputType] = useState('text');
  const [answerInputType, setAnswerInputType] = useState('text');
  const [questionPreview, setQuestionPreview] = useState<string | null>(null);
  const [answerPreview, setAnswerPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskType: 'Task 2',
      question: '',
      answer: '',
      candidateName: '',
      candidateEmail: '',
    },
    mode: 'onBlur'
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'questionImage' | 'answerImage', setPreview: (p: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        form.setError(fieldName, { message: 'File must be less than 5MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = loadEvent.target?.result as string;
        form.setValue(fieldName, base64, { shouldValidate: true });
        setPreview(base64);
        if (fieldName === 'questionImage') form.setValue('question', 'Image uploaded');
        if (fieldName === 'answerImage') form.setValue('answer', 'Image uploaded');
      };
      reader.onerror = () => {
        form.setError(fieldName, { message: 'Failed to read file.' });
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: FormValues) {
    const finalData = { ...data };
    
    if (questionInputType === 'text') {
        finalData.questionImage = undefined;
    } else {
        finalData.question = 'Image Uploaded';
    }

    if (answerInputType === 'text') {
        finalData.answerImage = undefined;
    } else {
        finalData.answer = 'Image Uploaded';
    }

    startTransition(async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Pass a cleaned version of data to the server action
      const result = await assessWriting({
        taskType: finalData.taskType,
        question: finalData.question || '',
        answer: finalData.answer || '',
        questionImage: finalData.questionImage,
        answerImage: finalData.answerImage,
        candidateName: finalData.candidateName,
        candidateEmail: finalData.candidateEmail,
      });

      if (result.success && result.data) {
        dispatch({ type: 'SET_RESULT', payload: result.data });
        toast({ title: 'Assessment Complete!', description: 'Redirecting to your results...', variant: 'default' });
        router.push('/results');
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'An unknown error occurred.' });
        toast({
          title: 'Assessment Failed',
          description: result.error || 'Please check your inputs and try again.',
          variant: 'destructive',
        });
      }
    });
  }
  
  const FileInput = ({
    field,
    fieldName,
    preview,
    setPreview,
  }: {
    field: any;
    fieldName: 'questionImage' | 'answerImage';
    preview: string | null;
    setPreview: (p: string | null) => void;
  }) => {
    const id = useId();
    return (
      <FormItem>
        <FormControl>
          <Card className="border-2 border-dashed hover:border-primary transition-colors">
            <CardContent className="p-4">
              {preview ? (
                <div className="relative aspect-video">
                  <Image src={preview} alt="Upload preview" layout="fill" objectFit="contain" className="rounded-md" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-3 -right-3 h-7 w-7 rounded-full"
                    onClick={() => {
                      setPreview(null);
                      form.setValue(fieldName, undefined, { shouldValidate: true });
                      const correspondingTextField = fieldName === 'questionImage' ? 'question' : 'answer';
                      form.setValue(correspondingTextField, '', { shouldValidate: true });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor={id}
                  className="flex flex-col items-center justify-center text-center p-6 cursor-pointer"
                >
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop or click to upload an image
                  </p>
                   <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      <ImageIcon className="h-4 w-4" />
                      Select File
                    </span>
                  <p className="text-xs text-muted-foreground mt-1">.jpg, .png, .jpeg up to 5MB</p>
                  <Input
                    {...field}
                    type="file"
                    id={id}
                    accept="image/jpeg,image/png"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e, fieldName, setPreview)}
                  />
                </label>
              )}
            </CardContent>
          </Card>
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
            <Tabs value={questionInputType} onValueChange={setQuestionInputType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Type/Paste Text</TabsTrigger>
                    <TabsTrigger value="image">Upload Image</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Type or paste the IELTS question here..." {...field} rows={5} disabled={questionInputType === 'image'}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </TabsContent>
                <TabsContent value="image">
                    <FormField
                      control={form.control}
                      name="questionImage"
                      render={({ field }) => <FileInput field={field} fieldName="questionImage" preview={questionPreview} setPreview={setQuestionPreview} />}
                    />
                </TabsContent>
            </Tabs>
        </div>

        <div className="space-y-3">
            <FormLabel className="text-base font-semibold">3. Provide Your Answer</FormLabel>
            <Tabs value={answerInputType} onValueChange={setAnswerInputType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Type/Paste Text</TabsTrigger>
                    <TabsTrigger value="image">Upload Image</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Type or paste your full essay here..." {...field} rows={15} disabled={answerInputType === 'image'}/>
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
                      name="answerImage"
                      render={({ field }) => <FileInput field={field} fieldName="answerImage" preview={answerPreview} setPreview={setAnswerPreview} />}
                    />
                </TabsContent>
            </Tabs>
        </div>
        
        <div className="space-y-3">
             <FormLabel className="text-base font-semibold">4. Candidate Info (Optional)</FormLabel>
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
