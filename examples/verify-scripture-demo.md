# Trying the detector in 30 seconds

No install and no account needed for this part. The detector is offline.

```bash
git clone https://github.com/canadianeagle/faithgpt-plugins
cd faithgpt-plugins

cat > /tmp/sermon.md <<'EOF'
Opening with Romans 8:28 and closing on Rev 21:4.
Illustration from 1 Cor 13:4 about patience.
Reminder: the aspect ratio for the slides is 16:9, and PR 42 is still open.
EOF

node faithgpt/scripts/detect-scripture-refs.mjs /tmp/sermon.md
```

```
/tmp/sermon.md
  line 1: Romans 8:28
  line 1: Revelation 21:4   (written as "Rev 21:4")
  line 2: 1 Corinthians 13:4   (written as "1 Cor 13:4")

3 references in 1 file.
```

The slide ratio and the pull request are ignored. Install the plugin and `/verify-scripture` takes the next step, checking whether each quotation actually matches the passage.
