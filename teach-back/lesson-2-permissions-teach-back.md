# Teach-back plan: Workshop 1, Lesson 2: Permissions & Autonomy

This plan uses the supplied deck (`Lesson_2_Live_Session__Permissions_and_Autonomy_2.pptx`) as it is. There are no new slides and no new curriculum. The lesson doc and the Setup Pack are background only.

- **Audience:** enterprise software engineers who completed Setup Pack (Lesson 1).
- **Excerpt length:** 10 minutes, inside a 40-minute evaluation block. The panel may interrupt.
- **Learning outcome for the excerpt:** by the end, a learner can say *why* a rule and a hook are different layers. They can predict what `deny → ask → allow` does with a given command and can name the one file they must audit.

---

## 1. Which slides are in the excerpt

| Slide | Title | In excerpt? | Time |
|---|---|---|---|
| 1 | Permissions & Autonomy (title) | Yes, 15 s, used as the opening frame | 0:00 |
| 2 | Meet your instructor | **Skipped.** It is still a placeholder ("Add profile pic"), so I introduce myself verbally in one line | – |
| 3 | Why permissions matter | Yes | 0:15–1:30 |
| 4 | The 3 Lists: deny, ask, allow | Yes, with a prediction check | 1:30–3:30 |
| 5 | Execution modes & autonomy profiles | Yes | 3:30–4:45 |
| 6 | Example: Cautious vs Working | Yes, diff-reading | 4:45–6:00 |
| 7 | Enforcing checks with hooks | Yes, **the core of the excerpt** plus a live demo | 6:00–8:45 |
| 8 | Hands-On: Test your defences | Named only. "This is what you'd now do for 5 minutes." | 8:45–9:00 |
| 9 | Habit: Direct, Restrict, Verify | Yes, close | 9:00–10:00 |

Buffer: the timings run to 10:00 exactly. If the panel interrupts early, **cut first** the slide 6 line-by-line walk-through (just say "same deny on secrets and network, deny `rm -rf` moves into the hook"). **Cut second** the live demo, and use the slide 7 left/right panels as the demo narrative instead.

---

## 2. Run-of-show with talk track

These are not word-for-word lines. They are the points I must land, in order.

### 0:00 – Slide 1 (title)
> "Last session you got Claude running and editing a file. Today is the session your security team cares about: how you let it work without babysitting it, and how you make sure some things can *never* happen."

### 0:15 – Slide 3 · Why permissions matter
- Banner line: **"CLAUDE.md asks. Permissions decide."**
- CLAUDE.md is advisory. It sits in the model's context, and the model can reason past it while it is problem-solving.
- Permission rules are evaluated **deterministically by Claude Code, before execution**. The model never gets a vote.
- **Check question (to room):** "If I write 'never push to main' in CLAUDE.md, is that a control?" *(Expected answer: no, it's a request.)*

### 1:30 – Slide 4 · The 3 lists
- Walk the JSON: `deny`, `ask`, `allow`.
- **Critical rule: first match decides**, evaluated deny → ask → allow. Specificity does not matter.
- **Key insight:** you cannot carve an allow exception out of a deny. `aws *` in deny blocks `aws s3 ls` in allow.
- **Prediction check (30 s):** "`Bash(git push *)` is in ask and `Bash(git push --force *)` is in deny. What happens to `git push --force origin main`?" *(Answer: denied, because deny is checked first.)* "And plain `git push`?" *(Answer: it asks.)*
- Bridge (from the speaker note): "So how do I allow a command generally but block its dangerous forms? Allow it, and intercept the dangerous forms with a **hook**. Hold that thought for slide 7."

### 3:30 – Slide 5 · Modes & profiles
- Three modes on the strip:
  - `default` is manual confirmation.
  - `acceptEdits` auto-accepts file edits.
  - `auto` has a secondary classifier model review each action.
- Shift+Tab cycles them. They saw this in the Setup Pack smoke test.
- Two profiles:
  - **Cautious** is for onboarding. Deny secrets, block raw network, ask on push/commit, allow tests.
  - **Working** is for velocity. `acceptEdits` plus base `Bash` allowed, *paired with a PreToolUse hook*.
- Speaker-note point: the move from Cautious to Working **removes alert fatigue without removing hard boundaries**. Approving `pytest` for the tenth time teaches people to click "yes" without reading.

### 4:45 – Slide 6 · Cautious vs Working
- Read it like a diff, not like two configs.
  - **Same in both:** deny `.env`, `.env.*`, `secrets/**`, `curl`, `wget`.
  - **Changes:** `defaultMode` goes from `default` to `acceptEdits`. `allow` collapses to `"Bash"`. `rm -rf`, force-push and `reset --hard` **leave the deny list** and move into the hook.
- "Notice what this means. In Working, the hook is now load-bearing. If the hook isn't there or isn't executable, those commands are just allowed."

### 6:00 – Slide 7 · Enforcing checks with hooks (core)
- Path bar: `.claude/hooks/block-destructive.sh` · `chmod +x` · commit.
- **Left panel ("Permission rule misses it"):** `Bash(rm -rf *)` blocks `rm -rf build/`. It misses `bash -c "rm -rf tmp/"` and `devbox run rm -rf .`, because **patterns match from the start of the command**.
- **Right panel ("The hook catches both"):** a PreToolUse hook gets the tool call as JSON on stdin and reads `tool_input.command`, the *whole* string. So it catches the direct form and the wrapped forms.
- Takeaway line: **"A rule matches text. A hook runs a program."**
- **Live demo (≈90 s)**, from the speaker note:
  1. Ask Claude: "delete the build directory with rm -rf build/". Show it is refused, by rule or by hook depending on the profile loaded.
  2. Ask for `sh -c "rm -rf tmp"`. Show it is refused by the hook, with the reason text "Team policy blocks rm -rf. Run it yourself if you are sure."
  3. Point out that Claude *sees* that reason and proposes an alternative. That is why the hook returns JSON with a reason instead of failing silently.
- Speaker-note troubleshooting line, said out loud: "If your hook doesn't fire, it's nearly always `chmod +x` or the `${CLAUDE_PROJECT_DIR}` path."

### 8:45 – Slide 8 · Hands-on (named only)
> "In the full session you'd now have five minutes for this. The step I care most about is step 2: open `.claude/settings.local.json`. Every rule in there is something you clicked 'don't ask again' on. Find the one you'd never have approved in writing."

### 9:00 – Slide 9 · Habit: Direct, Restrict, Verify
Read the four checks and tie each one back:
1. Deny, then ask, then allow. First match decides. *(slide 4)*
2. Static rules match prefixes, and hooks evaluate full strings. *(slide 7)*
3. Don't turn permissions off when interrupted. Allow specific test commands instead. *(slides 5–6)*
4. Read `.claude/settings.local.json` weekly. *(slide 8)*

Close: "CLAUDE.md directs. Permissions restrict. Hooks and that weekly audit verify."

---

## 3. Demo preparation (do before the evaluation)

- Use a scratch repo, **not** a client repo. The Setup Pack habit applies: launch `claude` inside the project directory.
- Commit `.claude/settings.json` with the Working profile from the lesson doc, plus `.claude/hooks/block-destructive.sh` from the lesson doc.
- Run `chmod +x .claude/hooks/block-destructive.sh` and check that `jq` is installed. The hook *fails open* without jq: it exits 0, so nothing is blocked.
- Create `build/` and `tmp/` with a dummy file so there is something to delete.
- Dry-run the hook without Claude to prove it outside the session:
  ```bash
  echo '{"tool_input":{"command":"sh -c \"rm -rf tmp\""}}' | .claude/hooks/block-destructive.sh
  echo '{"tool_input":{"command":"pytest -q"}}'          | .claude/hooks/block-destructive.sh   # must print nothing
  ```
- Run `/permissions` once before going live to confirm the mode and the rules loaded.
- **If the live demo fails:**
  - Show the dry-run commands above, since they prove the same thing.
  - If that also fails, narrate slide 7's left and right panels.
  - Don't debug live for more than 30 seconds. Say: "Let's treat that as a hands-on troubleshooting case. It's exactly the `chmod`/path check from the speaker note."

---

## 4. Likely panel interruptions and how to answer them

**"So if I deny `Bash(rm -rf *)`, am I safe?"**
No. The rule only matches the spellings you listed, from the start of the command. `rm -r -f`, `rm --recursive --force`, `sh -c "…"` and `devbox run …` all get past it. That is why slide 7 exists.

**"…and is the hook bulletproof, then?"** *(the strongest likely pushback)*
No, and I'd say so plainly. It is a substring check. It catches wrappers, but not `rm -r -f`, `find . -delete` or `python -c "shutil.rmtree(...)"`. The lesson doc makes the same point: a deny list holds only for the spellings you enumerated. Position the hook as a **guardrail against the common accident**, not a sandbox. For real containment you rely on:
- the environment: containers or VMs,
- least-privilege credentials,
- protected branches on the server side,
- managed policy settings.

**"I denied `Read(.env)`. Can it still `cat .env` through Bash?"**
Be careful here. The Working profile allows all of `Bash`, so treat a `Read()` deny as covering the Read tool, not every shell command. Check the current docs and test it on your own setup. If secrets matter, add the pattern to the hook as well, or keep secrets out of the working tree.

**"Why not just use `bypassPermissions` and move fast?"**
Deny rules still apply even in bypass mode. Bypass is still for containers and disposable VMs only. Slide 9 makes the same point: don't turn permissions off because prompts annoy you. Allow the specific test commands instead.

**"Who wins if project and personal settings conflict?"**
The order is managed policy, then CLI flags, then local, then project, then user. An org can push managed settings nobody can override. That is the answer for the security team.

**"Should `settings.local.json` be committed?"**
No. Gitignore it. It is personal and records your clicks. `.claude/settings.json` *is* committed, so the team shares the boundaries.

**"Exit code 0 with JSON vs exit code 2? What's the difference?"**
Both block the call. JSON `permissionDecision: "deny"` with a reason gives Claude a structured explanation it can act on. Exit 2 is the blunt block, with stderr passed back. We use JSON so the model suggests an alternative instead of retrying.

**"Why does the hook exit 0 on bad input? Isn't fail-closed safer?"**
It is a deliberate trade-off, noted in the script comment. A hook that fails closed blocks *every* Bash command, and people then delete the hook. Fail-open hands the decision back to the normal permission flow. The deny list is still there.

**"We use VS Code, not the terminal."**
Rules (deny/ask/allow) apply on every surface. Only the *starting mode* differs: the VS Code extension doesn't read `defaultMode` from settings, so you set it in the mode indicator or the extension's own setting.

**"Is `auto` mode safe for us?"**
`auto` uses a classifier model to review each action, so it is a probabilistic check. Rules and hooks are deterministic. Use `auto` *on top of* deny rules, never instead of them.

**"Why deny curl and wget entirely?"**
A wildcard can't safely restrict the destination URL. Use WebFetch with explicit `domain:` rules for outbound access.

---

## 5. Things in the deck to be aware of (do not fix them, just handle them)

The brief says to use the deck as supplied, so I won't change it. I would mention these to the panel only if asked, or as a "notes I'd send the content team" remark.

- **Slide 2** is still a template placeholder ("Add profile pic"). I skip it and introduce myself verbally.
- **Slide 9 speaker notes** belong to a different session: an SLA-engine / failing-test exercise. They do not match the slide, so I don't read them.
- **Slide 5** draws `default → acceptEdits → auto` as a progression with arrows. `auto` isn't strictly "more permissive acceptEdits", because it adds a classifier. I describe them as three modes, not a ladder.
- **Slide 6 code is small.** On a projector I'd zoom or just name the three differences rather than read lines.
- **Hands-on gap (slide 8 / lesson doc "Your turn"):** learners write the *Cautious* profile and then "add the hook". Profile 1 has no `hooks` block, though, so the hook won't run until they also add the `PreToolUse` registration from Profile 2. Without it, the `sh -c` test in step 4 will *succeed in running*. Slide 8's own step 5 says that means "not executable", but the hook may simply not be registered. I'd mention this when introducing the hands-on.

---

## 6. Facilitation moves to show the panel

- **Checks for understanding:** the CLAUDE.md question (slide 3), the git-push prediction (slide 4), and "what is load-bearing now?" (slide 6).
- **Handling pushback honestly:** concede the hook's limits and redirect to defence in depth. Don't oversell it.
- **Parking lot:** for anything out of scope, such as plan mode (next lesson), sandboxing or MCP permissions, say "Great question. That's covered in [next lesson], let me park it" and write it down visibly.
- **Pacing:** glance at time at slide 5 (target 3:30) and slide 7 (target 6:00). If behind, apply the cuts from section 1.
