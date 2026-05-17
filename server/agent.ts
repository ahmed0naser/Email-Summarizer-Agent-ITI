import { Agent, run } from '@openai/agents';
import { z } from 'zod';

const summarySchema = z.object({
  subject: z.string().describe('A short inferred subject for the email.'),
  bullets: z
    .array(z.string())
    .min(3)
    .max(7)
    .describe('Concise bullet points summarizing the email.'),
  actionItems: z
    .array(z.string())
    .max(5)
    .describe('Tasks, requests, or follow-ups mentioned in the email.'),
});

export type EmailSummary = z.infer<typeof summarySchema>;

const emailSummarizerAgent = new Agent({
  name: 'Email Summarizer',
  model: 'gpt-4o-mini',
  instructions: [
    'You summarize long emails into quick, useful bullet points.',
    'Keep the summary neutral, concise, and faithful to the email.',
    'Extract action items only when the email clearly asks for or implies follow-up.',
    'Do not invent facts, deadlines, names, or decisions that are not in the email.',
  ].join('\n'),
  outputType: summarySchema,
});

export async function summarizeEmail(emailText: string): Promise<EmailSummary> {
  const cleanedEmail = emailText.trim();

  if (!cleanedEmail) {
    throw new Error('Email text is required.');
  }

  const result = await run(
    emailSummarizerAgent,
    `Summarize this email:\n\n${cleanedEmail}`,
  );

  if (!result.finalOutput) {
    throw new Error('The summarizer did not return a final output.');
  }

  return result.finalOutput;
}
