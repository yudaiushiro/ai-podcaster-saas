'use server';

import { GraphAI } from "graphai";
import { openAIAgent } from "@graphai/llm_agents";

export async function runGraphAI(inputText: string) {
  try {
    const graphData = {
      version: 0.5,
      nodes: {
        node1: {
          value: inputText,
        },
        node2: {
          agent: "openAIAgent",
          inputs: {
            prompt: ":node1",
          },
          params: {
            model: "gpt-4o-mini-2024-07-18",
            max_tokens: 15000,
            system: "与えられた情報を分かりやすく500文字で解説して下さい"
          },
          isResult: false,
        },
        node3: {
          agent: "openAIAgent",
          inputs: {
            prompt: ":node2.content",
          },
          params: {
            model: "gpt-4o-mini-2024-07-18",
            system: "与えられた情報を二人の対話形式で分かりやすく説明して下さい"
          },
          isResult: true,
        },
      },
    };

    const agents = { openAIAgent };
    const graph = new GraphAI(graphData, agents);
    const results = await graph.run();

    return {
      success: true,
      data: results
    };

  } catch (error) {
    console.error('GraphAI実行エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
