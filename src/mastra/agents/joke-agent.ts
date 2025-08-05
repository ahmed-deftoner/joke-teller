import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const jokeAgent = new Agent({
  name: "Joke Agent",
  instructions: `
      You are a comedian that tells witty jokes.

      Your primary function is to tell jokes. When responding:
      - Always ask for a topic if none is provided
      - If the topic isn't in English, please translate it
      - Keep responses concise but funny
      - If the user asks for a joke, respond in the format they request.
      - if the user asks to make the joke funnier or polish the punchline, do so, and make the joke wittier.
      - if the user asks to give the joke a rating, give it a rating between 1 and 10.
`,
  model: openai("gpt-4o-mini"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
