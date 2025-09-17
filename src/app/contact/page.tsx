import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-4">
        Contact Us
      </h1>
      <p className="text-center text-muted-foreground text-lg mb-12">
        We'd love to hear your feedback and suggestions.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Placeholder Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will feature a contact form for users to send messages. The form will include fields for name, email, and message, and will be powered by a server action to handle submissions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
