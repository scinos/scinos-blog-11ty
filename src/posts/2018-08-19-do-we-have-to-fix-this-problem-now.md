---
tags:
  - opinion
  - software_engineering
description:
  Learn how to prioritize problems effectively with this post. Instead of jumping straight into finding solutions,
  consider if the problem is worth fixing, if it's the root issue, if it's urgent, and if it's best for your team to
  tackle. Ask yourself, "Do we have to fix this problem now?" to ensure you make the best use of your finite resources.
---

# Do we have to fix this problem now?

Something I’ve learned in my career is that is much more valuable to pick the wrong solution for the right problem, than
the right solution for the wrong problem.

It is very tempting to start thinking about solutions when presented with a problem. But it is more valuable to think
about the problem first, without wondering about potential solutions. In particular, thinking about the problem helps
with prioritisation, which in a world with a finite set of resources (read, engineers and time), it is critical to
achieve success.

This is a sentence that I use to think about the problem: **do we have to fix this problem now?**. Each word there focus
on a different aspect of the problem. Let me expand on that:

## “this problem”

Is very important that we fix the right problem. What we see, is it the root problem or a symptom of an underlying
problem? Is this thing caused by a different, deeper problem?

Is it even a problem? Maybe it is a conscious trade-off we made.

## “fix”

Not all problems require a fix. Some problems will fix themselves if you leave them. For example, fixing some minor
functionality in IE11 could be a waste of resources if we are going to drop support for IE11 soon.

Even if it won’t fix by itself, we still might choose to not fix it. Some fix are very complicated, and no fix is
totally risk-free. Maybe the fix requires a huge investment and the economics of the situation just doesn’t make sense.

## “we”

Even if we find the right problem, and we decide it should be fixed, it doesn’t mean we (as in, ourselves our immediate
team) have to do it. There could be someone else more qualified to do it.

A few years ago, I was assigned a relatively small issue to fix in our product’s backend. At the same time, a fellow
backend developer got assigned a frontend issue. This was for downloadable software, so we had strict deadlines: if you
fix doesn’t land master by this date, it will have to wait until the next public version that could be months down the
line. We both spent 3 days just trying to set up the environment to do our fixes, with no success. The 4th day we
decided that the situation was too stupid and we interchanged the issues. Both were fixed that same day.

Yes, we everybody want to grow and learn new things, and we want to support them. But the reality is that some bugs are
very critical (or very urgent) and they need a domain expert. If we are not that expert, we should focus our efforts on
finding and helping that expert instead.

## “now”

Ok, so we found the root problem, we decided it has to be fixed and we are the right people to do it. It doesn’t mean we
have to do it now. For everything we decide to do now, there is something else we decide to postpone (aka opportunity
cost).

If the problem is critical enough, we might choose to take some technical debt in the form of a quick workaround to
contain the problem so it doesn’t get worse, but don’t invest on a full solution right now.

---

So the next time you find something broken, something you’d like to fix, or prioritising your backlog, ask yourself: “Do
we have to fix this problem now?”
