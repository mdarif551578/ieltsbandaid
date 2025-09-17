import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Upload, BrainCircuit, FileText, CheckCircle } from "lucide-react";

const processSteps = [
  {
    icon: <Upload className="h-8 w-8 text-primary" />,
    title: "1. You Submit Your Task",
    description: "You provide your IELTS writing task by either typing the text directly or uploading clear images of the question and your handwritten answer. Our system accepts standard image formats like JPG and PNG.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "2. AI Transcription & Analysis",
    description: "If you upload an image, our AI uses advanced Optical Character Recognition (OCR) to accurately transcribe the handwriting into text. Then, the powerful Gemini model analyzes the transcribed text against the official IELTS writing band descriptors.",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "3. Evaluation Across Four Criteria",
    description: "The AI performs a detailed evaluation of your writing across the four key IELTS criteria: Task Achievement/Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "4. Detailed Report Generation",
    description: "Finally, the system compiles all the analysis into a comprehensive, easy-to-read report. This includes your estimated band scores, specific strengths and weaknesses, and personalized recommendations for improvement.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-4">
          How IELTS BandAid Works
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-12">
          A look under the hood at our AI-powered assessment process.
        </p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-8">
            Our Assessment Process
          </h2>
          <div className="grid gap-8">
            {processSteps.map((step) => (
              <Card key={step.title} className="flex flex-col md:flex-row items-start gap-6 p-6">
                <div className="flex-shrink-0">{step.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How accurate is the AI assessment?</AccordionTrigger>
              <AccordionContent>
                Our AI is trained on a vast dataset of IELTS essays and aligned with the official band descriptors used by human examiners. While it provides a highly accurate and consistent estimation of your score, it should be used as an educational tool to identify areas for improvement, not as a replacement for an official IELTS test.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is my data private and secure?</AccordionTrigger>
              <AccordionContent>
                Absolutely. We do not store your essays or personal information after the assessment is complete. All processing is done securely, and your data is only used to generate your feedback report.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can the AI evaluate both Task 1 and Task 2?</AccordionTrigger>
              <AccordionContent>
                Yes! Our system is equipped to handle both Task 1 (Academic and General Training) and Task 2. The AI understands the different requirements for each task type and evaluates your response accordingly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What if my handwriting is messy?</AccordionTrigger>
              <AccordionContent>
                Our AI-powered transcription is very powerful, but its accuracy depends on the legibility of the handwriting. For best results, please ensure your writing is as clear as possible and that you upload a well-lit, high-quality photo. If transcription fails, the system will notify you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
