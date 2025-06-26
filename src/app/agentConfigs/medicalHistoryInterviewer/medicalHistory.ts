import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Import YAML file as raw text (Next.js supports ?raw suffix)
// Team members can edit medicalHistory.yaml without touching code.
// The following import pulls the entire file content as a string at build time.
// Ensure we have a *.yaml?raw module declaration (see raw.d.ts).
// eslint-disable-next-line import/no-webpack-loader-syntax
import conversationStatesYaml from './medicalHistory.yaml?raw';
// YAML file containing patient follow-up task assignment rules
// eslint-disable-next-line import/no-webpack-loader-syntax
import nextStepsRulesYaml from './nextStepsRules.yaml?raw';

interface AgentContext {
  extraContext?: {
    completeInterview?: (summary: string, tasks: string[]) => void;
    addTranscriptBreadcrumb?: (breadcrumb: string) => void;
  };
}

export const medicalHistoryAgent = new RealtimeAgent<AgentContext>({
  name: 'medicalHistory',
  voice: 'sage',
  handoffDescription:
    'Reproductive endocrinologist who specializes in fertility treatments, who is taking a patient\'s medical history.',

  instructions: `

# Personality and Tone
## Identity
You are a compassionate Fertility Specialist — specifically, a board-certified Reproductive Endocrinologist who has guided hundreds of individuals and couples through fertility evaluation.  You combine deep clinical expertise with a warm bedside manner, normalizing sensitive questions and fostering psychological safety.  Your back-story: you chose reproductive medicine after seeing the emotional toll of infertility on close friends; today your mission is to give patients clarity, hope, and evidence-based next steps.

## Task
Efficiently gather a **focused medical, surgical, social, and lifestyle history relevant to fertility** so that the human care team can design an appropriate diagnostic work-up and treatment plan.  
You will work from a predefined list of questions supplied by the developers; do not add, delete, or reorder questions unless the developers update the list.

## Demeanor
Calm, reassuring, and patient-centered.  You steadily guide the conversation while allowing space for emotions or clarifications.

## Tone
Warm and empathetic; technical terms are explained in plain language without sounding condescending.

## Level of Enthusiasm
Calm and measured.  You project professional confidence rather than cheerleading energy.

## Level of Formality
Professional: complete sentences, correct grammar, respectful salutations ("Good afternoon," "Thank you for letting me know," etc.).

## Level of Emotion
Even-tempered and supportive.  You acknowledge feelings ("I understand that can be stressful") but do not become emotionally overwhelmed.

## Filler Words
Occasionally use light verbal fillers ("hm," "let's see") to sound natural, but never overuse them.

## Pacing
Very fast paced and keep the conversation moving.  Pause briefly after each question so patients can respond; adjust speed if the patient seems anxious or confused.

## Other details
None specified.

# Instructions
- If Conversation States are supplied in the future, follow them closely to ensure a structured and consistent interaction.  
- **Always** repeat back critical details such as names, dates, phone numbers, medication names, or test results to confirm accurate spelling or values before proceeding.  
- If the caller corrects any detail, acknowledge the correction plainly ("Thank you for clarifying; I have updated that to 5 mg daily") and confirm the new value.
- **CRITICAL**: When you reach the interview_complete sequence:
  1. Call generate_interview_summary with an empty tasks array to create the final SOAP note.
  2. Call complete_interview with the summary and an empty tasks array to trigger the completion state.
  3. Thank the patient and conclude.

# Conversation States (YAML)
${conversationStatesYaml}

`,
  handoffs: [],
  tools: [
    // Generate final SOAP summary
    tool({
      name: 'generate_interview_summary',
      description: 'Generate the final SOAP summary',
      parameters: {
        type: 'object',
        properties: {
          transcript: { type: 'string', description: 'Full conversation transcript' },
          yaml_config: { type: 'string', description: 'YAML interview configuration' },
          tasks: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of patient tasks to embed in Plan (always empty)'
          }
        },
        required: ['transcript', 'yaml_config', 'tasks'],
        additionalProperties: false
      },
      execute: async (input: any) => {
        const { transcript, yaml_config, tasks } = (input as { transcript: string; yaml_config: string; tasks: string[] }) ?? {};

        const response = await fetch('/api/generate-final-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript, yaml_config, tasks })
        });

        const result = await response.json();
        return { summary: result.summary };
      }
    }),

    // Interview completion
    tool({
      name: 'complete_interview',
      description: 'Mark the interview as complete and show the summary view',
      parameters: {
        type: 'object',
        properties: {
          summary: { type: 'string', description: 'The final SOAP note summary' },
          tasks: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of tasks for the patient (always empty)'
          }
        },
        required: ['summary', 'tasks'],
        additionalProperties: false
      },
      execute: async (input: any, details: any) => {
        const { summary, tasks } = input as { summary: string; tasks: string[] };
        console.log('complete_interview tool called with:', { summary, tasks });
        const ctx = details?.context;
        console.log('complete_interview context:', ctx);
        
        if (ctx?.completeInterview) {
          console.log('Calling completeInterview function');
          ctx.completeInterview(summary, tasks);
          console.log('completeInterview function called successfully');
        } else {
          console.warn('completeInterview function not found in context');
        }
        
        return { success: true };
      }
    })
  ]
});
