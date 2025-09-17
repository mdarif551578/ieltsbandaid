import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, BrainCircuit, BarChart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { placeholderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Detailed Band Scores',
    description: 'Get a comprehensive breakdown of your score for each IELTS criterion.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'Actionable AI Feedback',
    description: 'Receive specific suggestions and examples to improve your writing.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Free & Easy to Use',
    description: 'Simply upload or type your essay and get your assessment in seconds.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Official Criteria',
    description: 'Our AI evaluates your writing based on the official IELTS band descriptors.',
  },
];

const steps = [
  {
    step: 1,
    title: 'Provide Your Task',
    description: 'Select your task type and either type or upload an image of your question and answer.',
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Our advanced AI gets to work, transcribing and evaluating your writing against official IELTS criteria.',
  },
  {
    step: 3,
    title: 'Receive Your Results',
    description: 'Get a detailed report with your overall band score, criteria breakdown, and actionable feedback.',
  },
];

const testimonials = [
  {
    name: 'Priya S.',
    quote: "IeltsBandBoost was a game-changer! The detailed feedback helped me jump from a 6.5 to a 7.5 in just two weeks.",
    image: placeholderImages.find(p => p.id === "testimonial-1")
  },
  {
    name: 'Chen L.',
    quote: "The AI is incredibly accurate. It pointed out weaknesses I didn't even know I had. Highly recommended!",
    image: placeholderImages.find(p => p.id === "testimonial-2")
  },
];

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === "hero-background");
  
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40">
        {heroImage && (
             <Image
             src={heroImage.imageUrl}
             alt={heroImage.description}
             fill
             className="object-cover -z-10"
             priority
             data-ai-hint={heroImage.imageHint}
           />
        )}
        <div className="absolute inset-0 bg-black/50 -z-10" />
        <div className="container mx-auto px-4 md:px-6 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Boost Your IELTS Writing Score with AI Feedback
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-primary-foreground/90">
            Upload your essay and get instant, expert-level analysis based on official criteria.
          </p>
          <Button asChild size="lg" className="mt-8 bg-secondary hover:bg-secondary/90">
            <Link href="/assess">Start Free Assessment</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Why Choose IeltsBandBoost?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-muted-foreground">
            Our platform is designed to give you the edge you need to succeed.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center bg-card border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="items-center">
                  {feature.icon}
                  <CardTitle className="mt-4 font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            How It Works in 3 Simple Steps
          </h2>
          <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-3 gap-8 md:gap-4 relative">
             <div className="absolute top-8 left-0 w-full h-0.5 bg-border hidden md:block" />
             {steps.map((step, index) => (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl z-10 border-4 border-muted/50">
                  {step.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Loved by Students Worldwide
          </h2>
          <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => testimonial.image && (
              <Card key={testimonial.name} className="flex flex-col items-center text-center p-6 bg-muted/30">
                <Image
                  src={testimonial.image.imageUrl}
                  alt={`Testimonial from ${testimonial.name}`}
                  width={80}
                  height={80}
                  className="rounded-full"
                  data-ai-hint={testimonial.image.imageHint}
                />
                <blockquote className="mt-4 text-lg italic text-foreground">"{testimonial.quote}"</blockquote>
                <cite className="mt-2 font-semibold text-primary not-italic">- {testimonial.name}</cite>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
