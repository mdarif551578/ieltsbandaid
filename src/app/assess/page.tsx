import AssessmentForm from '@/components/assessment/assessment-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, BookCheck, Camera, Type, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AssessPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">
                Submit Your Writing Task
            </h1>
            <p className="text-muted-foreground mb-8">
                Fill in the details below to get your AI-powered assessment.
            </p>
            <AssessmentForm />
        </div>
        <aside className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    <CardTitle>Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3">
                           <Camera className="w-5 h-5 mt-0.5 shrink-0" />
                           <span>
                                <strong>Clear Uploads:</strong> For image uploads, ensure your handwriting is legible and the photo is well-lit without shadows.
                           </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <BookCheck className="w-5 h-5 mt-0.5 shrink-0" />
                            <span>
                                <strong>Word Count:</strong> Aim for over 150 words for Task 1 and over 250 words for Task 2 to be properly evaluated.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                           <Type className="w-5 h-5 mt-0.5 shrink-0" />
                           <span>
                                <strong>Include the Question:</strong> Providing the exact question helps the AI give a more accurate Task Achievement score.
                            </span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>Sample Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Not sure what to upload? Download our sample files to see how it works.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="link" asChild className="p-0 h-auto justify-start">
                            <a href="/sample-question.jpg" download>
                               <Download className="mr-2 h-4 w-4" />
                               Sample Question.jpg
                            </a>
                        </Button>
                        <Button variant="link" asChild className="p-0 h-auto justify-start">
                             <a href="/sample-answer.jpg" download>
                                <Download className="mr-2 h-4 w-4" />
                                Sample Answer.jpg
                             </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </aside>
      </div>
    </div>
  );
}
