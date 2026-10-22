---
title: "Spotting process hollowing with Volatility 3"
description: "Comparing pslist, psscan, and malfind output on a lab memory capture."
tags: ["memory", "volatility", "windows"]
---
A process that appears in `psscan` but not `pslist` has been unlinked from the active process list. That's the first thing to check.

```python
# quick diff of two plugin outputs
pslist = {row["PID"] for row in load("pslist.json")}
psscan = {row["PID"] for row in load("psscan.json")}
print(sorted(psscan - pslist))
```
