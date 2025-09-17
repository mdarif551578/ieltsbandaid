import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-4">
        How IELTS BandAid Works
      </h1>
      <p className="text-center text-muted-foreground text-lg mb-12">
        A look under the hood at our AI-powered assessment process.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Placeholder Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will provide a detailed explanation of the AI process, including:</p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
            <li>A step-by-step breakdown with screenshots.</li>
            <li>Information on how the AI is trained on official IELTS criteria.</li>
            <li>An FAQ section addressing common questions about accuracy and data privacy.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
