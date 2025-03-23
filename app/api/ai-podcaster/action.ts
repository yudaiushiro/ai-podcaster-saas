"use server";

import { GraphAI, AgentFilterFunction } from "graphai";
import { openAIAgent } from "@graphai/llm_agents";
import { copyAgent } from "@graphai/vanilla";
import { ttsOpenaiAgent } from "@graphai/tts_openai_agent";
import { pathUtilsAgent } from "@graphai/vanilla_node_agents";
import * as agents from "@graphai/agents";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import path from "path";
import fs from "fs";
import { exec } from 'child_process';
import { promisify } from 'util';
import { spawn } from 'child_process';
const execAsync = promisify(exec);

// FFmpegのパスを設定
console.log('FFmpegのパスを設定中...');
console.log('FFmpeg path:', '/opt/homebrew/bin/ffmpeg');
console.log('FFprobe path:', '/opt/homebrew/bin/ffprobe');
ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');
ffmpeg.setFfprobePath('/opt/homebrew/bin/ffprobe');

// 音声ファイル結合関数
const combineFiles = async (inputs: { script: any }) => {
  console.log('音声ファイル結合開始');
  const { script } = inputs;
  const outputFile = path.resolve("./output/" + script.filename + ".mp3");
  console.log('出力ファイルパス:', outputFile);

  // 入力ファイルの存在確認
  for (const element of script.script) {
    const filePath = path.resolve("./scratchpad/" + element.filename + ".mp3");
    console.log('ファイル存在確認:', filePath);
    try {
      await fs.promises.access(filePath);
      console.log('ファイル存在:', filePath);
    } catch (error) {
      console.error('ファイルが存在しません:', filePath);
      throw new Error(`音声ファイルが生成されていません: ${filePath}`);
    }
  }

  // 出力ディレクトリの作成
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 入力ファイルのリストを作成
  const inputFiles = script.script.map((element: any) => {
    const filePath = path.resolve("./scratchpad/" + element.filename + ".mp3");
    console.log(`入力ファイル:`, filePath);
    return filePath;
  });

  // concatファイルを作成
  const concatFile = path.resolve("./scratchpad/concat.txt");
  const concatContent = inputFiles.map((file: string) => `file '${file}'`).join('\n');
  fs.writeFileSync(concatFile, concatContent);
  console.log('concatファイルを作成:', concatFile);

  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    console.log('FFmpegコマンドを構築中...');

    // 入力ファイルを追加
    inputFiles.forEach((file: string) => {
      console.log('入力ファイルを追加:', file);
      command.input(file);
    });

    // 出力オプションを設定
    command
      .outputOptions('-c copy')
      .output(outputFile)
      .on('start', (commandLine) => {
        console.log('FFmpegコマンド実行開始:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('FFmpeg進捗:', progress);
      })
      .on('error', (err) => {
        console.error('FFmpegエラー:', err);
        // エラー時もconcatファイルを削除
        try {
          fs.unlinkSync(concatFile);
          console.log('concatファイルを削除しました');
        } catch (e) {
          console.error('concatファイルの削除に失敗:', e);
        }
        reject(err);
      })
      .on('end', () => {
        console.log('FFmpeg処理完了');
        console.log('出力ファイル:', outputFile);
        // concatファイルを削除
        try {
          fs.unlinkSync(concatFile);
          console.log('concatファイルを削除しました');
        } catch (e) {
          console.error('concatファイルの削除に失敗:', e);
        }
        resolve(outputFile);
      });

    // コマンドを実行
    console.log('FFmpegコマンドを実行中...');
    command.run();
  });
};

// ファイルキャッシュフィルターの追加
const fileCacheAgentFilter: AgentFilterFunction = async (context, next) => {
  const { namedInputs } = context;
  const { file } = namedInputs;
  try {
    await fs.promises.access(file);
    console.log("キャッシュヒット:", file, namedInputs.text.slice(0, 10));
    return true;
  } catch (e) {
    const output = (await next(context)) as Record<string, any>;
    const buffer = output ? output["buffer"] : undefined;
    if (buffer) {
      console.log("ファイル書き込み:", file);
      await fs.promises.writeFile(file, buffer);
      return true;
    }
    console.log("キャッシュなし、バッファなし:", file);
    return false;
  }
};

const agentFilters = [
  {
    name: "fileCacheAgentFilter",
    agent: fileCacheAgentFilter,
    nodeIds: ["tts"],
  },
];

export async function runGraphAI(inputText: string) {
  console.log('GraphAI実行開始');
  console.log('入力テキスト:', inputText);
  
  try {
    const script = {
      title: "テストポッドキャスト",
      description: "これはテスト用のポッドキャストです",
      tts: "openai",
      voices: ["shimmer", "echo"],
      speakers: ["Host", "Guest"],
      speed: 1.0,
      script: [
        {
          speaker: "Host",
          text: "ハローワールド",
          duration: 0,
          filename: "test0"
        },
        {
          speaker: "Guest",
          text: "こんにちは世界",
          duration: 0,
          filename: "test1"
        }
      ],
      filename: "test",
      voicemap: {
        "Host": "shimmer",
        "Guest": "echo"
      },
      ttsAgent: "ttsOpenaiAgent"
    };

    // 既存のスクリプトとの比較
    const outputScript = path.resolve("./output/" + script.filename + ".json");
    if (fs.existsSync(outputScript)) {
      try {
        const prevData = fs.readFileSync(outputScript, "utf-8");
        const prevScript = JSON.parse(prevData);
        console.log("既存のスクリプトを検出:", prevScript.filename);
        
        script.script.forEach((element: any, index: number) => {
          if (prevScript.script && 
              prevScript.script[index] && 
              prevScript.script[index].text) {
            const prevText = prevScript.script[index].text;
            if (element.text !== prevText) {
              const filePath = path.resolve(
                "./scratchpad/" + element.filename + ".mp3"
              );
              if (fs.existsSync(filePath)) {
                console.log("ファイル削除:", element.filename);
                fs.unlinkSync(filePath);
              }
            }
          }
        });
      } catch (error) {
        console.error("既存スクリプトの読み込みエラー:", error);
      }
    }

    console.log('スクリプト設定:', JSON.stringify(script, null, 2));

    const graphData = {
      version: 0.5,
      concurrency: 8,
      nodes: {
        script: {
          value: script
        },
        map: {
          agent: "mapAgent",
          inputs: { rows: ":script.script", script: ":script" },
          graph: {
            nodes: {
              path: {
                agent: "pathUtilsAgent",
                params: { method: "resolve" },
                inputs: {
                  dirs: ["scratchpad", "${:row.filename}.mp3"]
                }
              },
              voice: {
                agent: (namedInputs: any) => {
                  const { speaker, voicemap, voice0 } = namedInputs;
                  console.log('音声選択:', { speaker, voicemap, voice0 });
                  return voicemap[speaker] ?? voice0;
                },
                inputs: {
                  speaker: ":row.speaker",
                  voicemap: ":script.voicemap",
                  voice0: ":script.voices.$0"
                }
              },
              tts: {
                agent: ":script.ttsAgent",
                inputs: {
                  text: ":row.text",
                  file: ":path.path"
                },
                params: {
                  throwError: true,
                  voice: ":voice",
                  speed: ":script.speed"
                },
                isResult: true
              }
            }
          }
        },
        combineFiles: {
          agent: combineFiles,
          inputs: { 
            map: ":map",
            script: ":script" 
          },
          isResult: true
        }
      }
    };

    console.log('GraphAIの設定完了');

    const graph = new GraphAI(graphData, {
      ...agents,
      pathUtilsAgent,
      ttsOpenaiAgent
    }, { agentFilters });

    console.log('GraphAI実行開始');
    const results = await graph.run();
    console.log('GraphAI実行完了');

    return {
      success: true,
      data: results
    };
  } catch (error) {
    console.error("GraphAI実行エラー:", error);
    console.error('エラーの詳細:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
