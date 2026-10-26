import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { DEMO_PATH } from "./pythia-demo";
import { pageFor, type LoadRenderer } from "./ssr";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const shell = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
  // The server render of the public pages, built by script/build.ts. Loaded
  // on first use; a missing bundle means every page gets the plain shell.
  const bundle = path.resolve(__dirname, "server", "entry-server.mjs");
  let renderer: ReturnType<LoadRenderer> | undefined;
  const loadRenderer: LoadRenderer = () => (renderer ??= import(pathToFileURL(bundle).href));

  const sendPage = async (req: Request, res: Response) => {
    const { status, html } = await pageFor(req, shell, loadRenderer);
    res.status(status).type("html").send(html);
  };

  // express.static would answer these two itself: "/" with the bare index.html,
  // and /blog, which is also the folder of the posts' images, with a redirect.
  app.get(["/", "/blog"], sendPage);

  app.use(express.static(distPath));

  // A miss under the demo must not fall through to the SPA. The demo's headers are already on
  // the response by this point, and `default-src 'none'` renders the React app as a blank
  // page — a 404 that looks like a broken site rather than a 404.
  app.use(`${DEMO_PATH}/{*path}`, (_req, res) => {
    res.status(404).type("text/plain").send("404 Not Found");
  });

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", sendPage);
}
