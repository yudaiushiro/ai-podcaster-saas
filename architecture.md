## 5. GraphAI 統合

### 5.1 エージェント構成

既存の GraphAI エージェントを直接参照して、Next.js アプリケーションに統合します：

```typescript
// app/actions/content.ts
import { GraphAI } from 'graphai';
import addBGMAgent from '../../ai-podcaster/src/agents/add_bgm_agent';
import ttsOpenaiAgent from '../../ai-podcaster/src/agents/tts_openai_agent';

// スクリプト生成エージェントを追加
const scriptGeneratorAgent = async ({ namedInputs }) => {
  const { text, url } = namedInputs;
  // LLM を使用してスクリプトを生成
  // ...
  return { script };
};
```

### 5.2 Server Actions との連携

GraphAI エージェントを Server Actions から呼び出し、非同期処理を管理します：

```typescript
// app/actions/content.ts
'use server'

import { createClient } from '@/lib/db/client';
import { GraphAI, GraphData } from 'graphai';
// ai-podcasterからエージェントを直接インポート
import addBGMAgent from '../../ai-podcaster/src/agents/add_bgm_agent';
import ttsOpenaiAgent from '../../ai-podcaster/src/agents/tts_openai_agent';
import combineFilesAgent from '../../ai-podcaster/src/agents/combine_files_agent';
// main.tsから参考にしたgraph_dataを使用
import { ScriptData, PodcastScript } from '../../ai-podcaster/src/type';

export async function generateAudioContent(contentId: string) {
  const supabase = createClient();
  
  // コンテンツ情報を取得
  const { data: content } = await supabase
    .from('contents')
    .select('*')
    .eq('id', contentId)
    .single();
    
  // ステータス更新
  await supabase
    .from('contents')
    .update({ status: 'processing' })
    .eq('id', contentId);
  
  try {
    // GraphAI用のグラフ定義（main.tsのgraph_dataを参考）
    const audioGenerationGraph: GraphData = {
      // ai-podcaster/src/main.tsのgraph_dataを参考に作成
      version: 0.5,
      nodes: {
        // 必要なノード定義
      }
    };
    
    // GraphAI 初期化（ai-podcasterのエージェントを直接使用）
    const graph = new GraphAI(audioGenerationGraph, {
      addBGMAgent,
      ttsOpenaiAgent,
      combineFilesAgent,
      // 他の必要なエージェント
    });
    
    // スクリプト注入
    graph.injectValue('script', content.script);
    
    // 非同期実行
    const results = await graph.run();
    
    // 結果をDBに保存
    await supabase
      .from('contents')
      .update({
        status: 'completed',
        is_audio_generated: true,
        audio_url: results.addBGM,
      })
      .eq('id', contentId);
      
    return { success: true, results };
  } catch (error) {
    // エラー処理
    await supabase
      .from('contents')
      .update({ status: 'error' })
      .eq('id', contentId);
      
    return { success: false, error };
  }
} 