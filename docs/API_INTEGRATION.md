# YouCam API Integration

## Selected Track

Selected hackathon track: **FIRST TRACK - Skin AI**.

Skinova aligns with the Skin AI topic by helping a consumer understand skin analysis and decide what to do next.

## Source Documents

Local API documentation used:

- `AI_SKIN_ANALYSIS/AI_SKIN_ANALYSIS.md`
- `AI_SKIN_ANALYSIS/AI_SKIN_ANALYSIS.yaml`
- `AI_SKIN_SIMULATION/AI_SKIN_SIMULATION.md`
- `AI_FITZPATRICK_SKIN_TYPE_ANALYSIS/AI_FITZPATRICK_SKIN_TYPE_ANALYSIS.md`
- `AI_FACIAL_COLOR_TONES_ANALYZER/AI_FACIAL_COLOR_TONES_ANALYZER.md`
- `AI_FACE_ATTRIBUTES_&_RATIO_ANALYZER/AI_FACE_ATTRIBUTES_&_RATIO_ANALYZER.md`
- `AI_PHOTO_ENHANCE/ai_photo_enhance.yaml`

## Core Skin Analysis Request Flow

1. Create file metadata:

   `POST /s2s/v2.0/file/skin-analysis`

   Required payload:

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

2. Upload the binary to the presigned URL returned in `data.files[0].requests[0].url`.

3. Create the task:

   `POST /s2s/v2.0/task/skin-analysis`

   Prototype payload:

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

4. Poll the task:

   `GET /s2s/v2.0/task/skin-analysis/{task_id}`

5. Convert completed `ui_score` output into Skinova's consumer guidance model.

## Endpoint Corrections Captured

- Photo Enhance uses `/s2s/v2.0/file/enhance` and `/s2s/v2.0/task/enhance`.
- Face Attributes uses `/s2s/v2.0/file/face-attr-analysis` and `/s2s/v2.0/task/face-attr-analysis`.
- Skin Analysis SD and HD `dst_actions` must not be mixed.
- Polling is required because task execution time is not guaranteed.

## Security Boundary

- API credentials are read only on the server or local smoke-test script.
- `.env` values are never printed.
- Client code calls local API routes, not YouCam directly.
- Demo mode is enabled by default to avoid accidental unit usage.

## Real API Smoke Result

Latest sanitized metadata smoke result:

- Stage: file metadata
- Workflow: `skin-analysis`
- HTTP status: `200`
- Response status: `200`
- Upload file id present: yes
- Presigned upload URL present: yes
- Upload headers present: yes

Latest sanitized full smoke result using a temporary image outside the repo:

- Stage: poll
- Workflow: `skin-analysis`
- HTTP status: `200`
- Response status: `200`
- Task status: `success`
- Analysis output present: yes

Run again with:

```bash
npm run youcam:smoke
```

Run full flow after adding `Testing/INPUT/selfie.jpg`, `.jpeg`, or `.png`:

```bash
npm run youcam:smoke:full
```

Or with a temporary remote image:

```bash
YOUCAM_TEST_IMAGE_URL=https://example.com/front-facing-selfie.jpg npm run youcam:smoke:full
```

Or with a temporary local image outside the repo:

```bash
YOUCAM_TEST_IMAGE_PATH=/tmp/front-facing-selfie.jpg npm run youcam:smoke:full
```
