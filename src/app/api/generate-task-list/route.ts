import { NextRequest, NextResponse } from 'next/server';
import yaml from 'js-yaml';
import OpenAI from 'openai';

type Rule = {
  id: string;
  trigger: {
    description?: string;
    keywords: string[];
    negative_keywords?: string[];
  };
  task: string;
};

function matchRule(rule: Rule, transcript: string): boolean {
  const text = transcript.toLowerCase();
  const hasKeyword = rule.trigger.keywords.some((kw) => text.includes(kw.toLowerCase()));
  if (!hasKeyword) return false;
  if (rule.trigger.negative_keywords?.some((kw) => text.includes(kw.toLowerCase()))) {
    return false;
  }
  return true;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { transcript, next_steps_rules_yaml } = await request.json();

    if (!transcript || !next_steps_rules_yaml) {
      return NextResponse.json(
        { error: 'Missing transcript or next_steps_rules_yaml' },
        { status: 400 }
      );
    }

    let rules: Rule[] = [];
    try {
      const parsed = yaml.load(next_steps_rules_yaml) as any;
      rules = parsed?.rules ?? [];
    } catch (err) {
      console.error('Failed to parse rules YAML', err);
      return NextResponse.json(
        { error: 'Invalid rules YAML' },
        { status: 400 }
      );
    }

    // Ask the model to decide which rule IDs apply, then map to exact task wording.
    const idPrompt = `You are given the following YAML rule definitions (ids and triggers). Return a JSON object with a single key "rule_ids" whose value is an array of the ids that match the conversation transcript. ONLY return the JSON, no extra text.  
\nRules:\n---\n${next_steps_rules_yaml}\n---\n\nTranscript:\n${transcript}\n`;

    let chosenIds: string[] = [];
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You select matching rule ids.' },
          { role: 'user', content: idPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.0,
      });
      const raw = completion.choices[0].message?.content ?? '{}';
      const parsed = JSON.parse(raw);
      chosenIds = Array.isArray(parsed.rule_ids) ? parsed.rule_ids : [];
    } catch (err) {
      console.error('LLM rule id extraction failed', err);
      // Fallback to deterministic matching
      chosenIds = rules.filter((r) => matchRule(r, transcript)).map((r) => r.id);
    }

    const tasks: string[] = rules.filter((r) => chosenIds.includes(r.id)).map((r) => r.task);

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error generating task list:', error);
    return NextResponse.json(
      { error: 'Failed to generate task list' },
      { status: 500 }
    );
  }
} 