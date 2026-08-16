# YouCam API Playground sample faces

Front-facing selfies from the **YouCam Skin Analysis API Playground** (`skin_analysis_XX_*.png` on `plugins-media.makeupar.com`). Each passes `youcam:smoke:full`.

| File | Playground # | Use case |
| --- | --- | --- |
| `youcam-clear-baseline.jpg` | 05 | Even-tone baseline (minimal breakouts) |
| `youcam-acne-male.jpg` | 08 | Young man with cheek/jaw acne |
| `youcam-acne-female-light.jpg` | 07 | Fair skin with inflamed cheek breakouts |
| `youcam-acne-female-severe.jpg` | 09 | Widespread acne and spot marks |

Re-verify after replacing any file:

```bash
YOUCAM_TEST_IMAGE_PATH=public/samples/youcam-clear-baseline.jpg npm run youcam:smoke:full
```
