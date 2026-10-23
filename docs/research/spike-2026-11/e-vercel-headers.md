# E: Vercel headers

Question: does a Vercel preview serve `.wasm` with `application/wasm` and a strict Content-Security-Policy (CSP) under which the spike pages still run?

`vercel.json` sets `buildCommand: pnpm spike:build`, `outputDirectory: packages/spike/dist`, `framework: null`, no `functions`, and one header on every path. `.vercelignore` leaves out `tests/`, `crates/`, `target/` and `docs/` from the upload.

## CSP

```
default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; connect-src 'self'; style-src 'self'; img-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'
```

| directive | why |
|---|---|
| `default-src 'none'` | Anything not listed below is blocked. |
| `script-src 'self' 'wasm-unsafe-eval'` | Own scripts only; `wasm-unsafe-eval` lets the page compile WebAssembly without allowing `eval`. |
| `worker-src 'self'` | Workers load from the same origin. Loosen to `blob:` only if a package spawns blob workers. |
| `connect-src 'self'` | `fetch` of `.wasm` files from the same origin; nothing can send data elsewhere. |
| `style-src 'self'`, `img-src 'self'` | Own CSS and images. |
| `form-action 'none'` | Nothing can be posted out of the page. |
| `base-uri 'none'` | Blocks injected `<base>` tags. |
| `frame-ancestors 'none'` | The app cannot be embedded. |

Loosenings so far: none. Local pages have only been run without the CSP (the local preview does not send it), so the first run under the CSP is the human step below. Record each loosening with the console error that forced it.

## Automated results

| check | result |
|---|---|
| `pnpm spike:build`, then `node tools/preview-check.mjs http://localhost:4175 --skip-csp` against the local preview | exits 0; the wasm content-type check passes for every `.wasm` in `dist` (only the save page is built until the other spike pages land) |
| same without `--skip-csp` | fails with "content-security-policy is undefined": the local preview sends no CSP, so the CSP check only applies to Vercel |

## Human steps

1. Log in once: `vercel login`. Scope is the personal scope `sayantan-work`, project name `filesense` (`vercel link --yes --scope sayantan-work --project filesense` if not linked).
2. `pnpm deploy:preview`. Copy the printed preview URL.
3. `pnpm preview:check <url>`. Record per asset `content-length` and `content-encoding` (want `br`), and any FAIL line, in a Results table.
4. `SPIKE_BASE_URL=<url> pnpm spike:test`. The pages must still run under the CSP. For each failure record the console error and the directive it points to; loosen that one directive in `vercel.json`, redeploy, and note it under "Loosenings so far".
5. If the preview URL is behind Vercel deployment protection and returns 401, disable protection for previews in the project settings, or pass a bypass token; record which.

## Results

Pending the human steps above.

verdict: pending-human
