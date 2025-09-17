'use client';

import { Card, CardContent } from "@/components/ui/card";
import RadialProgress from "./radial-progress";
import { Progress } from "@/components/ui/progress";

interface ScoreOverviewProps {
    score: number;
    cefr: string;
}

export default function ScoreOverview({ score, cefr }: ScoreOverviewProps) {
    const getScoreColor = (band: number) => {
        if (band >= 7) return 'text-green-600';
        if (band >= 5.5) return 'text-yellow-500';
        return 'text-red-600';
    };

    const colorClass = getScoreColor(score);
    const progressValue = (score / 9) * 100;

    return (
        <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <RadialProgress progress={progressValue} score={score} colorClass={colorClass} />
                    <div>
                        <h2 className="text-2xl font-bold">Overall Band Score</h2>
                        <p className="text-muted-foreground">Your estimated IELTS score based on your submission.</p>
                    </div>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-sm text-muted-foreground">CEFR Level</p>
                    <p className="text-2xl font-bold">{cefr}</p>
                </div>
            </CardContent>
            <div className="px-6 pb-6">
                 <Progress value={progressValue} className="h-2 [&>div]:bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
            </div>
        </Card>
    );
}
