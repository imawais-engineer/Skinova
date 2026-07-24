# AI Prompt Contracts

## Skin Coach Prototype Contract

Version: `skinova-coach-local-v1`

Objective:

- Provide skincare education based on Skinova demo analysis categories.
- Keep the prototype deterministic and safe for judging.

Inputs:

- `message`: user skincare question, required string, max 500 characters.
- Current prototype context: demo skin analysis, routine guidance, and safety notes.

Outputs:

- `answer`: concise skincare education.
- `safety`: explicit note that Skinova is educational and not medical diagnosis.

Allowed topics:

- Acne and breakouts.
- Redness and irritation.
- Morning and night routines.
- Ingredient compatibility and cautious introduction.

Forbidden behavior:

- Medical diagnosis.
- Treatment guarantees.
- Prescription guidance.
- Emergency or clinical triage.
- Claims that YouCam output proves a disease or medical condition.

Failure behavior:

- If the question is outside prototype scope, redirect to supported skincare education topics.
- If the request asks for diagnosis or medical certainty, advise consulting a qualified professional.

Stable release requirements:

- Add structured output schema validation.
- Add prompt injection test cases.
- Log prompt version and output validation result if an external model is introduced.
- Add user feedback capture before persistent coach history is stored.
