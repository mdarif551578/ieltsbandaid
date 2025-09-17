import { config } from 'dotenv';
config();

import '@/ai/flows/generate-strengths-and-weaknesses.ts';
import '@/ai/flows/transcribe-image-to-text.ts';
import '@/ai/flows/evaluate-ielts-writing.ts';