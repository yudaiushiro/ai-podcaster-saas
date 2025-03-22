"use server";

import { GraphAI } from "graphai";
import { openAIAgent } from "@graphai/llm_agents";
import { copyAgent } from "@graphai/vanilla";

export async function runGraphAI(inputText: string) {
  try {
    const graphData = {
      version: 0.5,
      nodes: {
        node1: {
          value: inputText,
        },
        note4: {
          agent: "copyAgent",// agentを追加
          inputs: {
            text: ":node1", // inputsとして指定
          },
          isResult: true,
        },
      },
    };

    const agents = {
      openAIAgent,
      copyAgent,
    };
    const graph = new GraphAI(graphData, agents);
    const results = await graph.run();

    // デバッグログを追加
    console.log("GraphAI results:", JSON.stringify(results, null, 2));

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("GraphAI実行エラー:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
