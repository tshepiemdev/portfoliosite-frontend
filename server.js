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

  app.use(compression());
}

app.use(async (req, res, next) => {
  console.log(
    "SSR REQUEST:",
    req.method,
    req.originalUrl,
    "NODE_ENV:",
    process.env.NODE_ENV,
  );

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
      .replace("<!--app-html-->", appHtml)
      .replace("<!--app-hydration-->", inlineHydration);

    res
      .status(200)
      .set({
        "Content-Type": "text/html; charset=utf-8",
      })
      .send(html);
  } catch (error) {
    vite?.ssrFixStacktrace(error);

    console.error(error.stack);

    res.status(500).end(error.stack);
  }
});

if (isProduction) {
  const sirv = (await import("sirv")).default;

  app.use(
    base,
    sirv("./dist/client", {
      extensions: [],
    }),
  );
}

export default app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`);
  });
}
