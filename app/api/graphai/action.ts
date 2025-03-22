'use server';

import { GraphAI } from "graphai";
import * as agents from "@graphai/vanilla";

export async function runGraphAI(inputText: string) {
  try {
    // GraphAIのグラフ定義 - 非常にシンプルなバージョン
    const graphData = {
      version: 0.5,
      nodes: {
        node1: {
          value: inputText || "hello, GraphAI",
        },
        node2: {
          agent: "copyAgent",
          inputs: {text: ":node1"},
          isResult: true,
        },
      },
    };

    // GraphAIの初期化と実行
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