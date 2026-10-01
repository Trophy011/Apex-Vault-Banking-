import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI, ThinkingLevel} from '@google/genai';

dotenv.config();

function adminAiPlugin(): Plugin {
  return {
    name: 'admin-ai-backend-plugin',
    configureServer(server) {
      server.middlewares.use('/api/admin/ai-command', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const parsed = JSON.parse(body || '{}');
            const { command, systemContext } = parsed;

            if (!command) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Command prompt is required' }));
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server' }));
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const systemPrompt = `You are the Supreme AI Banking Operating Intelligence for Apex Online Banking Executive Management.
You have omnipotent authority to analyze bank states, enforce compliance, assist the Bank Operator, and generate machine-executable commands.
The Bank Operator manages a $10 Billion USD Central Treasury reserve.

CURRENT BANK REAL-TIME CONTEXT:
${JSON.stringify(systemContext || {}, null, 2)}

INSTRUCTIONS:
1. Deeply analyze the operator's command and the current bank status.
2. Determine if the operator wants to:
   - Fund a customer (actionType: "fund_customer", provide targetIdentifier [account or email], amount in USD, message)
   - Lock a customer account (actionType: "lock_account", targetIdentifier, message)
   - Unlock a customer account (actionType: "unlock_account", targetIdentifier)
   - Restrict transfers (actionType: "restrict_transfers", targetIdentifier, message)
   - Unrestrict transfers (actionType: "unrestrict_transfers", targetIdentifier)
   - Post a warning/compliance alert to customer portal (actionType: "warning_message", targetIdentifier, message)
   - Reverse a transaction (actionType: "reverse_transaction", targetIdentifier [transaction ID], message)
   - Provide financial intelligence / audit / system advice (actionType: "system_audit", details)
3. You MUST respond with pure JSON only (no markdown quotes, no triple backticks) matching this structure:
{
  "explanation": "Clear, professional executive explanation of the analysis and action",
  "proposedAction": {
    "actionType": "fund_customer" | "lock_account" | "unlock_account" | "restrict_transfers" | "unrestrict_transfers" | "warning_message" | "reverse_transaction" | "system_audit",
    "targetIdentifier": "email or account number or transaction ID (or empty if audit)",
    "amount": 50000 (number, only if funding),
    "message": "reason or warning message",
    "details": "detailed audit summary"
  }
}`;

            let resultText = '';
            try {
              // Primary model: gemini-3.1-pro-preview with thinkingLevel HIGH
              const response = await ai.models.generateContent({
                model: 'gemini-3.1-pro-preview',
                contents: command,
                config: {
                  systemInstruction: systemPrompt,
                  thinkingConfig: {
                    thinkingLevel: ThinkingLevel.HIGH,
                  },
                },
              });
              resultText = response.text || '';
            } catch (primaryErr) {
              console.warn('Gemini 3.1 Pro Preview thinking failed, falling back to gemini-3.8-flash:', primaryErr);
              // Fallback to gemini-3.8-flash
              const fallbackResponse = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: command,
                config: {
                  systemInstruction: systemPrompt,
                },
              });
              resultText = fallbackResponse.text || '';
            }

            // Clean JSON markdown blocks if any
            let cleanJson = resultText.trim();
            if (cleanJson.startsWith('```json')) {
              cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
            } else if (cleanJson.startsWith('```')) {
              cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
            }

            try {
              const parsedResult = JSON.parse(cleanJson);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, ...parsedResult }));
            } catch {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  explanation: cleanJson,
                  proposedAction: { actionType: 'system_audit', details: cleanJson },
                })
              );
            }
          } catch (err: any) {
            console.error('Admin AI API error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || 'Internal AI Server Error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), adminAiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
