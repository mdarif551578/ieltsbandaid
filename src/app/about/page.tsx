import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-4">
        About IELTS BandAid
      </h1>
      <p className="text-center text-muted-foreground text-lg mb-12">
        Our mission is to make high-quality IELTS preparation accessible to everyone.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Placeholder Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will contain information about the project, its mission, and the technology behind it.</p>
           <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
            <li>Mission Statement</li>
            <li>Information about the creator (Md Arif)</li>
            <li>Details on the tech stack used to build the application.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
