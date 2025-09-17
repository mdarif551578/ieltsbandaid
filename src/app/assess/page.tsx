import AssessmentForm from '@/components/assessment/assessment-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function AssessPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">
                Submit Your Writing Task
            </h1>
            <p className="text-muted-foreground mb-8">
                Fill in the details below to get your AI-powered assessment.
            </p>
            <AssessmentForm />
        </div>
        <div className="md:col-span-1">
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <CardTitle className="font-headline">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li>
                            <strong>Clear Uploads:</strong> For image uploads, ensure your handwriting is clear and the photo is well-lit.
                        </li>
                        <li>
                            <strong>Word Count:</strong> Aim for over 150 words for Task 1 and over 250 words for Task 2.
                        </li>
                        <li>
                            <strong>Include the Question:</strong> Providing the question helps the AI give a more accurate Task Achievement score.
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
