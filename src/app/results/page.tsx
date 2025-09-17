'use client';

import { useAssessment } from '@/context/assessment-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Download, Share2, Printer } from 'lucide-react';
import ScoreOverview from '@/components/results/score-overview';
import CriteriaAccordion from '@/components/results/criteria-accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ResultsPage() {
  const { state } = useAssessment();
  const router = useRouter();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.isLoading) {
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    // On mount, check for result in context or redirect.
    // Give a slight delay to allow context to populate from local storage.
    const redirectTimer = setTimeout(() => {
        if (!state.isLoading && !state.result) {
            router.replace('/assess');
        }
    }, 500);


    return () => {
      clearTimeout(redirectTimer);
      if(timer) clearInterval(timer);
    };
  }, [state.isLoading, state.result, router]);
  
  const handlePrint = () => {
    // Temporarily add a class to expand accordions for printing
    document.body.classList.add('print-expand-all');
    window.print();
    // Remove the class after printing
    document.body.classList.remove('print-expand-all');
  };

  if (state.isLoading) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
        <h1 className="text-3xl font-headline font-bold mb-2">Generating Your Feedback...</h1>
        <p className="text-muted-foreground mb-6 max-w-md">Our AI is performing a detailed analysis of your writing. This usually takes about 30-60 seconds.</p>
        <div className="text-6xl font-bold font-mono tabular-nums text-primary">
            <span>{String(minutes).padStart(2, '0')}</span>:<span>{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
        <div className="container mx-auto max-w-2xl py-20">
            <Alert variant="destructive" className="text-center">
                <AlertTitle className="text-2xl font-bold">Assessment Failed</AlertTitle>
                <AlertDescription className="mt-4">
                   <p className="mb-6 text-base">{state.error}</p>
                   <Button asChild>
                        <Link href="/assess">Try Again</Link>
                   </Button>
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  if (!state.result) {
    // This state should ideally not be visible as the useEffect will redirect.
    // It acts as a fallback.
    return (
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
            <p className="text-muted-foreground">Loading results...</p>
        </div>
    );
  }
  
  const {
    overallBandScore,
    cefrLevel,
    taskAchievementResponse,
    coherenceAndCohesion,
    lexicalResource,
    grammaticalRangeAndAccuracy,
    overallStrengths,
    overallWeaknesses,
    keyRecommendations,
    transcribedAnswer,
  } = state.result;

  const wordCount = transcribedAnswer.split(/\s+/).filter(Boolean).length;
  const questionText = state.result.task?.question || "Question provided as image";
  const taskType = state.result.task?.type || "N/A";


  const criteria = [
    { title: 'Task Achievement / Response', data: taskAchievementResponse },
    { title: 'Coherence and Cohesion', data: coherenceAndCohesion },
    { title: 'Lexical Resource', data: lexicalResource },
    { title: 'Grammatical Range and Accuracy', data: grammaticalRangeAndAccuracy },
  ];
  
  return (
    <div className="bg-muted/30 print:bg-white">
      <div className="container mx-auto max-w-6xl py-8 md:py-12 print:py-4">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 print:hidden">
            <div>
              <h1 className="text-3xl md:text-4xl font-headline font-bold">Your Assessment Results</h1>
              <p className="text-muted-foreground mt-1">A detailed analysis of your IELTS writing task.</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
                <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Download PDF</Button>
                <Button variant="outline" disabled><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <ScoreOverview score={overallBandScore} cefr={cefrLevel} summary={"The AI-generated summary of your performance will appear here."}/>
                
                <section>
                    <h2 className="text-2xl font-headline font-bold mb-4">Criteria Breakdown</h2>
                    <CriteriaAccordion criteria={criteria} />
                </section>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Detailed Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-green-600">Overall Strengths</h3>
                            <ul className="mt-2 list-disc list-inside space-y-2 text-muted-foreground">
                                {overallStrengths.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <Separator />
                         <div>
                            <h3 className="text-lg font-semibold text-destructive">Overall Weaknesses</h3>
                            <ul className="mt-2 list-disc list-inside space-y-2 text-muted-foreground">
                                {overallWeaknesses.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-lg font-semibold text-primary">Key Recommendations</h3>
                            <ul className="mt-2 list-disc list-inside space-y-2 text-muted-foreground">
                                {keyRecommendations.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Task Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                           <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Task Type</h4>
                           <Badge variant="secondary">{taskType}</Badge>
                        </div>
                        <div>
                           <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Word Count</h4>
                           <Badge variant="secondary">{wordCount} words</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Your Submission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[40rem] overflow-y-auto">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground p-3 bg-muted/50 rounded-md">
                           <h4 className="font-semibold !text-foreground !mb-2">Question:</h4>
                           <p className="whitespace-pre-wrap">{questionText}</p>
                           <h4 className="font-semibold !text-foreground !mt-4 !mb-2">Your Answer:</h4>
                           <p className="whitespace-pre-wrap">{transcribedAnswer}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-primary text-primary-foreground text-center p-6 print:hidden">
                    <h3 className="text-xl font-bold font-headline">Ready for Another Round?</h3>
                    <p className="mt-2 text-sm opacity-90">Practice makes perfect. Assess another essay to track your progress.</p>
                    <Button asChild variant="secondary" className="mt-4">
                        <Link href="/assess">Assess Another Essay</Link>
                    </Button>
                </Card>
            </aside>
        </main>
      </div>
    </div>
  );
}
