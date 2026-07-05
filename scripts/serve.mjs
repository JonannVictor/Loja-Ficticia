import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

createServer(async (request, response) => {
  try {
    const url = decodeURIComponent(request.url.split("?")[0]);
    const file = resolve(join(root, url === "/" ? "index.html" : url));
    if (!file.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`VivaMart local server: http://127.0.0.1:${port}`);
});
