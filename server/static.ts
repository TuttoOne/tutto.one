import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { DEMO_PATH } from "./pythia-demo";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // A miss under the demo must not fall through to the SPA. The demo's headers are already on
  // the response by this point, and `default-src 'none'` renders the React app as a blank
  // page — a 404 that looks like a broken site rather than a 404.
  app.use(`${DEMO_PATH}/{*path}`, (_req, res) => {
    res.status(404).type("text/plain").send("404 Not Found");
  });

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
