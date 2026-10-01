// Provider abstraction so the app is not permanently coupled to Groq.
export interface AIProvider {
  readonly name: string;
  available(): boolean;
  completeJSON(args: { system: string; user: string }): Promise<string>;
}

export class AIUnavailableError extends Error {
  constructor(msg = "AssetOps Intelligence is temporarily unavailable.") { super(msg); }
}

export class GroqProvider implements AIProvider {
  readonly name = "groq";
  available() { return !!process.env.GROQ_API_KEY; }
  async completeJSON({ system, user }: { system: string; user: string }) {
    const key = process.env.GROQ_API_KEY;
    if (!key) throw new AIUnavailableError();
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 30_000);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", signal: ctl.signal,
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", temperature: 0.1, response_format: { type: "json_object" },
          messages: [{ role: "system", content: system }, { role: "user", content: user }],
        }),
      });
      if (!res.ok) throw new AIUnavailableError(`AI provider returned ${res.status}`);
      const json = await res.json();
      return String(json.choices?.[0]?.message?.content ?? "");
    } catch (e) {
      if (e instanceof AIUnavailableError) throw e;
      throw new AIUnavailableError();
    } finally { clearTimeout(timer); }
  }
}

let override: AIProvider | null = null;
export const setAIProvider = (p: AIProvider | null) => { override = p; };
export const getAIProvider = (): AIProvider => override ?? new GroqProvider();
