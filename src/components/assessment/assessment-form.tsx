'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { useTransition, useState } from 'react';
import { assessWriting } from '@/app/assess/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  taskType: z.enum(['Task 1 (Academic)', 'Task 1 (General)', 'Task 2'], {
    required_error: 'You need to select a task type.',
  }),
  question: z.string().min(10, 'Question must be at least 10 characters.'),
  answer: z.string().min(50, 'Answer must be at least 50 characters to be evaluated.'),
  questionImage: z.string().optional(),
  answerImage: z.string().optional(),
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
    },
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
    if (questionInputType === 'text') finalData.questionImage = undefined;
    if (answerInputType === 'text') finalData.answerImage = undefined;
    if (questionInputType === 'image' && !finalData.questionImage) {
      form.setError('questionImage', { message: 'Please upload an image for the question.' });
      return;
    }
    if (answerInputType === 'image' && !finalData.answerImage) {
      form.setError('answerImage', { message: 'Please upload an image for the answer.' });
      return;
    }

    startTransition(async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await assessWriting(finalData);
      if (result.success && result.data) {
        dispatch({ type: 'SET_RESULT', payload: result.data });
        toast({ title: 'Assessment Complete!', description: 'Redirecting to your results...' });
        router.push('/results');
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'An unknown error occurred.' });
        toast({
          title: 'Assessment Failed',
          description: result.error || 'Please try again later.',
          variant: 'destructive',
        });
      }
    });
  }

  const renderFileInput = (fieldName: 'questionImage' | 'answerImage', preview: string | null, setPreview: (p:string | null) => void) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">{fieldName}</FormLabel>
          <FormControl>
            <Card className="border-2 border-dashed">
                <CardContent className="p-6">
                    {preview ? (
                        <div className="relative aspect-video">
                            <Image src={preview} alt="Upload preview" layout="fill" objectFit="contain" />
                            <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => {
                                setPreview(null);
                                form.setValue(fieldName, undefined);
                                if (fieldName === 'questionImage') form.setValue('question', '');
                                if (fieldName === 'answerImage') form.setValue('answer', '');
                            }}>Remove</Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                Drag & drop or click to upload an image (.jpg, .png)
                            </p>
                            <Input
                                {...form.register(fieldName)}
                                type="file"
                                accept="image/jpeg,image/png"
                                className="sr-only"
                                id={fieldName}
                                onChange={(e) => handleFileChange(e, fieldName, setPreview)}
                            />
                            <label htmlFor={fieldName} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary cursor-pointer">
                                <ImageIcon className="h-4 w-4" />
                                Select File
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-semibold font-headline">1. Select Task Type</FormLabel>
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
            <FormLabel className="text-lg font-semibold font-headline">2. Provide the Question</FormLabel>
            <Tabs value={questionInputType} onValueChange={setQuestionInputType} className="w-full">
                <TabsList>
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
                            <Textarea placeholder="Type or paste the IELTS question here..." {...field} rows={5} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </TabsContent>
                <TabsContent value="image">
                    {renderFileInput('questionImage', questionPreview, setQuestionPreview)}
                </TabsContent>
            </Tabs>
        </div>

        <div className="space-y-3">
            <FormLabel className="text-lg font-semibold font-headline">3. Provide Your Answer</FormLabel>
            <Tabs value={answerInputType} onValueChange={setAnswerInputType} className="w-full">
                <TabsList>
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
                            <Textarea placeholder="Type or paste your full essay here..." {...field} rows={15} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </TabsContent>
                <TabsContent value="image">
                    {renderFileInput('answerImage', answerPreview, setAnswerPreview)}
                </TabsContent>
            </Tabs>
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
