# AI Face Attributes & Ratio Analyzer

# Overview

The AI Face Attributes & Ratio Analyzer examines face structure, identifying features like face, eye, eyebrow, lip, nose, cheekbone shapes, designed to provide personalized recommendations.

## Integration Guide

- How to Take Photos for AI Face Attributes & Ratio Analyzer

- Take a selfie facing forward

  - Just one clear photo, looking straight into the camera. It is best to let your hair fall naturally, with your entire face visible and nothing covering it. Brush your hair back to reveal your f[...]  - Instead, use the JS Camera Kit to take the photo. Follow the automatic face alignment, lighting guidance, and face size detection to ensure the photo meets the required standards for processin[...]
- How to Detect Skin Concerns by AI


1. **Resize your source image**

    Resize your photo to fit the supported dimensions. See details in **[File Specs & Errors](https://docs.perfectcorp.com/reference/ai_face_analyzer#section/overview/File-Specs-and-Errors)**

2. **Upload file using the File API**

    Using the _**v2.0/file/face-attr-analysis**_ API to upload a target user image.

   - Image Requirements

     - See details in **[File Specs & Errors](https://docs.perfectcorp.com/reference/ai_face_analyzer#section/overview/File-Specs-and-Errors)**.
   - _**Important**_: Simply calling the File API does not upload your file. You must **manually upload** the file to the **URL provided in the File API response**. That URL is your upload destina[...]

     Before calling the AI API, ensure your file has been successfully uploaded. Use the File API to retrieve an upload URL, then upload your file to that location. Once the upload is complete, y[...]


     > **Warning:** Please note that, you will get an 500 Server Error / unknown\_internal\_error or 404 Not Found error when using AI APIs if you do not upload the file to the URL provided in the[...]
3. **Run an AI Face Attributes & Ratio Analyzer task**

    Once the upload is complete, you can select multiple face attributes to analyze using your file ID. Please refer to the **[Inputs & Outputs](https://docs.perfectcorp.com/reference/ai_face_anal[...]

    Subsequently, calling POST 'task/face-attr-analysis' with the File ID executes the enhance task and obtains a _**task\_id**_.

4. **Polling to check the status of a task until it succeed or error**

    This _**task\_id**_ is used to monitor the task's status through polling GET 'task/face-attr-analysis' to retrieve the current engine status. Until the engine completes the task, the status wi[...]

**Warning:** Please note that, **Polling** to check the status of a task based on it's retention period is mandotary. A task will be timed out if there is no polling request within the retention p[...]


> **Warning:** You will get a _**InvalidTaskId**_ error once you check the status of a timed out task. So, once you run an AI task, you need to **polling** to check the status within the retention[...]

5. **Get the result of an AI task once success**

    The task will change to the 'success' status after the engine successfully processes your input file and generates the resulting image. You will get an url of the processed image and a dst\_id[...]

    When deducting units, the system will prioritize those nearing expiration. If the expiration date is the same, it will deduct the units obtained on the earliest date.


- Real-world examples: ![](https://plugins-media.makeupar.com/smb/blog/post/2025-01-15/10a4b980-f571-4d08-8f5d-e3ed48db77aa.jpg)

## Inputs & Outputs

- Face Attributes: ![](https://bcw-media.s3.ap-northeast-1.amazonaws.com/img_Face_Ratio_sec_01_01_enu_79380baa14.jpg)

| **Category** | **Subcategory** | **Request Parameter** | **Result Parameter** | **Result Types** |
| --- | --- | --- | --- | --- |
| **FACE** | Face Shape | `faceShape` | `faceshape` | Triangle, Diamond, Heart, InvTriangle, Oblong, Oval, Round, Square, Unknown |
| **AGE & GENDER** | Age | `age` | `agegender.age` | integer |
|  | Gender | `gender` | `agegender.gender` | female, male, unknown |
| **EYES** | Eye Shape | `eyeShape` | `eyelid.left_shape`, `eyelid.right_shape` | Narrow, Round, Almond |
|  | Eye Size | `eyeSize` | `eyelid.size` | Big, Small, Average |
|  | Eye Angle | `eyeAngle` | `eyelid.left_angle`, `eyelid.right_angle` | Downturned, Upturned, Average |
|  | Eye Distance | `eyeDistance` | `eyelid.setting` | Close-set, Wide-Set, Average |
|  | Eyelid | `eyelid` | `eyelid.left_eyelid`, `eyelid.right_eyelid` | Hooded-lid, Single-lid, Double-lid, Deep-Set |
| **BROWS** | Eyebrow Shape | `eyebrowShape` | `eyebrow.left_shape`, `eyebrow.right_shape` | Hard Angled, Soft Angled, Straight, Rounded, Obscured |
|  | Eyebrow Thickness | `eyebrowThickness` | `eyebrow.left_body_thickness`, `eyebrow.right_body_thickness` | Dense, Sparse, Average, Unknown |
|  | Eyebrow Distance | `eyebrowDistance` | `eyebrow.gap` | Far-Apart, Close, Average |
|  | Eyebrow Shortness | `eyebrowShortness` | `eyebrow.left_shortness`, `eyebrow.right_shortness` | Short, Normal |
| **LIPS** | Lip Shape | `lipShape` | `lipshape[]` | Bow, Downturned, Full, Heavy Lower Lip, Heavy Upper Lip, Narrow, Round, Thin, Wide, Average |
| **NOSE** | Nose Width | `noseWidth` | `nose.width` | Narrow, Broad, Average |
|  | Nose Length | `noseLength` | `nose.length` | Long, Short, Average |
| **CHEEKBONES** | Cheekbones | `cheekbones` | `cheekbone.left`, `cheekbone.right`, `cheekbone.overrall` | Flat Cheekbone, High Cheekbone, Low Cheekbone, Round Cheeks |

* * *

- Face Ratios: ![](https://bcw-media.s3.ap-northeast-1.amazonaws.com/img_Face_Ratio_sec_01_03_2fe8f06b92.jpg)

| **Subcategory** | **Request Parameter** | **Result Parameter** | **Result Types** | **Description** |
| --- | --- | --- | --- | --- |
| Horizontal Third Ratio | `horizontalThird` | `horizontal_third` | Three-section percentages; Interpretation: Short / Balanced / Long; Golden Ratio: 33% : 33% : 33% | The Face Horizontal Ratio is[...]
| Vertical Fifth Ratio | `verticalFifth` | `vertical_fifth` | Five-section percentages; Interpretation (Eye Distance & Eye Width): Narrow / Balanced / Wide; Golden Ratio: 20% : 20% : 20% : 20% : 2[...]
| Face Aspect Ratio | `faceAspectRatio` | `face_aspect_ratio` | `[1, r]`; Interpretation: Short / Balanced / Long; Golden Ratio: 1 : 1.46 | The Face Aspect Ratio is the relationship between the wi[...]
| Eye Aspect Ratio | `eyeAspectRatio` | `left_eye_aspect_ratio``right_eye_aspect_ratio` | `[1, r]`; Interpretation: Round / Balanced / Flat; Golden Ratio: 1 : 3 | The Eye Aspect Ratio is the relat[...]
|  |  |  |  |  |
| Eyebrow Arch Ratio | `eyebrowArch` | `left_eyebrow_arch_to_eyebrow_width``right_eyebrow_arch_to_eyebrow_width` | `[1, r]`; Interpretation: Short Arch / Balanced / Long Arch; Golden Ratio: 1 : 1.[...]
| Eye Height to Eyebrow Distance | `eyeHeightToEyebrowDistance` | `left_eye_height_to_eyebrow_distance``right_eye_height_to_eyebrow_distance``overall_eye_height_to_eyebrow_distance` | `[1, r]`; In[...]
| Nose Aspect Ratio | `noseAspectRatio` | `nose_aspect_ratio` | `[1, r]`; Interpretation: Wide / Balanced / Narrow; Golden Ratio: 1 : 1.618 | The Nose Aspect Ratio is the relationship between the [..]
| Nose Width to Mouth Width | `noseWidthToMouthWidth` | `nose_width_to_mouth_width` | `[1, r]`; Interpretation: Small / Balanced / Large; Golden Ratio: 1 : 1.618 | The Nose Width to Mouth Width ra[...]
| Nose to Lip to Chin | `noseToLipToChin` | `nose_to_lip_to_chin` | `[1, r]`; Interpretation: Short / Balanced / Long (lower face length); Golden Ratio: 1 : 1.618 | The Nose to Lip to Chin ratio i[...]
| Upper Lip to Lower Lip | `upperLipToLowerLip` | `upper_lip_to_lower_lip` | `[1, r]`; Interpretation: Full Upper / Balanced / Full Lower; Golden Ratio: 1 : 1.618 | The golden ratio of the Upper L[...]

* * *

- Suggestions for How to Shoot: ![](https://bcw-media.s3.ap-northeast-1.amazonaws.com/strapi/assets/AI_Face_Analysis_how_to_shoot_35ca9af08e.png)

> **Warning:** The width of the face needs to be greater than 60% of the width of the image.

## File Specs & Errors

- Supported Formats & Dimensions

| AI Feature | Supported Dimensions | Supported File Size | Supported Formats |
| --- | --- | --- | --- |
| AI Face Attributes & Ratio Analyzer | long side <= 4096, single person only. Images with a side longer than 1080px are automatically resized for analysis. | < 10MB | jpg/jpeg |

- Error Codes

| Error Code | Description |
| --- | --- |
| error\_below\_min\_image\_size | Source image dimensions must be at least 320 pixels. |
| error\_face\_position\_invalid | Face must be fully visible, forward-facing, and centered in the image. |
| error\_face\_position\_too\_small | Detected face is too small for analysis. |
| error\_face\_position\_out\_of\_boundary | Face extends beyond image boundaries. |
| error\_face\_not\_forward\_facing | Face must be directly facing the camera. |
| error\_face\_angle\_upward | Face is angled too far upward—slightly tilt head down. |
| error\_face\_angle\_downward | Face is angled too far downward — slightly tilt head up. |
| error\_face\_angle\_leftward | Face is turned too far left — slightly rotate head right. |
| error\_face\_angle\_rightward | Face is turned too far right — slightly rotate head left. |
| error\_face\_angle\_left\_tilt | Face is tilted too far left — gently tilt head right. |
| error\_face\_angle\_right\_tilt | Face is tilted too far right — gently tilt head left. |

- Environment & Dependency

| Sample Code Language / Tool | Recommended Runtime Versions |
| --- | --- |
| cURL | \- bash >= 3.2<br> \- curl >= 7.58 (modern TLS/HTTP support)<br> \- jq >= 1.6 (robust JSON parsing) |
| Node.js (JavaScript) | Node >= 18 (for global fetch) |
| JavaScript | \- Chrome / Edge >= 80<br> \- Firefox >= 74<br> \- Safari >= 13.1 |
| PHP | PHP >= 7.4 (for modern TLS/compat), ext-curl (recommended) or allow\_url\_fopen=On + ext-openssl, ext-json |
| Python | Python >= 3.10 (for f-strings), requests >= 2.20.0 |
| Java | Java 11+ (for HttpClient), Jackson Databind >= 2.12.0 |

* * *

## JS Camera Kit

# JavaScript Camera Kit SDK Documentation

```
version: v2.5
```

## Overview

The **JavaScript Camera Kit** provides a complete in-browser camera solution designed for high-accuracy face-based imaging tasks. It handles camera permissions, real-time face detection, automati[...]

This module is optimized for **AI-driven image analysis**, such as:

- AI Skin Analysis (SD/HD)
- AI Face Tone Analysis
- Hair-related Analysis
- Virtual Try-On (Ring, Wrist, Necklace, etc.)

### Key Features

- **Permission Handling:** Automatic management of webcam access.
- **Quality Validation:** Real-time monitoring of face position, lighting, and angle.
- **Multi-Step Flows:** Support for complex capture requirements (e.g., multi-angle hair capture).
- **Flexible Output:** Supports both `base64` and `blob` image formats.

* * *

## Installation

Include the SDK via CDN in your HTML `<head>` or before the closing `<body>` tag. Once loaded, the SDK installs a global `YMK` object.

```
<script src="https://plugins-media.makeupar.com/v2.5-camera-kit/sdk.js"></script>
```

* * *

## Quick Start Example

The following example demonstrates how to initialize the kit, open the camera, and handle captured images.

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Camera Kit Sample</title>
    <style>
      #YMK-module { margin: 20px 0; }
      img { width: 150px; margin: 5px; border: 1px solid #ccc; }
    </style>
  </head>
  <body>

    <!-- Initialization Script -->
    <script>
      // Define async init entry point
      window.YMKAsyncInit = function() {
        YMK.addEventListener('loaded', function() {
          console.log('Module fully loaded and ready');
        });

        YMK.addEventListener('faceDetectionCaptured', function(capturedResult) {
          const container = document.getElementById('captured-results');
          container.innerHTML = '';

          // Handle multiple images if returned (e.g., multi-angle capture)
          for (const item of capturedResult.images) {
            const img = document.createElement('img');
            // Handle both base64 strings and Blob objects
            img.src = typeof item.image === 'string'
              ? item.image
              : URL.createObjectURL(item.image);
            container.appendChild(img);
          }
        });
      };

      function openCameraKit() {
        YMK.init({
          faceDetectionMode: 'makeup',
          imageFormat: 'base64',
          language: 'enu'
        });
        YMK.openCameraKit();
      }
    </script>

    <!-- Load SDK -->
    <script src="https://plugins-media.makeupar.com/v2.5-camera-kit/sdk.js"></script>

    <!-- UI Elements -->
    <button onclick="openCameraKit()">Open Camera Kit</button>

    <!-- Mandatory Mount Point -->
    <div id="YMK-module"></div>

    <h3>Captured Results:</h3>
    <div id="captured-results"></div>
  </body>
</html>
```