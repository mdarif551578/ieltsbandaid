import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Twitter, Users, Cpu, Rocket } from "lucide-react";
import Link from "next/link";
import { placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";


const team = [
    {
        name: "Md Arif",
        role: "Creator & AI Engineer",
        avatarId: "testimonial-2",
        bio: "Arif is a passionate developer dedicated to leveraging AI for accessible education and bridging learning gaps.",
        social: {
            github: "#",
            linkedin: "#",
            twitter: "#",
        }
    },
]

export default function AboutPage() {
    const aboutHeroImage = placeholderImages.find(p => p.id === "about-hero");

  return (
    <div className="flex flex-col">
        <section className="relative w-full py-20 md:py-32">
            {aboutHeroImage && (
                <Image
                    src={aboutHeroImage.imageUrl}
                    alt={aboutHeroImage.description}
                    fill
                    className="object-cover -z-10"
                    priority
                    data-ai-hint={aboutHeroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-black/60 -z-10" />
            <div className="container mx-auto px-4 md:px-6 text-center text-primary-foreground">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold">
                    Empowering Your IELTS Journey
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-primary-foreground/90">
                   Our mission is to make high-quality IELTS preparation accessible to everyone, powered by cutting-edge AI.
                </p>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto max-w-5xl px-4 md:px-6">
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-headline mb-4">Our Story</h2>
                        <p className="text-muted-foreground mb-4">
                            IELTS BandAid was born from a simple idea: what if every IELTS student could have a personal writing tutor available 24/7? We saw countless students struggle to get the targeted, consistent feedback needed to improve their writing scores.
                        </p>
                        <p className="text-muted-foreground">
                            We leverage the power of generative AI to provide instant, detailed, and objective feedback on IELTS writing tasks. Our goal is to demystify the scoring criteria and provide actionable advice that helps students improve their skills, build confidence, and achieve their target band scores.
                        </p>
                    </div>
                    <div>
                        <Card>
                            <CardHeader className="flex-row items-center gap-4">
                                <Rocket className="w-10 h-10 text-primary" />
                                <div>
                                    <CardTitle className="font-headline">Our Mission</CardTitle>
                                    <CardDescription>Democratizing IELTS preparation through AI.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                To provide every IELTS candidate with an affordable, on-demand AI writing assistant that offers precise, constructive, and encouraging feedback, helping them unlock their full potential.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto max-w-5xl px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">
                        Meet the Creator
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        The mind behind the mission to revolutionize IELTS prep.
                    </p>
                </div>
                 <div className="flex justify-center">
                    {team.map(member => {
                        const avatarImage = placeholderImages.find(p => p.id === member.avatarId);
                        return (
                             <Card key={member.name} className="max-w-sm w-full text-center">
                                <CardHeader>
                                    {avatarImage && (
                                        <Avatar className="mx-auto h-24 w-24 mb-4">
                                            <AvatarImage src={avatarImage.imageUrl} alt={member.name} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                  <CardTitle className="font-headline">{member.name}</CardTitle>
                                  <p className="text-sm text-primary font-semibold">{member.role}</p>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {member.bio}
                                  </p>
                                  <div className="flex justify-center gap-4">
                                    <a href={member.social.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Github size={20} /></a>
                                    <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></a>
                                    <a href={member.social.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
                                  </div>
                                </CardContent>
                              </Card>
                        )
                    })}
                 </div>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto max-w-5xl px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">
                        The Technology Behind the Feedback
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Built on a modern, robust tech stack designed for performance and scalability.
                    </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                            <Cpu size={24}/>
                       </div>
                       <h3 className="font-semibold text-lg">Genkit & Gemini</h3>
                       <p className="text-sm text-muted-foreground">For the core AI-powered transcription and evaluation engine.</p>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M0 0h24v24H0z" stroke="none"/><path d="M12 9l-7.53 6.453A.75.75 0 005 16h14a.75.75 0 00.53-1.297L12 9z"/><path d="M12 3l-7.53 6.453A.75.75 0 005 10h14a.75.75 0 00.53-1.297L12 3z"/></svg>
                       </div>
                       <h3 className="font-semibold text-lg">Next.js & Vercel</h3>
                       <p className="text-sm text-muted-foreground">For a fast, server-rendered React application.</p>
                    </div>
                     <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M0 0h24v24H0z" stroke="none"/><path d="M3.5 17.5l6.5-6.5L14 15l6.5-6.5m0-4v4h-4"/></svg>
                       </div>
                       <h3 className="font-semibold text-lg">Shadcn & Tailwind</h3>
                       <p className="text-sm text-muted-foreground">To create a beautiful, responsive, and accessible UI.</p>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M0 0h24v24H0z" stroke="none"/><path d="M9 16v-8l3 5 3-5v8"/><path d="M15 16v-5.5a2.5 2.5 0 00-5 0V16"/></svg>
                       </div>
                       <h3 className="font-semibold text-lg">TypeScript</h3>
                       <p className="text-sm text-muted-foreground">For robust, type-safe code that minimizes errors.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}
