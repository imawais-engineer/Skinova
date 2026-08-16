# YouCam API integration

## Selected track

**Skin AI** — YouCam API Skin AI & Apparel VTO Hackathon.

Skinova aligns with the Skin AI topic by helping a consumer understand skin analysis output and decide what to do next (routine, coach, progress).

## Official documentation

Use Perfect Corp. docs as the source of truth (local vendor dumps were removed from this repo):

| Resource | URL |
| --- | --- |
| Quick start | https://docs.perfectcorp.com/develop/quick_start_guide |
| AI Skin Analysis reference | https://docs.perfectcorp.com/reference/ai_skin_analysis |
| API console (keys) | https://yce.makeupar.com/api-console/en/api-keys/ |
| Product overview | https://yce.perfectcorp.com/ai-api/products/skin-analysis-api |
| Hackathon | https://youcam-api.devpost.com/ |

Implementation in this repo uses **v2.0** endpoints on `BASE_URL` (default `https://yce-api-01.makeupar.com`).

## Core Skin Analysis request flow

1. **Create file metadata**

   `POST /s2s/v2.0/file/skin-analysis`

   ```json
   {
     "files": [
       {
         "content_type": "image/jpeg",
         "file_name": "selfie.jpg",
         "file_size": 50000
       }
     ]
   }
   ```

2. **Upload** the binary to the presigned URL in `data.files[0].requests[0].url`.

3. **Create task**

   `POST /s2s/v2.0/task/skin-analysis`

   ```json
   {
     "src_file_id": "FILE_ID_FROM_METADATA",
     "dst_actions": ["acne", "pore", "texture", "redness", "wrinkle", "oiliness", "moisture"],
     "miniserver_args": {
       "enable_mask_overlay": true
     },
     "format": "json"
   }
   ```

4. **Poll**

   `GET /s2s/v2.0/task/skin-analysis/{task_id}`

5. **Normalize** completed `ui_score` output into Skinova's `AnalysisResult` (see `app/lib/youcam.ts`).

## Skinova API surface

| Route | Purpose |
| --- | --- |
| `POST /api/skinova/scan` | Start scan (auth required) |
| `GET /api/skinova/scan-status/[taskId]` | Poll task (auth required) |
| `GET /api/skinova/health` | Landing live status |
| `POST /api/skinova/coach` | Skin Coach (auth required) |

Low-level YouCam proxy routes under `/api/youcam/*` exist for smoke tests and internal use.

## Other YouCam APIs (not in primary UI)

| API | Status in Skinova |
| --- | --- |
| AI Skin Analysis | **Integrated** — primary user flow |
| AI Skin Simulation | Library support in `youcam.ts`; Progress uses score projection |
| Fitzpatrick / skin tone / face analyzer | Stubs only, not exposed in UI |

## Security boundary

- API credentials are read only on the server or in local smoke-test scripts.
- `.env` values are never printed in logs or client bundles.
- Client code calls local API routes, not YouCam directly.
- Enable live scan mode only in environments intended to consume YouCam units.

## Smoke tests

Metadata only:

```bash
npm run youcam:smoke
```

Full upload → task → poll (with test image):

```bash
YOUCAM_TEST_IMAGE_PATH=public/samples/youcam-clear-baseline.jpg npm run youcam:smoke:full
```

Sanitized output includes HTTP status, task status, and whether analysis output is present — never keys, file IDs, or presigned URLs.

## Endpoint notes

- SD and HD `dst_actions` must not be mixed in a single request.
- Polling is required; task duration is not guaranteed.
- Photo Enhance, Face Attributes, and related APIs use different `/file/*` and `/task/*` paths — see official reference if extending Skinova.
