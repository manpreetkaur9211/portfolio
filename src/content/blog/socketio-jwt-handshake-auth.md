---
title: "Socket.IO JWT Auth Goes in io.use() — Not in Your Event Handlers"
topic: socketio-jwt-handshake-auth
date: 2026-05-06
status: draft
excerpt: "If you're checking JWT tokens inside Socket.IO event handlers, you're verifying auth too late — and on every event. The right place is io.use(), which runs once at the handshake before the connection opens."
tags: ["Socket.IO", "JWT", "Authentication", "Node.js", "Full-stack"]
readTime: "5 min read"
---

## The Pattern That Looks Right But Isn't

When developers add JWT auth to a Socket.IO backend, the instinct is to verify the token inside event handlers:

```js
io.on('connection', (socket) => {
  socket.on('drawing', (data) => {
    const token = data.token;
    if (!verifyToken(token)) return; // reject after the fact
    // handle drawing
  });
});
```

This blocks unauthorised actions, but it has two problems:

1. The connection is already open. An unauthenticated client is connected — just getting individual events rejected.
2. You're running token verification on every single event, not once per session.

There's a better place: `io.use()`.

## What io.use() Actually Does

`io.use()` is Socket.IO's middleware layer. It runs during the handshake — before a connection is established. If the middleware calls `next(new Error(...))`, the connection is rejected entirely. The client never gets a socket.

Here's the implementation from my whiteboard app:

```js
io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Unauthorized'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('Unauthorized'));
    }
    socket.user = user.username;
    next();
  } catch (error) {
    return next(new Error('Unauthorized'));
  }
});
```

One middleware. One database lookup. One decision. Every event handler that follows can trust that `socket.user` exists — no re-verification needed.

## Why the Token Goes in the Query String

HTTP auth uses the `Authorization: Bearer <token>` header. WebSockets can't — the browser's WebSocket API doesn't support custom headers on the upgrade request.

The standard workaround is the query string:

```ts
// Client-side connection
const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  query: { token: user.token }
});
```

On the server, this is available as `socket.handshake.query.token`.

If you're not using a browser client (React Native, Node.js test client), there's a cleaner option: pass the token via the `auth` option instead:

```ts
const socket = io(url, {
  auth: { token: user.token }
});
```

Server-side: `socket.handshake.auth.token`. This is preferable when possible — query params sometimes end up in server request logs.

## Attaching User Identity to the Socket

After verifying the token, attach whatever downstream handlers need directly to the socket object:

```js
socket.user = user.username;
```

This persists for the lifetime of the connection:

```js
io.on('connection', (socket) => {
  socket.on('drawing', (data) => {
    const { boardId, ...message } = data;
    // socket.user is guaranteed — the handshake middleware verified it
    socket.to(boardId).emit('drawing', { ...message, from: socket.user });
  });
});
```

No token parsing in event handlers. No extra database calls. The handshake did the work.

## The Same Mental Model as Express Middleware

The HTTP auth middleware in the same codebase does the equivalent thing for REST requests:

```js
// src/server/middleware/auth.js
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
};

// Applied per route
app.use('/api/boards', auth, boardRoutes);
```

Same pattern: verify at the entry point, attach identity, trust it downstream. The only difference is the surface — `req.headers.authorization` for HTTP, `socket.handshake.query.token` for WebSocket.

## What to Audit in Your Codebase

If you have a Socket.IO backend:

1. Search for JWT verification inside `socket.on(...)` handlers — that logic belongs in `io.use()`
2. Check whether you're re-fetching the user on every event — if `socket.user` isn't set at the handshake, you're paying a database cost per event
3. Make sure the client passes the token on connection (`io(url, { query: { token } })`), not on every emit

The socket is a persistent connection. Authenticate once at the start, not repeatedly throughout.
