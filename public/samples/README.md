# YouCam API Playground sample faces

Front-facing selfies copied from the **YouCam Skin Analysis API Playground** samples tab. Each file is used on the Skin Scan page and has passed image validation (short side ≥ 480px).

| File | Use case |
| --- | --- |
| `youcam-clear-baseline.jpg` | Clear / even-tone baseline |
| `youcam-acne-male.jpg` | Young man with active acne |
| `youcam-acne-female-light.jpg` | Fair skin with cheek breakouts |
| `youcam-acne-female-severe.jpg` | Widespread acne and spot marks |

Re-verify after replacing any file:

```bash
YOUCAM_TEST_IMAGE_PATH=public/samples/youcam-clear-baseline.jpg npm run youcam:smoke:full
```
