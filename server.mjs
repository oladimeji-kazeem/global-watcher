import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Readable } from "node:stream";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, "dist", "client");
const SERVER_ENTRY = path.join(__dirname, "dist", "server", "server.js");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

let serverHandler;

async function loadServerHandler() {
  if (!fs.existsSync(SERVER_ENTRY)) {
    throw new Error(
      `Build output not found at ${SERVER_ENTRY}. Run "npm run build" first.`
    );
  }
  const mod = await import(pathToFileURL(SERVER_ENTRY).href);
  serverHandler = mod.default;
}

const server = http.createServer(async (req, res) => {
  try {
    const hostHeader = req.headers.host || "localhost";
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const fullUrl = new URL(req.url || "/", `${protocol}://${hostHeader}`);

    // 1. Try serving static client file
    const safePath = path
      .normalize(decodeURIComponent(fullUrl.pathname))
      .replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(CLIENT_DIR, safePath);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.statusCode = 200;
        res.setHeader(
          "Content-Type",
          MIME_TYPES[ext] || "application/octet-stream"
        );
        res.setHeader("Content-Length", stat.size);

        if (safePath.startsWith(path.sep + "assets") || safePath.startsWith("/assets")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }

        return fs.createReadStream(filePath).pipe(res);
      }
    }

    // 2. Delegate to TanStack Start SSR & Server Functions
    if (!serverHandler) {
      await loadServerHandler();
    }

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (Array.isArray(val)) {
        for (const item of val) headers.append(key, item);
      } else if (val !== undefined) {
        headers.set(key, val);
      }
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const webRequest = new Request(fullUrl.href, {
      method: req.method,
      headers,
      body: hasBody ? Readable.toWeb(req) : null,
      duplex: hasBody ? "half" : undefined,
    });

    const webResponse = await serverHandler.fetch(webRequest, {}, {});

    res.statusCode = webResponse.status;
    webResponse.headers.forEach((val, key) => {
      // Avoid duplicate chunked transfer encoding headers
      if (key.toLowerCase() !== "transfer-encoding") {
        res.setHeader(key, val);
      }
    });

    if (webResponse.body) {
      const reader = webResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    console.error("[Server Error]", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Internal Server Error");
    }
  }
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

loadServerHandler()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`🚀 Production server running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize server handler:", err);
    process.exit(1);
  });

function shutdown() {
  console.log("Shutting down production server...");
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
