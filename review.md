# Comprehensive Code Review

- **Project:** Arturo Jiménez bilingual portfolio and AI Virtual Twin
- **Review date:** 30 October 2026
- **Scope:** Application source, AI integration, security, accessibility, testing, content architecture, dependencies, and AWS Amplify deployment configuration
- **Constraint:** This is a review only. No application code was changed.

## Executive summary

The project is a strong personal-portfolio implementation with a coherent visual system, good bilingual coverage, semantic HTML, effective responsive behavior, and unusually good browser-level accessibility testing for a site of this size. The deployed application passed all 46 existing browser checks in both languages and at all tested viewport widths. TypeScript strict checking passes, and npm reported zero known vulnerabilities across production and development dependencies.

The primary concerns are in the public, billable AI path and the production hosting boundary:

1. The OpenAI key is copied into an Amplify build artifact even though AWS explicitly warns against storing secrets there.
2. The in-memory rate limiter is not reliable across serverless instances, can be bypassed or fragmented, and retains expired client entries indefinitely.

No critical issue was found, and no evidence of a committed API key or client-side key exposure was found. However, the two high-priority findings should be remediated before promoting the chat heavily or allowing significant public traffic.

### Finding summary

| Severity | Count | Summary |
|---|---:|---|
| Critical | 0 | No immediate system-compromise issue found |
| High | 2 | Secret handling in Amplify; ineffective distributed rate limiting |
| Medium | 9 | Conversation integrity, request limits, AI timeout/observability, UI race, hosting compatibility, headers, privacy, test gaps, Node reproducibility |
| Low | 5 | Configuration drift, source maintainability, SEO, project coupling, image optimization |

### Overall assessment

- **Portfolio UI:** Production-ready for a personal website.
- **AI endpoint:** Functional, but needs hardening for sustained public use.
- **Deployment:** Working today, with documented support and secret-management risks.
- **Maintainability:** Good type/data foundations, but several files are too compressed and tightly coupled.

---

## Review method and verification results

The review included manual source inspection, static checks, dependency auditing, deployed browser testing, response-header inspection, and comparison with current OpenAI and AWS documentation.

| Check | Result |
|---|---|
| `npm run typecheck` | Passed |
| Installed dependency resolution (`npm ls --depth=0`) | Passed |
| Full npm security audit | Passed: 0 known vulnerabilities |
| Production-only npm security audit | Passed: 0 known vulnerabilities |
| Deployed browser suite | Passed: 46 checks, 0 defects |
| WCAG automated checks | Passed at desktop and mobile test sizes |
| Responsive overflow checks | Passed at 320, 390, 768, and 1440 px |
| Tracked secret scan | No OpenAI key value found |
| Deployed response-header inspection | Missing recommended application security headers |
| Local production build | Failed under Node 25.6.0 after compilation; see M-9 |

The deployed test target was `https://main.d1bg4izikon4gi.amplifyapp.com`.

The local build result needs context: the project deploys with Node 22, but the review environment is Node 25.6.0. Compilation succeeded, then Next.js reported `Could not parse output from TypeScript's --showConfig.` Standalone `tsc --showConfig` and `npm run typecheck` both succeeded. This is treated as an environment/reproducibility finding rather than proof that the deployed application is broken.

---

## What the project does well

### Architecture and type safety

- TypeScript strict mode is enabled in [`tsconfig.json`](tsconfig.json#L2-L20).
- English and Spanish content share a typed `SiteContent` contract, reducing missing-field errors in [`src/lib/content.ts`](src/lib/content.ts#L21-L38).
- The AI prompt module is explicitly marked `server-only`, reducing the risk of accidentally bundling career context or prompt instructions into client code in [`src/lib/digital-twin.ts`](src/lib/digital-twin.ts#L1-L3).
- The OpenAI key is read only in a server route and is not prefixed with `NEXT_PUBLIC_`.
- The route sets `Cache-Control: no-store` for chat responses in [`route.ts`](src/app/api/digital-twin/route.ts#L16-L20).
- The Responses API call uses `store: false`, which disables saved response application state in [`route.ts`](src/app/api/digital-twin/route.ts#L80-L86).

### AI grounding and safety posture

- The prompt clearly distinguishes the AI representation from the human.
- It restricts factual claims to verified career data.
- It explicitly protects dates and employer/role relationships.
- It handles unsupported questions and prompt-injection attempts with sensible instructions.
- The browser renders model text as React text content rather than HTML. No `dangerouslySetInnerHTML` is used, so normal React escaping protects against model-generated HTML/script injection.
- GPT-6 Luna is a valid current model and supports the Responses API according to [official OpenAI model documentation](https://developers.openai.com/api/docs/models/gpt-6-luna).

### Accessibility and responsive design

- Pages use semantic elements, one primary heading, meaningful landmarks, skip navigation, and localized `lang` attributes.
- The mobile menu and Virtual Twin support Escape and focus restoration.
- The chat uses `aria-live`, `aria-busy`, a hidden label, and an alert region for errors.
- Reduced-motion preferences and print media are supported.
- The existing test suite validates WCAG 2 A/AA and 2.1 AA rules on all major routes.
- The deployed suite passed all 46 checks during this review.

### Content and UX

- The language switch preserves the current section or CV route.
- The online CV and downloadable PDFs reuse the same career data.
- External links consistently use `noopener noreferrer`.
- The visual design is distinctive and consistent across pages, breakpoints, and print.
- There are no analytics or tracking cookies in the current implementation.

### Dependency and repository hygiene

- `.env` and `.env.*` are ignored while `.env.example` remains trackable.
- No actual API key pattern was found in tracked files.
- `package-lock.json` and `npm ci` provide deterministic dependency resolution.
- npm reported zero known vulnerabilities for both runtime and development packages on the review date.

---

# Findings

## High priority

## H-1 — The OpenAI key is copied into a deployment artifact

**Evidence**

- [`amplify.yml:12`](amplify.yml#L12) writes `OPENAI_API_KEY` into `.env.production` before the Next.js build.
- The key is then packaged with the `.next` artifact declared at [`amplify.yml:14-17`](amplify.yml#L14-L17).
- AWS states that sensitive values written this way can be read by users with access to deployment artifacts and recommends not storing secrets in Amplify environment variables/artifacts. See [AWS: Making environment variables accessible to server-side runtimes](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html) and [AWS: Using environment variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html).

**Risk**

The key is not public in browser JavaScript, which is good. However, anyone or any compromised process with sufficient Amplify artifact access could recover a long-lived OpenAI credential. That credential can generate billable usage outside the site and may retain access until it is revoked.

**Remedial action**

1. Store the credential in AWS Secrets Manager or SSM Parameter Store as an encrypted secret.
2. Assign an Amplify SSR Compute role with least-privilege permission to read only that secret.
3. Load the secret in server code at runtime and cache it in module memory for the lifetime of the compute instance.
4. Alternatively, place the OpenAI call behind a small Lambda/API Gateway service that owns the secret and allow the Next.js route to call only that service.
5. Remove the `.env.production` export from `amplify.yml` after the runtime secret path is working.
6. Rotate the existing OpenAI key after migration because older deployment artifacts may still contain it.

**Acceptance criteria**

- No OpenAI key appears in build output or deployment artifacts.
- The application still returns a successful chat response after a clean Amplify deployment.
- The runtime identity can read only the one required secret.
- The previous key has been revoked.

---

## H-2 — The public AI rate limiter is ineffective in a serverless deployment

**Evidence**

- Rate state is stored in a process-local `Map` at [`route.ts:12-14`](src/app/api/digital-twin/route.ts#L12-L14).
- Client identity trusts forwarding headers at [`route.ts:23-26`](src/app/api/digital-twin/route.ts#L23-L26).
- Expired keys are only replaced when the same identifier returns; entries are never proactively removed at [`route.ts:29-38`](src/app/api/digital-twin/route.ts#L29-L38).
- The endpoint is public and each accepted request can generate billable OpenAI usage.

**Risk**

- Each Amplify compute instance has a different map, so a caller can receive a fresh allowance when routed to another instance.
- Cold starts reset all counters.
- If the forwarding header is not normalized by the trusted edge, spoofed values can create new buckets.
- If proxy headers are missing, all visitors fall into the shared `local` bucket and can block each other.
- Many unique identifiers cause the map to grow for the life of the instance, because expired entries are not deleted.
- The result is neither dependable abuse prevention nor dependable availability for legitimate visitors.

**Remedial action**

1. Move rate-limit state to a shared store such as DynamoDB with TTL, or a managed Redis-compatible service.
2. Use the client identifier provided and normalized by the trusted Amplify/CloudFront boundary; document which header is authoritative.
3. Prefer a hashed identifier and avoid retaining raw IP addresses longer than necessary.
4. Apply a second limit at AWS WAF or API Gateway so oversized or abusive traffic is rejected before invoking Next.js.
5. Return `Retry-After` with HTTP 429.
6. Add spend alerts and a hard project spend limit in the OpenAI account as a final cost-control layer.

**Acceptance criteria**

- Limits remain consistent across cold starts and multiple instances.
- Spoofing `x-forwarded-for` does not create a new allowance.
- Expired records are automatically deleted.
- Load tests verify legitimate users do not share one fallback bucket.

---

## Medium priority

## M-1 — The client can forge prior `assistant` messages

**Evidence**

- The API accepts both `user` and `assistant` roles from an untrusted request at [`route.ts:40-50`](src/app/api/digital-twin/route.ts#L40-L50).
- The complete client-provided array is forwarded directly to OpenAI at [`route.ts:80-84`](src/app/api/digital-twin/route.ts#L80-L84).
- The browser legitimately sends prior assistant responses, but a direct API caller can manufacture any assistant history.

**Risk**

An attacker can present invented text as if the model previously said it. Top-level instructions have higher authority, so this is not equivalent to modifying the system prompt, but forged assistant history can still influence subsequent answers and weaken the career-grounding guarantee. The impact is mainly answer integrity and reputational quality for the caller's own conversation.

**Remedial action**

Choose one of these patterns:

- **Simplest:** accept only `{ locale, question }` and make each answer stateless.
- **Server-owned history:** issue an opaque conversation ID and store history on the server.
- **Signed stateless history:** sign each assistant response and reject assistant turns without a valid signature.

At minimum, enforce strict role alternation, an expected starting role, and a maximum count per role. Do not rely on client claims that text came from the assistant.

---

## M-2 — Request bodies are fully parsed before size and rate checks

**Evidence**

- `request.json()` reads and parses the body at [`route.ts:53-59`](src/app/api/digital-twin/route.ts#L53-L59).
- Message and total-character validation happens afterward.
- Rate limiting also happens afterward at [`route.ts:74-76`](src/app/api/digital-twin/route.ts#L74-L76).

**Risk**

The 8,000-character conversation limit does not prevent an attacker from sending a much larger JSON body. The server must allocate and parse it before rejecting it. Platform limits reduce the maximum impact, but this still wastes compute and can be used for low-cost denial-of-service traffic.

**Remedial action**

1. Require `Content-Type: application/json`.
2. Reject requests whose trusted `Content-Length` exceeds a small limit such as 16–32 KB.
3. Enforce an equivalent hard request-body limit at CloudFront/WAF/API Gateway, because `Content-Length` alone is not sufficient for chunked or deceptive requests.
4. Perform the edge/distributed rate check before expensive parsing when the platform architecture allows it.
5. Use a strict schema validator and reject unknown properties.

---

## M-3 — OpenAI requests have no application timeout, cancellation propagation, or useful error classification

**Evidence**

- A new default OpenAI client is created for every request at [`route.ts:78-80`](src/app/api/digital-twin/route.ts#L78-L80).
- No timeout or `AbortSignal` is supplied.
- Every upstream failure becomes the same 502 response, and only `error.message` is logged at [`route.ts:91-93`](src/app/api/digital-twin/route.ts#L91-L93).

**Risk**

The current OpenAI TypeScript SDK defaults to a ten-minute timeout and retries timed-out requests twice. A visitor closing or resetting the browser chat does not automatically guarantee cancellation of the server-side OpenAI call. Slow or retried requests can consume compute and API budget. Generic logs make authentication, rate-limit, network, overload, and model errors hard to distinguish.

Official OpenAI documentation recommends classifying API errors, respecting `Retry-After`, and logging request IDs. See [OpenAI error codes](https://developers.openai.com/api/docs/guides/error-codes) and [OpenAI TypeScript SDK: timeouts, cancellation, and request IDs](https://developers.openai.com/api/reference/typescript).

**Remedial action**

1. Create one module-level OpenAI client with explicit timeout and retry policy.
2. Use a short, measured timeout appropriate for the UX, initially around 20–30 seconds.
3. Pass a cancellation signal tied to the incoming request when supported by the runtime.
4. Handle `AuthenticationError`, `RateLimitError`, `APIConnectionError`, timeout errors, and other `APIError` cases separately in server logs.
5. Log safe structured fields: timestamp, duration, locale, error class, HTTP status, OpenAI error code, and OpenAI request ID.
6. Never log the API key, prompt, full career record, or visitor message by default.
7. Return `Retry-After` for retryable 429/503 cases.

---

## M-4 — Resetting during a request can clear the pending state of a newer request

**Evidence**

- `reset()` aborts the current controller and immediately sets `pending` to false at [`digital-twin-chat.tsx:88-95`](src/components/digital-twin-chat.tsx#L88-L95).
- A visitor can then submit a new question, replacing `abortRef.current` with a new controller.
- The aborted request's `finally` always executes `setPending(false)` even when its controller is no longer current at [`digital-twin-chat.tsx:122-125`](src/components/digital-twin-chat.tsx#L122-L125).

**Risk**

In a fast reset-and-resubmit sequence, the old request can mark the UI as not pending while the new request is still active. The input and submit button can become enabled early, allowing overlapping requests and out-of-order answers.

**Remedial action**

- Only clear pending state when `abortRef.current === controller`.
- Prefer a monotonically increasing request ID or reducer so stale requests cannot update messages, errors, or pending state.
- Add a component test covering: submit → reset → immediate resubmit → first request aborts → second remains pending until completion.

---

## M-5 — The deployed framework version is outside Amplify's documented support range

**Evidence**

- The project uses Next.js 16.4.3 at [`package.json:15`](package.json#L15).
- Current AWS documentation states that Amplify Hosting Compute supports Next.js 12 through 15. See [AWS Amplify support for Next.js](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html).
- The deployed site currently works and passed all browser checks, so this is a supportability risk rather than a current outage.

**Risk**

An unsupported framework may work until a feature, build-image update, or hosting-runtime change exposes an incompatibility. AWS support may decline framework-specific help, and regressions can appear without a code change.

**Remedial action**

Choose and document one strategy:

1. **Amplify-first:** pin to the latest supported Next.js 15 release and run the complete regression suite.
2. **Next-16-first:** move to a platform that officially supports the required Next.js 16 features.
3. **Risk acceptance:** keep the current deployment temporarily, add a production smoke test after every deployment, and track AWS's Next.js 16 support status.

Do not downgrade or migrate without first checking whether any Next.js 16-specific API is used.

---

## M-6 — Recommended browser security headers are absent

**Evidence**

- [`next.config.ts`](next.config.ts#L3-L9) defines redirects but no response headers.
- A direct inspection of the deployed `/en` response during this review found no Content Security Policy, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or frame restriction.

**Risk**

The application currently has no defense-in-depth policy for framing, MIME sniffing, referer leakage, browser feature use, or script/style source restrictions. React escaping already prevents the most direct model-output XSS path, but headers protect against future mistakes and supply-chain or content-injection scenarios.

**Remedial action**

1. Add `Strict-Transport-Security` after confirming all traffic is permanently HTTPS.
2. Add `X-Content-Type-Options: nosniff`.
3. Add a conservative `Referrer-Policy`.
4. Add `Permissions-Policy` disabling unused capabilities.
5. Prevent unwanted framing with CSP `frame-ancestors 'none'` or an appropriate allowlist.
6. Develop a Content Security Policy in report-only mode first. Next.js script handling must be tested carefully; do not ship a broad policy that breaks hydration or uses unnecessary `unsafe-*` allowances.
7. Add automated assertions for the final deployed headers.

---

## M-7 — The chat disclosure does not explain third-party processing or retention

**Evidence**

- The UI states that answers are AI-generated but does not tell visitors that their questions are transmitted to OpenAI at [`digital-twin-chat.tsx:23`](src/components/digital-twin-chat.tsx#L23) and [`digital-twin-chat.tsx:41`](src/components/digital-twin-chat.tsx#L41).
- `store: false` is correctly used, but this controls saved response application state; standard API abuse-monitoring logs may still retain customer content for up to 30 days unless stronger account-level controls apply. See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).

**Risk**

Visitors may enter personal, confidential, or recruiting information without understanding that it leaves the website and is processed by a third-party AI provider. This creates privacy, trust, and potentially regulatory risk, especially for EU visitors. This review is not a legal determination.

**Remedial action**

1. Add a concise notice next to the input: questions are sent to OpenAI; do not include sensitive information.
2. Link to a privacy notice explaining purpose, data categories, provider, retention posture, contact route, and any applicable rights.
3. Confirm the OpenAI project's data-control configuration and whether EU data residency is required.
4. Obtain privacy/legal review appropriate to the site's audience and location.
5. Keep `store: false` and avoid logging visitor message content in application logs.

---

## M-8 — The core API behavior is not covered by automated tests or deployment gates

**Evidence**

- [`scripts/check-site.mjs`](scripts/check-site.mjs#L84-L110) verifies the chat panel but never posts a question to `/api/digital-twin`.
- No unit-test framework or API route test exists.
- [`amplify.yml`](amplify.yml#L4-L13) installs and builds but does not run the browser suite or separate unit tests.

**Risk**

Regressions in validation, rate limiting, environment handling, OpenAI request parameters, prompt construction, or error mapping can deploy while all current automated checks remain green. The most commercially sensitive feature is therefore the least tested feature.

**Remedial action**

1. Extract validation and rate-limit logic into testable modules.
2. Add unit tests for valid/invalid payloads, locale handling, size boundaries, status codes, and rate-limit behavior.
3. Mock the OpenAI client for deterministic route integration tests.
4. Add component tests for reset/cancellation races and out-of-order responses.
5. Maintain a small, optional live evaluation set for factual English and Spanish career answers, prompt injection, unknown facts, and off-topic redirection.
6. Run typecheck, unit tests, build, and browser smoke tests in CI before deployment.
7. Keep live OpenAI tests out of untrusted pull requests and protect their credentials.

---

## M-9 — The Node.js version policy is not reproducible locally

**Evidence**

- Amplify explicitly installs and uses Node 22 at [`amplify.yml:6-8`](amplify.yml#L6-L8).
- The README says Node 22 "or newer" at [`README.md:7`](README.md#L7).
- `package.json` has no `engines` field and the repository has no `.nvmrc`.
- In this review environment, Node 25.6.0 compiled the project but `next build` failed while Next.js parsed TypeScript configuration. TypeScript itself passed.

**Risk**

Contributors can use a newer Node version that satisfies the README but does not reproduce production behavior. This creates confusing local failures and weakens the value of build verification.

**Remedial action**

1. Pin Node 22 consistently using `.nvmrc`, `.node-version`, Volta, or the team's chosen tool.
2. Add a `package.json` engine such as `"node": "22.x"` if that is the supported baseline.
3. Change README wording from "22 or newer" to the exact supported range.
4. Make CI use the same Node 22 minor line as Amplify.
5. Revisit the pin deliberately when upgrading Next.js or the hosting runtime.

---

## Low priority

## L-1 — AI and profile configuration is duplicated across multiple files

**Evidence**

- The model ID is hard-coded in [`route.ts:81`](src/app/api/digital-twin/route.ts#L81).
- The display name is hard-coded in [`digital-twin-chat.tsx:172`](src/components/digital-twin-chat.tsx#L172).
- The browser test also hard-codes the name at [`check-site.mjs:94`](scripts/check-site.mjs#L94).
- The CV summary and phone are embedded directly in [`cv/page.tsx:32-55`](src/app/[lang]/cv/page.tsx#L32-L55) instead of the typed profile/content source.

**Risk**

Routine changes can leave UI labels, tests, documentation, prompts, and runtime configuration out of sync.

**Remedial action**

- Create a non-secret, typed AI configuration module for model ID, display name, limits, and versioned prompt metadata.
- Move CV contact and summary data into the typed localized content source.
- Have tests import safe shared constants where appropriate, while retaining at least one end-to-end assertion against rendered user-facing text.

---

## L-2 — Several source files are overly compressed and there is no lint/format gate

**Evidence**

- `src/app/globals.css` is approximately 39 KB but only 59 physical lines.
- `src/app/[lang]/page.tsx` is approximately 13.6 KB but only 91 physical lines, with entire sections on single lines.
- `package.json` has no `lint` or formatting script.

**Risk**

Dense files are harder to review, debug, merge, and maintain. They also make line-level diagnostics less useful and increase the chance of accidental edits in unrelated sections.

**Remedial action**

- Add ESLint with the relevant Next.js/React rules.
- Add Prettier or another agreed formatter and commit formatted source.
- Split the home page into focused server components such as `Hero`, `Expertise`, `ProjectGrid`, `CareerTimeline`, `Hobbies`, and `Contact`.
- Split CSS into design tokens, layout, portfolio components, CV/print, and chat modules, or use CSS Modules for component-local rules.
- Enforce lint and formatting in CI.

---

## L-3 — International SEO metadata is incomplete

**Evidence**

- Localized title, description, Open Graph locale, and robots metadata are present at [`layout.tsx:22-27`](src/app/[lang]/layout.tsx#L22-L27).
- No canonical URLs or `alternates.languages` are defined.
- No `sitemap.ts` or `robots.ts` exists.
- No explicit Open Graph image is configured.

**Risk**

Search engines may have less help understanding the relationship between equivalent English and Spanish pages. Social previews may be less consistent than the visual site.

**Remedial action**

- Set `metadataBase` for the final canonical domain.
- Add canonical and `hreflang` alternates for `/en`, `/es`, and both CV pages.
- Add `sitemap.ts` and `robots.ts`.
- Add a purpose-built Open Graph image and validate previews.

---

## L-4 — Project artwork and visibility depend on array position

**Evidence**

- `ProjectArt` selects artwork by numeric index, with all indices above one falling through to Dance Tutor artwork at [`page.tsx:11-44`](src/app/[lang]/page.tsx#L11-L44).
- The page always renders only the first three projects at [`page.tsx:81`](src/app/[lang]/page.tsx#L81).
- The browser test requires exactly three cards at [`check-site.mjs:144-146`](scripts/check-site.mjs#L144-L146).

**Risk**

Reordering data silently changes artwork. Adding a fourth project silently hides it and would reuse the wrong artwork if the slice were removed.

**Remedial action**

- Add a stable `slug` and `artVariant` to each project.
- Select artwork by `artVariant`, not index.
- Make the featured-project limit an explicit configuration choice.
- Update tests to validate required project slugs rather than only a fixed count.

---

## L-5 — Responsive images can be made more efficient

**Evidence**

- `public/images/athletics.png` is approximately 985 KB.
- Responsive `Image` components do not provide a `sizes` hint in [`page.tsx:64`](src/app/[lang]/page.tsx#L64), [`page.tsx:74`](src/app/[lang]/page.tsx#L74), and [`page.tsx:87`](src/app/[lang]/page.tsx#L87).

**Risk**

Next.js/Amplify image optimization reduces served cost, but absent `sizes` can cause the browser to choose a larger candidate than necessary. Large source assets also increase repository and build-transfer size.

**Remedial action**

- Convert photography to high-quality WebP or AVIF where visually acceptable.
- Add accurate `sizes` values that reflect desktop and mobile layout widths.
- Validate with Lighthouse or browser network tools at mobile and desktop sizes.
- Keep original master photography outside the deployment repository if it is not served directly.

---

# Prioritized remediation plan

## Phase 1 — Protect credentials and cost exposure

**Target:** Before significant public promotion.

1. Move `OPENAI_API_KEY` out of the Amplify artifact and into a runtime secret path.
2. Rotate the current key.
3. Add a distributed rate limiter and an AWS edge limit.
4. Add OpenAI spend alerts and a hard spend limit.
5. Reject oversized requests before JSON parsing.

**Exit criteria:** No secret in artifacts, stable cross-instance limiting, bounded request sizes, and enforced spend controls.

## Phase 2 — Make the AI endpoint operationally reliable

**Target:** Same sprint as Phase 1 if possible.

1. Add explicit OpenAI timeout, cancellation, retry, and error classification.
2. Log safe request IDs and latency.
3. Stop trusting client-authored assistant history.
4. Fix the reset/resubmit race.
5. Add API and component tests.

**Exit criteria:** Failure modes are observable, stale requests cannot corrupt UI state, and API contracts are automatically tested.

## Phase 3 — Align hosting, security, and privacy

**Target:** Next deployment-hardening sprint.

1. Decide whether to pin Next.js 15, change hosting, or explicitly accept the unsupported Next.js 16 risk.
2. Add and test browser security headers.
3. Add a chat privacy notice and privacy page after appropriate review.
4. Pin Node 22 across local development, CI, and Amplify.
5. Add deployment smoke tests.

**Exit criteria:** Supported/reviewed hosting posture, reproducible builds, documented data use, and defense-in-depth headers.

## Phase 4 — Improve maintainability and discoverability

**Target:** Backlog; complete opportunistically.

1. Format and split large source files.
2. Centralize safe AI/profile configuration.
3. Decouple project art from array index.
4. Add canonical/hreflang metadata, sitemap, robots, and Open Graph image.
5. Optimize responsive source images.

---

# Suggested test additions

## API contract tests

Add tests for:

- Invalid JSON → 400.
- Missing or empty messages → 400.
- More than ten messages → 400.
- Individual message above 1,500 characters → 400.
- Total message content above 8,000 characters → 400.
- Unsupported roles and extra properties → 400.
- Invalid locale → 400 rather than silently defaulting to English.
- Missing key → 503.
- Distributed limit exceeded → 429 plus `Retry-After`.
- Mock OpenAI success → 200 and `Cache-Control: no-store`.
- Mock authentication, rate-limit, timeout, connection, and overload failures → expected safe public responses and structured server logs.

## AI evaluation cases

Maintain a small bilingual evaluation set for:

- Current role and exact start date.
- Separation of the three Movilok role periods.
- Leadership experience without invented team sizes.
- Technologies that are and are not in the verified record.
- Unknown salary, availability, or awards.
- Prompt attempts to expose the API key or system instructions.
- Off-topic questions.
- English question on Spanish UI and Spanish question on English UI.
- A forged assistant-history attempt.

## Client race and accessibility tests

Add tests for:

- Reset while a request is pending, then immediate resubmission.
- Closing and reopening during a request.
- A stale response arriving after a new conversation starts.
- Network failure, non-JSON failure body, and timeout.
- Security headers on deployed pages.
- Keyboard-only traversal through the open chat.
- Screen-reader review in addition to automated axe checks.

---

# Additional observations

These are not defects, but they should be conscious product decisions:

- The public CV exposes an email address and telephone number. Confirm that ongoing public indexing and scraping are acceptable.
- The footer year is generated during static build; it updates only after a new build. This is acceptable for a continuously deployed site.
- The root path always redirects to English rather than negotiating browser language. This is a reasonable deterministic choice.
- The chat is intentionally non-modal (`aria-modal="false"`), so lack of focus trapping is appropriate as long as background interaction remains intended.
- `store: false` is a strong default and should remain even if conversation state is later introduced.

---

# Final recommendation

The portfolio itself is in good shape and demonstrates thoughtful design, bilingual content, accessibility, and test coverage. Keep the UI architecture, typed content model, server-only AI prompt, React text rendering, and `store: false` behavior.

Before treating the Virtual Twin as a broadly public production service, complete H-1 and H-2, then M-1 through M-4. Those changes address the greatest combination of credential risk, cost exposure, answer integrity, and operational reliability. The remaining findings can be scheduled without blocking ordinary portfolio use.

