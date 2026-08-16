# AI prompt contracts

## Skin Coach (Qwen + RAG)

Version: `skinova-coach-qwen-v2`

### Objective

Provide skincare education grounded in Skinova's curated knowledge base and the user's latest YouCam scan context. Prevent hallucination, out-of-scope answers, and generic wellness advice.

### Stack

| Layer | Implementation |
| --- | --- |
| LLM | Qwen via DashScope (`QWEN_API_KEY`, `COACH_LLM_MODEL`) |
| Embeddings | `text-embedding-v4` (same API key) |
| Knowledge | `content/knowledge/skincare.json` → Neon `knowledge_chunks` (pgvector) |
| Retrieval | Hybrid vector search + topic boost (`app/lib/rag.ts`) |

### Inputs

- `message` — user question, max 500 characters
- `analysis` — optional latest `AnalysisResult` from scan session
- Conversation history — last 6 messages from `coach_messages`

### Pipeline

1. **Scope guard** (`coach-scope.ts`) — block medical/off-topic before LLM
2. **RAG** (`rag.ts`) — embed query, vector search, merge topic chunks
3. **Qwen completion** (`coach-llm.ts`) — strict grounded system prompt
4. **Validator** (`coach-validator.ts`) — reject forbidden claims and empty generics
5. **Fallback** (`coach-fallback.ts`) — only when Qwen unavailable or API error

### Allowed topics

- Acne, redness, pores, texture, hydration, oiliness
- Morning/night routines and ingredient pairing
- Reading Skinova / YouCam scan scores
- Progress tracking and scan photo quality

### Forbidden behavior

- Medical diagnosis or prescription guidance
- Treatment guarantees
- Off-topic general knowledge
- Inventing facts not in knowledge or scan context
- Mentioning LLM providers or internal systems

### Knowledge maintenance

```bash
npm run knowledge:ingest -- --force
```

Catalog version: `2026-08-16-v2` (38 chunks). Re-run ingest after editing `content/knowledge/skincare.json`.

### Production requirements

Set on Vercel (server-side only):

```env
QWEN_API_KEY=...
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
COACH_LLM_MODEL=qwen3-max
EMBEDDING_MODEL=text-embedding-v4
EMBEDDING_DIMENSIONS=1536
DATABASE_URL=...
```

Verify: `GET /api/skinova/health` → `"coachReady": true`
