import { GraduationCap, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">IELTS BandAid</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-6 text-sm text-muted-foreground mb-4 md:mb-0">
            <Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} IELTS BandAid. All rights reserved.</p>
            <p className="mt-1">This is an educational tool and not an official IELTS assessment.</p>
        </div>
      </div>
    </footer>
  );
}
