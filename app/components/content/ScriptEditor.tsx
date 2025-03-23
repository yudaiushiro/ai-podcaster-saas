import { useState, useEffect } from "react";
import { PodcastScript, ScriptData } from "@/ai-podcaster/src/type";

interface ScriptEditorProps {
  script: PodcastScript | null;
  onScriptChange: (updatedScript: PodcastScript) => void;
  isEditable?: boolean;
}

export function ScriptEditor({
  script,
  onScriptChange,
  isEditable = true,
}: ScriptEditorProps) {
  const [editedScript, setEditedScript] = useState<PodcastScript | null>(script);

  useEffect(() => {
    setEditedScript(script);
  }, [script]);

  if (!editedScript) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 min-h-[300px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          スクリプトがまだ生成されていません
        </p>
      </div>
    );
  }

  const updateScriptEntry = (index: number, field: keyof ScriptData, value: string) => {
    if (!editedScript) return;

    const updatedScript = { ...editedScript };
    const updatedScriptData = [...updatedScript.script];
    updatedScriptData[index] = {
      ...updatedScriptData[index],
      [field]: value,
    };

    updatedScript.script = updatedScriptData;
    setEditedScript(updatedScript);
    onScriptChange(updatedScript);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium">スクリプト</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isEditable
            ? "テキストを編集して音声を再生成できます"
            : "スクリプトの閲覧のみ可能です"}
        </p>
      </div>

      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {editedScript.script.map((item, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 dark:border-gray-800 rounded-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-500 dark:text-gray-400">
                  {item.speaker}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {item.duration ? `${Math.round(item.duration)}秒` : ""}
                </span>
              </div>
              {isEditable ? (
                <textarea
                  value={item.text}
                  onChange={(e) =>
                    updateScriptEntry(index, "text", e.target.value)
                  }
                  rows={Math.max(2, Math.ceil(item.text.length / 50))}
                  className="w-full border border-gray-200 dark:border-gray-800 rounded-md p-2 text-sm"
                />
              ) : (
                <p className="text-sm">{item.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 