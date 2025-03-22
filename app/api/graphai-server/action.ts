'use server';

// サーバーサイドの処理を行う関数
export async function processOnServer(inputText: string) {
  try {
    console.log("サーバー側で処理中:", inputText);
    
    // サーバー側での単純な処理（実際のアプリではデータベース操作などを行う）
    const processedText = inputText.toUpperCase();
    
    // 現在時刻を追加
    const result = {
      processedText: processedText,
      timestamp: new Date().toISOString(),
      serverMessage: "サーバーからの応答です"
    };
    
    console.log("処理結果:", result);
    
    // 1秒待機してサーバー処理に時間がかかることをシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, data: result };
  } catch (error) {
    console.error('サーバー処理エラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '不明なエラーが発生しました' 
    };
  }
}