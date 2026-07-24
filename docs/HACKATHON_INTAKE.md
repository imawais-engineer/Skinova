# YouCam Hackathon Intake

## Current Repo Status

- Project path: `/home/awais/YouCam/Skinova`
- Current state: documentation, YouCam API references, OpenAPI specs, environment example, and testing folders exist.
- Application source before this build: not implemented.
- Existing strengths: clear product vision, multiple YouCam Skin AI API docs, consumer skincare concept, and planned Next.js/TypeScript/Tailwind stack.
- Existing gap: no working web prototype, no UI, no safe API integration layer, no submission package, and no judge-ready demo flow.

## Official Hackathon Requirements

Source of truth:

- Overview: `https://youcam-api.devpost.com/`
- Rules: `https://youcam-api.devpost.com/rules`
- Resources: `https://youcam-api.devpost.com/resources`

Mandatory build requirements:

- Create a working web or mobile prototype.
- Integrate at least one Perfect Corp. YouCam API from the Skin or Fashion category.
- Demonstrate clear consumer or retail value.
- Avoid a surface-level wrapper around a single API call.
- The submitted project must run consistently on the target platform and match the demo video/text description.
- Existing projects are allowed only if significantly updated during the submission period and explained.

## Submission Requirements

- Code repository URL for judging/testing.
- Repository must include all source code, assets, and instructions required for the project to function.
- Repository must be public with relevant licensing, or private and shared with `contact_event@PerfectCorp.com`.
- Text description explaining features, functionality, and consumer or retail value.
- Project screenshots.
- 1-3 minute demo video.
- Demo video must show the end-to-end experience.
- Demo video must explain which YouCam API is used.
- Demo video must show the project functioning on the intended device/platform.
- Demo video must be publicly visible on YouTube, Vimeo, or Youku.
- Materials must be in English or include English translation.

## Judging Criteria

Official judging criteria are equally weighted in Stage Two:

- Technological Implementation: depth and skill of YouCam API integration, working non-trivial implementation, clear consumer or retail value.
- Design: complete, coherent product experience, not just a technical proof of concept.
- Potential Impact: credible, specific case for solving a real problem for a real audience.
- Quality of the Idea: creative, non-obvious use of YouCam Skin/Fashion APIs and genuine understanding of the problem space.

Stage One pass/fail:

- Reasonably fits the theme.
- Reasonably applies required APIs/SDKs.

## Compliance Risks

- Do not expose API keys in client code or public repo.
- Do not include real medical claims or diagnosis language.
- Do not use copyrighted music, trademarks, or assets without permission in the demo.
- Do not submit an app that cannot be run or tested.
- Do not claim API behavior not shown in the app.
- If the project existed before the submission period, explain the significant update clearly.
- Keep YouCam API usage subject to YouCam terms.

## Missing Pieces Blocking A Winning Submission

- Working app implementation.
- Server-side YouCam API proxy/integration.
- Demo-safe mock mode when API credentials or units are unavailable.
- Dashboard-first user experience.
- End-to-end scan-to-insight-to-routine flow.
- Screenshots.
- Demo video script.
- Submission description.
- Testing instructions for judges.
- Compliance checklist.

## Recommended Winning Direction

Build Skinova as a consumer skincare intelligence companion, not a one-time skin scanner. The winning direction is:

> Skinova turns a selfie into a guided skincare action plan by combining YouCam Skin AI analysis, skin-type/tone context, explainable insights, personalized routines, progress tracking, and improvement simulation in one coherent consumer dashboard.

This direction directly targets all judging criteria:

- Technical: multiple YouCam API workflows and safe server-side integration.
- Design: complete dashboard-first product experience.
- Impact: helps users understand what their skin data means and what to do next.
- Idea quality: moves beyond one API call into a continuous skincare companion.
