# Demo scan samples

YouCam-verified front-facing selfies for the **Skin Scan** page. Each file has passed a live `youcam:smoke:full` run.

| File | Use case |
| --- | --- |
| `live-selfie-clear.jpg` | Clear, even complexion baseline |
| `live-selfie-acne.jpg` | Active acne and redness |
| `live-selfie-tight.jpg` | Close-up framing (face fills frame) |
| `live-selfie-2.jpg` | Texture and pore detail |

Re-verify after replacing any file:

```bash
YOUCAM_TEST_IMAGE_PATH=public/samples/live-selfie-clear.jpg npm run youcam:smoke:full
```
