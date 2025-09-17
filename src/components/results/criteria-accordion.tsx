'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Target } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { badgeVariants } from '@/components/ui/badge';
import { AssessmentResult } from '@/context/assessment-context';

type CriterionData = AssessmentResult['assessment']['task_achievement_or_response'];

interface CriteriaAccordionProps {
    criteria: {
        title: string;
        data: CriterionData;
    }[];
}

export default function CriteriaAccordion({ criteria }: CriteriaAccordionProps) {
    
    const getBadgeVariant = (score: number): VariantProps<typeof badgeVariants>['variant'] => {
        if (score >= 7) return 'default';
        if (score >= 5.5) return 'secondary';
        return 'destructive';
    };

    return (
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {criteria.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={item.title} className="border-b-0 mb-4">
                    <AccordionTrigger className="bg-card p-4 rounded-lg border hover:no-underline data-[state=open]:rounded-b-none">
                        <div className="flex items-center justify-between w-full">
                            <h3 className="text-lg font-semibold text-left">{item.title}</h3>
                            <Badge variant={getBadgeVariant(item.data.band)}>{item.data.band.toFixed(1)}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card p-6 rounded-b-lg border border-t-0 space-y-4">
                        <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                            "{item.data.justification}"
                        </blockquote>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <h4 className="flex items-center gap-2 font-semibold text-green-600"><ThumbsUp className="h-4 w-4" />Strengths</h4>
                                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {item.data.examples.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="flex items-center gap-2 font-semibold text-red-600"><ThumbsDown className="h-4 w-4" />Weaknesses</h4>
                                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {item.data.examples.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h4 className="flex items-center gap-2 font-semibold text-primary"><Target className="h-4 w-4" />How to Improve</h4>
                            <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {item.data.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                            </ul>
                        </div>

                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
