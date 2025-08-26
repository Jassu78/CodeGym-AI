import { config } from 'dotenv';
config();

import '@/ai/flows/auto-generate-problems.ts';
import '@/ai/flows/check-code.ts';
import '@/ai/flows/run-code.ts';
