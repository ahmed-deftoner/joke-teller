import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const inputSchema = z.object({
  topic: z
    .string()
    .optional()
    .default("surprise me")
    .describe("The topic of the joke"),
  jokeFormat: z
    .enum(["knock-knock", "dad-joke", "pun", "one-liner"])
    .optional()
    .default("knock-knock")
    .describe("The format of the joke"),
});

const outputSchema = z.object({
  joke: z.string(),
});

const tellJoke = createStep({
  id: "tell-joke",
  description: "Tells a joke based on the topic and joke format",
  inputSchema,
  outputSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent("jokeAgent");
    if (!agent) {
      throw new Error("Joke agent not found");
    }

    const prompt = `Create a ${inputData.jokeFormat} joke about "${inputData.topic}". Keep it short and funny.`;
    const response = await agent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let jokeText = "";

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      jokeText += chunk;
    }

    return {
      joke: jokeText,
    };
  },
});

const polishPunchline = createStep({
  id: "polish-punchline",
  description: "Polishes the punchline of the joke",
  inputSchema: z.object({
    joke: z.string(),
  }),
  outputSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent("jokeAgent");
    if (!agent) {
      throw new Error("Joke agent not found");
    }

    const prompt = `Polish the punchline of the joke: ${inputData.joke}`;
    const response = await agent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let jokeText = "";

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      jokeText += chunk;
    }

    return {
      joke: jokeText,
    };
  },
});

const rateJoke = createStep({
  id: "rate-joke",
  description: "Rates the joke",
  inputSchema: z.object({
    joke: z.string(),
  }),
  outputSchema: z.object({
    rating: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent("jokeAgent");
    if (!agent) {
      throw new Error("Joke agent not found");
    }

    const prompt = `Rate the joke: ${inputData.joke}`;
    const response = await agent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let ratingText = "";

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      ratingText += chunk;
    }

    return {
      rating: ratingText,
    };
  },
});

const jokeWorkflow = createWorkflow({
  id: "joke-workflow",
  inputSchema,
  outputSchema: z.object({
    rating: z.number(),
  }),
})
  .then(tellJoke)
  .then(polishPunchline)
  .then(rateJoke);

jokeWorkflow.commit();

export { jokeWorkflow };
