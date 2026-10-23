# Lessons for this repo

One line per lesson, written by the idleflow retro agent, read by the planner at the start of every run.
Prune monthly: delete anything that stopped being true, merge near-duplicates. Keep under 40 lines —
past that the planner skims and the file stops working.

Format: `- [<run-id>] <lesson>  (seen Nx)`

<!-- lessons start -->
- [20261023-135238-milestone-0-risk-spike] On pnpm 9.12.3, pass flags to a root script after `--` only when pnpm would otherwise reject them (`pnpm spike:test -- --grep x`), and without `--` when the script's own parser would see it (`pnpm corpus:generate --stress`); run each verify command once in the repo before the plan is approved.  (seen 1x)
