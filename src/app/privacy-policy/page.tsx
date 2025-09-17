import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Privacy Policy
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div className="space-y-8 prose prose-lg max-w-none text-foreground dark:prose-invert">
          <p>
            Welcome to IELTS BandAid. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services. Your privacy is not just a policy; it's our promise.
          </p>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline">1. Information We Do Not Collect</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    We have designed our system with your privacy as the top priority. We do not collect or store any personal information that can identify you. Specifically:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-muted-foreground">
                    <li>We do not save your name, email address, or any other personal details you enter.</li>
                    <li>The essays and questions you submit for analysis are not stored on our servers after the assessment is completed.</li>
                    <li>We do not use cookies or tracking technologies to monitor your activity across other sites.</li>
                </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline">2. Information We Temporarily Process</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">
                    To provide our AI assessment service, we need to temporarily process the data you provide. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-muted-foreground">
                    <li>The writing task type, question, and your answer (either as text or image).</li>
                    <li>Your name and email, which are used in the generative prompt but immediately discarded.</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                    This data is used solely for the purpose of generating your assessment report. It is processed in memory and is not written to any permanent storage. Once your session ends or the report is generated, this information is permanently deleted.
                </p>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
                <CardTitle className="font-headline">3. How We Use AI</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">
                    Our AI models, powered by Google's Gemini, process your submission to provide an evaluation. The data sent to the AI is subject to Google's privacy policies. We do not permit Google or any third party to use your data for training their models or for any other purpose outside of generating your immediate assessment.
                </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline">4. Your Consent</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                   By using our service, you consent to this Privacy Policy. You are in control of your data; you choose what you submit for analysis.
                </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline">5. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page, so we encourage you to review it periodically.
                </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline">6. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
                </p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
