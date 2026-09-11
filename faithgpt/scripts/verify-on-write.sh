#!/usr/bin/env bash
# PostToolUse hook: after a file is written or edited, report any Bible
# references it contains so the agent can verify them against the real text.
#
# Opt-in. Stays silent unless the user turned on `verify_scripture_on_write`.
# Never blocks a write and never fails a tool call: every exit is 0.
set -uo pipefail

case "${CLAUDE_PLUGIN_OPTION_VERIFY_SCRIPTURE_ON_WRITE:-false}" in
  true|1|yes|on) ;;
  *) exit 0 ;;
esac

command -v node >/dev/null 2>&1 || exit 0

payload="$(cat 2>/dev/null || true)"
[ -n "$payload" ] || exit 0

# The hook payload is JSON; pull the written path out of it without jq.
file_path="$(
  printf '%s' "$payload" | node -e '
    let raw = "";
    process.stdin.on("data", (c) => (raw += c));
    process.stdin.on("end", () => {
      try {
        const ev = JSON.parse(raw);
        const input = ev.tool_input ?? ev.toolInput ?? {};
        process.stdout.write(String(input.file_path ?? input.filePath ?? input.path ?? ""));
      } catch {}
    });
  ' 2>/dev/null || true
)"

[ -n "$file_path" ] && [ -f "$file_path" ] || exit 0

found="$(node "$(dirname "$0")/detect-scripture-refs.mjs" "$file_path" 2>/dev/null || true)"
case "$found" in
  ""|*"No Bible references found."*) exit 0 ;;
esac

printf 'FaithGPT found Bible references in %s:\n%s\n\nVerify each quotation with lookup_scripture before treating this file as finished. See the scripture-integrity skill.\n' \
  "$file_path" "$found"
exit 0
