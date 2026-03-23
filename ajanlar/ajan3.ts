/**
 * AJAN 3
 *
 * Görev: (Henüz atanmadı)
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const tools: Anthropic.Tool[] = [
  // Araçlar buraya eklenecek
];

function executeTool(name: string, _input: Record<string, unknown>): string {
  // Araç mantığı buraya eklenecek
  return JSON.stringify({ error: "Henüz tanımlanmadı: " + name, input: _input });
}

export async function ajan3(girdi: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: girdi },
  ];

  while (true) {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      tools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b) => b.type === "text");
      return textBlock && textBlock.type === "text" ? textBlock.text : "";
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = response.content
      .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
      .map((tool) => ({
        type: "tool_result" as const,
        tool_use_id: tool.id,
        content: executeTool(tool.name, tool.input as Record<string, unknown>),
      }));

    if (toolResults.length === 0) break;

    messages.push({ role: "user", content: toolResults });
  }

  return "";
}

if (require.main === module) {
  const girdi = process.argv.slice(2).join(" ");
  ajan3(girdi).then(console.log).catch(console.error);
}
