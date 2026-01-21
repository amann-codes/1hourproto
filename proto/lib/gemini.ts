"use server"

import { DiagnosticResult } from "@/lib/types";

const SYSTEM_PROMPT = `
Extract data from the RESUME PDF. 
Target Role: {targetRole}

OUTPUT MUST BE VALID JSON ONLY. NO EMOJIS. NO MOTIVATIONAL LANGUAGE.
NO CONDITIONAL LANGUAGE (if, may, suggests, appears).
NO HIRING PANEL TONE.

REQUIRED JSON SCHEMA:
{
  "effectiveLevel": "Level — one-phrase justification",
  "blockingGaps": ["GAP NAME: what is missing -> concrete action to fix"],
  "upgradePlan": ["Day X-Y: specific task with observable artifact output"],
  "ignoreList": ["item to stop doing that contradicts common advice"]
}

ANALYSIS RULES:
- Gaps: Max 5. Action must result in a new artifact (repo, docs, metrics), not learning.
- Upgrade Plan: 14 days total. 5-7 items. No studying. No courses. No reading.
- Ignore List: 3-5 items. 
- Penalize missing proof. Prefer conservative level assignment.
`;

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function analyzeResumeAction(base64: string, targetRole: string): Promise<DiagnosticResult> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing server-side API configuration.");
    }

    try {
        const response = await fetch(`${API_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: SYSTEM_PROMPT.replace("{targetRole}", targetRole || "General Engineering") },
                        { inline_data: { mime_type: "application/pdf", data: base64 } }
                    ]
                }]
            })
        });

        if (!response.ok) throw new Error("Upstream API failure.");

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const cleanJson = text.replace(/```json|```/gi, "").trim();

        return JSON.parse(cleanJson) as DiagnosticResult;
    } catch (error) {
        console.error("Server Action Error:", error);
        throw new Error("Failed to process diagnostic.");
    }
}