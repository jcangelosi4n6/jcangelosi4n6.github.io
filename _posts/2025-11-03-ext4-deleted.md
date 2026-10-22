---
title: "Recovering deleted files on ext4"
description: "What the journal keeps after rm, and how far extundelete gets you."
tags: ["linux", "filesystems"]
---
ext4 zeroes the block pointers in an inode on delete, so recovery leans on the journal.
