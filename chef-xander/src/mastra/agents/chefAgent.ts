import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

// Define the chef agent using the Agent class from @mastra/core/agent
export const chefAgent = new Agent({
  name: "chef-agent",
  // Instructions for the agent's role and behavior
  instructions: `You are Xander, a practical and experienced home chef. You help people cook with whatever ingredients they have available. You will receive a prompt that has been generated using the buildRecipePrompt function. You will follow the instructions of that prompt, taking into account the dietary restrictions, ingredient limitations and time restrictions.`,
  // Specifies the language model to use (in this case, a specific model from OpenAI)
  model: openai("gpt-4o-mini"),
  // Defines the handler function that will be executed when the agent receives a task
  async handler(context) {
    // Extracts input parameters from the context
    const { dietaryRestrictions, ingredientLimitations, timeLimitations, prompt } =
      context.get("input");

    // Builds the prompt for the recipe generation using the provided inputs
    const recipePrompt = buildRecipePrompt({
      dietaryRestrictions,
      ingredientLimitations,
      timeLimitations,
      prompt,
    });

    // Generates the recipe using the specified model and the built prompt
    const result = await this.model.generate({
      prompt: recipePrompt,
    });
    // Sets the generated recipe content as the 'result' in the context
    context.set("result", result.message.content);
  },
);

// Function to build the full prompt for the recipe generation model
// It takes dietary restrictions, ingredient limitations, time limitations, and a user prompt as input
// and constructs a detailed prompt for the model.

function buildRecipePrompt({
  dietaryRestrictions,
  ingredientLimitations,
  timeLimitations,
  prompt,
}: {
  dietaryRestrictions?: string;
  ingredientLimitations?: string;
  timeLimitations?: string;
  prompt: string;
}) {
  // Base prompt that sets the overall task for the model
  const basePrompt = `Generate a detailed recipe based on the following user input: ${prompt}.`;
  // Conditional prompt for dietary restrictions
  const restrictionsPrompt = dietaryRestrictions
    ? `The recipe must adhere to the following dietary restrictions: ${dietaryRestrictions}.`
    : "";
  // Conditional prompt for ingredient limitations
  const limitationsPrompt = ingredientLimitations
    ? `You must not include these ingredients in the recipe: ${ingredientLimitations}.`
    : "";
  // Conditional prompt for time limitations
  const timePrompt = timeLimitations
    ? `The total preparation and cooking time should not exceed ${timeLimitations}.`
    : "";
  // Instructions for the format of the response
  const formatInstructions = `Structure the response in Markdown format, using subheadings (##) for different sections like "Ingredients" and "Instructions," and use bullet points (-) to list ingredients and steps.`;
  // Instructions for the style of the response
  const styleInstructions = `Use a conversational style, as if you were talking to a friend.`;

  const fullPrompt = `${basePrompt} ${restrictionsPrompt} ${limitationsPrompt} ${timePrompt} ${formatInstructions} ${styleInstructions} `;

  return fullPrompt;
}
