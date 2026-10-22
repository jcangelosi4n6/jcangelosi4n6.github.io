---
title: "Building an execution timeline from Windows Prefetch"
description: "Parsing .pf files with PECmd and lining run times up against the MFT."
tags: ["windows", "timeline", "prefetch"]
toc: true
---
Prefetch files record up to eight previous run times for an executable, which makes them one of the quickest ways to show that something actually ran.

## Collecting the files

Prefetch lives in `C:\Windows\Prefetch`. From a mounted image:

```bash
mkdir -p ~/case/prefetch
cp /mnt/evidence/Windows/Prefetch/*.pf ~/case/prefetch/
sha256sum ~/case/prefetch/*.pf > ~/case/prefetch.sha256
```

{% artifact name="POWERSHELL.EXE-022A1004.pf" path="C:\Windows\Prefetch\POWERSHELL.EXE-022A1004.pf" source="WKSTN-07.E01" sha256="9f2c4e1b7d0a3c5e8f61b2d4a7c9e0f13b5d7a9c1e3f5b7d9a1c3e5f7b9d1a3c" %}
Last run 2026-09-02 03:14:07 UTC, eight prior executions. The 03:00 run falls outside working hours.
{% endartifact %}

## Parsing

| Tool | Output | Notes |
|---|---|---|
| `PECmd` | CSV | Handles Win10 compressed prefetch |
| `prefetch.py` | text | Fine for older versions |

> Run counts can be misleading if prefetch was cleared. Check the `$UsnJrnl` for deletions in the same directory.

## Next steps

Correlate each run time with `$MFT` entries for files created within a minute either side.
