'use client';

import { Card, CardContent } from "@/components/ui/card";
import RadialProgress from "./radial-progress";

interface ScoreOverviewProps {
    score: number;
    cefr: string;
    summary: string;
}

export default function ScoreOverview({ score, cefr, summary }: ScoreOverviewProps) {
    const getScoreColor = (band: number) => {
        if (band >= 7.0) return 'text-green-500';
        if (band >= 5.5) return 'text-yellow-500';
        return 'text-red-500';
    };

    const colorClass = getScoreColor(score);
    const progressValue = (score / 9) * 100;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6 grid md:grid-cols-3 gap-6 items-center">
                <div className="flex flex-col items-center justify-center text-center row-span-1 md:row-auto border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
                    <RadialProgress progress={progressValue} score={score} colorClass={colorClass} />
                     <div className="mt-4">
                        <p className="text-sm text-muted-foreground">CEFR Level</p>
                        <p className="text-2xl font-bold">{cefr}</p>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <h2 className="text-xl font-headline font-bold">Overall Band Score & Summary</h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        {summary}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
