'use client';
import { AssessmentProvider } from '@/context/assessment-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AssessmentProvider>{children}</AssessmentProvider>;
}
