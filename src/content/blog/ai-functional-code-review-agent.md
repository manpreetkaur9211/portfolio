---
title: "AI Code Review That Checks What the Code Is Supposed to Do, Not How It Looks"
topic: ai-functional-code-review-agent
date: 2026-05-05
status: draft
excerpt: "Most code review catches style issues and obvious bugs. This approach gives an AI agent your functional requirements and asks: does the code actually do what it's meant to do?"
tags: ["Claude Code", "Code Review", "Real-Time Apps", "Socket.IO", "Developer Productivity"]
readTime: "6 min read"
---

## What Normal Code Review Misses

Code review is good at catching: inconsistent naming, missing error handling patterns, obvious logic bugs, style violations, missing tests.

It's less good at asking: does this code actually fulfil the requirements it was written for? Not "is the code clean" but "does the feature work end-to-end as intended?"

That's a harder question because it requires holding two things in your head simultaneously — the requirements and the implementation — and tracing every path from one to the other.

I built a Claude Code command that does exactly this. You give it a directory and a plain-English requirements statement. It gives you back a requirements coverage table and a ranked list of gaps.

## The Command

The command lives in `.claude/commands/review-functional.md`. When invoked as `/review-functional`, it spawns a Sonnet agent with a structured prompt:

```
/review-functional src/app/dashboard/boards "Users can create, list, 
and open boards. Board creation requires a non-empty name. 
Unauthenticated users are redirected to login. Multiple connected 
users should be able to view each other as active users and see 
everyone's drawing in different colors with a pointer showing their 
name's first letter."
```

The agent reads every file in the target directory (and follows imports to related context files), then produces:

1. A requirements coverage table — ✅ Full / ⚠️ Partial / ❌ Missing for each requirement
2. Severity-ranked issues — critical / high / medium / low, with file:line, problem description, and a concrete fix
3. Functional optimisations — things that would make the feature work better for users

The prompt explicitly instructs: **do not comment on code style, naming, or formatting. Only functionality, correctness, and user-facing behaviour.**

## What It Found on the Whiteboard Feature

I ran it on a collaborative whiteboard implementation. Here's the requirements coverage table it produced:

| Requirement | Status | Notes |
|---|---|---|
| Create, list, open boards | ⚠️ Partial | Functional bugs in creation; opening navigates correctly but socket join never emitted |
| Non-empty name required | ⚠️ Partial | Client validates but no submission guard — double-click creates duplicate requests |
| Unauthenticated → redirect to login | ⚠️ Partial | Race condition on auth hydration; canvas page has no guard at all |
| Multi-user: colours, drawings, cursors | ❌ Missing | None of this is implemented |

Then five critical issues. Two of them I want to highlight because they're the kind that are genuinely hard to spot in a manual review.

### Critical Bug 1: Remote Drawing Events Are Only console.log'd

```tsx
// SocketContext.tsx — the entire handler for received drawing events:
socket.on('drawing', (data) => {
  console.log('drawing received', data);
});
```

The socket receives drawing events from other users. The handler logs them and does nothing else. No stroke is ever drawn on the canvas. The feature appears to work locally (you draw, you see your strokes) but the collaborative part — seeing other people's drawings — silently does nothing.

This passed all tests because the tests were unit tests that didn't check the canvas output of received socket events.

### Critical Bug 2: Socket Payload Key Mismatch

The client emits:
```tsx
socketId?.emit('drawing', { data: { x, y }, boardId });
```

The server handler reads:
```js
socket.on('drawing', ({ boardId, message }) => {
  socket.to(boardId).emit('drawing', { message });
});
```

The key is `data` on the client and `message` on the server. Neither side errors. The server broadcasts `{ message: undefined }` to all other clients. Every collaborative drawing event is silently dropped.

This is the kind of bug that only shows up when you have two browser windows open at the same time. A unit test on either side would pass. An integration test would catch it. A requirements-driven review catches it because it asks: "does the drawing reach other users?" — and when it traces the path from emit to receive, it finds the key names don't match.

## The Output Format That Makes It Actionable

Each issue includes:

```
**[critical] src/context/SocketContext.tsx:46–53**
Problem: Received drawing events are only console.log'd. No stroke is 
ever rendered on the canvas for remote users.
Fix: Move the listener into BoardComponent where canvasRef is accessible:

  useEffect(() => {
    const handler = ({ fromX, fromY, toX, toY, color }) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
    };
    socket?.on('drawing', handler);
    return () => { socket?.off('drawing', handler); };
  }, [socket]);
```

File, line range, problem, fix with code. Not a suggestion to "consider improving error handling" — a specific location and a specific remedy.

## What Makes This Different from Linting or Standard AI Review

A linter checks code against rules. A standard "review this code" AI prompt tends to produce style observations and general best-practice suggestions.

This approach is different because:

1. **The requirements are the specification.** The agent isn't applying general knowledge of what good code looks like — it's checking whether this specific code satisfies this specific stated intent.
2. **It follows the execution path.** It reads the client emit, finds the server handler, reads what the server broadcasts, traces it to the client receive handler — the whole chain.
3. **It reports by severity.** A missing `return` statement that causes a 500 instead of a 400 is critical. A missing submission guard is medium. You fix in order.

## Limitations

The agent can't run the code. It can't open two browser windows and test real-time behaviour live. It can trace static paths and find mismatches, but a sufficiently complex runtime behaviour might need an integration test to catch.

Also: garbage in, garbage out on the requirements. Vague requirements ("the board should work well") produce vague coverage assessments. Specific requirements ("when a user submits an empty board name, the request should not be sent") produce specific, traceable checks.

## What to Try

Write down the functional requirements for one feature you built in the last month — just three to five bullet points. Then read through the code yourself and ask: "does this code actually do each of these things?" You'll likely find at least one partial implementation you didn't know was partial.

That exercise, done manually, is exactly what this agent automates. The value isn't that it's smarter — it's that it's systematic and doesn't get bored halfway through tracing a socket event chain.
