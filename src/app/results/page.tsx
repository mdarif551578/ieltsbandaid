'use client';

import { useAssessment } from '@/context/assessment-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Download, Share2 } from 'lucide-react';
import ScoreOverview from '@/components/results/score-overview';
import CriteriaAccordion from '@/components/results/criteria-accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ResultsPage() {
  const { state } = useAssessment();
  const router = useRouter();

  useEffect(() => {
    // Redirect if there's no result and it's not loading.
    const timer = setTimeout(() => {
      if (!state.isLoading && !state.result && !state.error) {
        console.log("Redirecting to /assess");
        router.replace('/assess');
      }
    }, 500); // Increased delay to allow for state hydration

    return () => clearTimeout(timer);
  }, [state.isLoading, state.result, state.error, router]);

  const handlePrint = () => {
    window.print();
  };

  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-semibold">Generating Your Feedback...</h1>
        <p className="text-muted-foreground">This may take a moment. Our AI is analyzing your work.</p>
      </div>
    );
  }

  if (state.error) {
    return (
        <div className="container mx-auto max-w-2xl py-12">
            <Alert variant="destructive">
                <AlertTitle>Assessment Failed</AlertTitle>
                <AlertDescription>
                   <p className="mb-4">{state.error}</p>
                   <Button asChild variant="destructive">
                        <Link href="/assess">Try Again</Link>
                   </Button>
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  if (!state.result) {
    return null; // Or a minimal loading state/skeleton
  }

  const {
    assessment,
    feedback,
    task,
    transcribedAnswer,
    cefrLevel,
  } = state.result;

  const criteria = [
    { title: 'Task Achievement / Response', data: assessment.task_achievement_or_response },
    { title: 'Coherence and Cohesion', data: assessment.coherence_and_cohesion },
    { title: 'Lexical Resource', data: assessment.lexical_resource },
    { title: 'Grammatical Range and Accuracy', data: assessment.grammatical_range_and_accuracy },
  ];
  
  return (
    <div className="bg-muted/30 print:bg-white">
      <div className="container mx-auto max-w-5xl py-8 md:py-12 print:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 sm:mb-0">Your Assessment Results</h1>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                <Button variant="outline" disabled><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <ScoreOverview score={assessment.overall_band_score} cefr={cefrLevel} summary={feedback.summary}/>
                <CriteriaAccordion criteria={criteria} />
                
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-green-600">Overall Strengths</h3>
                            <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                                {feedback.overall_strengths.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <Separator />
                         <div>
                            <h3 className="text-lg font-semibold text-red-600">Overall Weaknesses</h3>
                            <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                                {feedback.overall_weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-lg font-semibold text-primary">Key Recommendations</h3>
                            <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                                {feedback.key_recommendations.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Task Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                           <h4 className="font-semibold text-sm mb-1">Task Type</h4>
                           <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">{task.type}</p>
                        </div>
                        <div>
                           <h4 className="font-semibold text-sm mb-1">Word Count</h4>
                           <Badge variant="secondary">{task.word_count} words</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Submission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="prose prose-sm max-w-none text-muted-foreground p-3 bg-muted/50 rounded-md">
                           <h4 className="font-semibold !text-foreground !mb-2">Question:</h4>
                           <p>{task.question}</p>
                           <h4 className="font-semibold !text-foreground !mt-4 !mb-2">Your Answer:</h4>
                           <p>{transcribedAnswer}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-primary text-primary-foreground text-center p-6 print:hidden">
                    <h3 className="text-xl font-bold">Ready for Another Round?</h3>
                    <p className="mt-2 text-sm opacity-90">Practice makes perfect. Assess another essay to track your progress.</p>
                    <Button asChild variant="secondary" className="mt-4">
                        <Link href="/assess">Assess Another Essay</Link>
                    </Button>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
