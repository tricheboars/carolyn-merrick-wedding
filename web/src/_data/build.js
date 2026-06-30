// Unique per build — used to cache-bust /assets/css/style.css so Cloudflare's edge
// cache never serves a stale stylesheet after a redeploy.
module.exports = { time: Date.now() };
