
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

// Import the chefAgent definition.
import { chefAgent } from "./agents/chefAgent";

// Create a new Mastra instance with the chefAgent and logger.
const mastra = new Mastra({
  agents: { chefAgent },
  // Configuration for the logger.
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
  const input = {
    dietaryRestrictions: "vegetarian",
    ingredientLimitations: "no nuts",
    timeLimitations: "30 minutes",
    prompt: "pasta dish",
  };
  // Call the chefAgent with the specified input.
  const context = await mastra.call("chefAgent", {input});
  // Extracts the result from the context.
  const result = context.get("result");
  // Logs the result to the console.
  console.log("Result:", result);

