import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
          About IELTS BandAid
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Our mission is to make high-quality IELTS preparation accessible to everyone, powered by cutting-edge AI.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                IELTS BandAid was born from a simple idea: what if every IELTS student could have a personal writing tutor available 24/7? We leverage the power of generative AI to provide instant, detailed, and objective feedback on IELTS writing tasks. Our goal is to demystify the scoring criteria and provide actionable advice that helps students improve their skills, build confidence, and achieve their target band scores.
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">The Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This application is built on a modern, robust tech stack designed for performance and scalability:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><span className="font-semibold text-foreground">Next.js & Vercel:</span> For a fast, server-rendered React application with seamless deployment.</li>
                <li><span className="font-semibold text-foreground">Shadcn UI & Tailwind CSS:</span> To create a beautiful, responsive, and accessible user interface.</li>
                <li><span className="font-semibold text-foreground">Genkit & Gemini AI:</span> For the core AI-powered transcription and evaluation engine.</li>
                <li><span className="font-semibold text-foreground">TypeScript:</span> For robust, type-safe code that minimizes errors.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center">
            <CardHeader>
              <Avatar className="mx-auto h-24 w-24 mb-4">
                <AvatarImage src="https://github.com/shadcn.png" alt="Md Arif" />
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline">Md Arif</CardTitle>
              <p className="text-sm text-muted-foreground">Creator & AI Engineer</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Arif is a passionate developer dedicated to using AI for education.
              </p>
              <div className="flex justify-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary"><Github size={20} /></a>
                <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></a>
                <a href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
