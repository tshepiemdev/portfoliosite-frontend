import fs from "node:fs/promises";
import express from "express";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

const app = express();

let vite;

if (!isProduction) {
  const { createServer } = await import("vite");

  vite = await createServer({
    server: {
      middlewareMode: true,
    },
    appType: "custom",
    base,
  });

  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;

  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

app.use(async (req, res, next) => {
  if (req.path.includes(".") && !req.path.endsWith(".html")) {
    next();
    return;
  }

  try {
    const url = req.originalUrl.replace(base, "/");

    let template;
    let render;

    if (!isProduction) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = await fs.readFile("./dist/client/index.html", "utf-8");
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const result = await render(url);

    if (result.redirect) {
      res.redirect(302, result.redirect);
      return;
    }

    const { html: appHtml, head, hydrationData } = result;

    const inlineHydration = `<script>window.__STATIC_ROUTER_HYDRATION_DATA__ = ${JSON.stringify(
      hydrationData,
    ).replace(/</g, "\\u003c")};</script>`;

    const html = template
      .replace("<!--app-head-->", head ?? "")
      .replace("<!--app-html-->", appHtml + inlineHydration);

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`SSR dev server running at http://localhost:${port}`);
});
