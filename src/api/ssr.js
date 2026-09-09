import fs from "node:fs/promises";
import path from "node:path";

let templateCache;
let renderCache;

async function getTemplate() {
  if (!templateCache) {
    templateCache = await fs.readFile(
      path.join(process.cwd(), "dist/client/index.html"),
      "utf-8",
    );
  }

  return templateCache;
}

async function getRender() {
  if (!renderCache) {
    renderCache = (await import("../dist/server/entry-server.js")).render;
  }

  return renderCache;
}

export default async function handler(req, res) {
  try {
    const template = await getTemplate();
    const render = await getRender();

    const result = await render(req.url);

    if (result.redirect) {
      res.writeHead(302, {
        Location: result.redirect,
      });

      res.end();
      return;
    }

    const { html: appHtml, head, hydrationData } = result;

    const inlineHydration = `<script>window.__STATIC_ROUTER_HYDRATION_DATA__ = ${JSON.stringify(
      hydrationData,
    ).replace(/</g, "\\u003c")};</script>`;

    const html = template
      .replace("<!--app-head-->", head ?? "")
      .replace("<!--app-html-->", appHtml + inlineHydration);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
