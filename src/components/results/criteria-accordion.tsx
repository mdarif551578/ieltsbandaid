'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';

interface CriterionData {
    bandScore: number;
    justification: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
}

interface CriteriaAccordionProps {
    criteria: {
        title: string;
        data: CriterionData;
    }[];
}

export default function CriteriaAccordion({ criteria }: CriteriaAccordionProps) {
    
    const getBadgeVariant = (score: number) => {
        if (score >= 7) return 'success';
        if (score >= 5.5) return 'warning';
        return 'destructive';
    };

    const CustomBadge = ({ score } : {score: number}) => {
        const variant = getBadgeVariant(score);
        let className = "text-white ";
        if(variant === 'success') className += 'bg-green-600 hover:bg-green-700';
        else if(variant === 'warning') className += 'bg-yellow-500 hover:bg-yellow-600';
        else className += 'bg-red-600 hover:bg-red-700';
        return <Badge className={className}>{score.toFixed(1)}</Badge>
    }

    return (
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {criteria.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={item.title} className="border-b-0">
                    <AccordionTrigger className="bg-card p-4 rounded-t-lg border border-b-0 hover:no-underline data-[state=open]:rounded-b-none">
                        <div className="flex items-center justify-between w-full">
                            <h3 className="text-lg font-headline font-semibold text-left">{item.title}</h3>
                            <CustomBadge score={item.data.bandScore} />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card p-6 rounded-b-lg border border-t-0 space-y-4">
                        <p className="text-sm text-muted-foreground italic">"{item.data.justification}"</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <h4 className="flex items-center gap-2 font-semibold text-green-600"><ThumbsUp className="h-4 w-4" />Strengths</h4>
                                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {item.data.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="flex items-center gap-2 font-semibold text-red-600"><ThumbsDown className="h-4 w-4" />Weaknesses</h4>
                                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {item.data.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h4 className="flex items-center gap-2 font-semibold text-primary"><ArrowRight className="h-4 w-4" />How to Improve</h4>
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
