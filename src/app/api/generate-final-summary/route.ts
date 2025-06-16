import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { transcript, yaml_config, tasks } = await request.json();

    if (!transcript || !yaml_config || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Missing transcript, yaml_config, or tasks' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a medical assistant generating a finalized SOAP note for a fertility consultation.
Include the provided tasks in the Plan (P) section and nowhere else.
Return ONLY the SOAP note as plain text.`
        },
        {
          role: 'user',
          content: `INTERVIEW QUESTIONS/STRUCTURE:
${yaml_config}

TRANSCRIPT:
${transcript}

TASKS TO INCLUDE IN PLAN:
${tasks.join('\n')}`
        }
      ],
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content?.trim() || 'Unable to generate summary';
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating final summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate final summary' },
      { status: 500 }
    );
  }
} 