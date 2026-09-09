import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { ToastProvider } from "./components/ToastContext";
import { routes } from "./routes.jsx";

export async function render(url) {
  const { query, dataRoutes } = createStaticHandler(routes);
  const request = new Request(`http://localhost${url}`);

  const context = await query(request);

  if (context instanceof Response) {
    return {
      redirect: context.headers.get("Location"),
    };
  }

  const router = createStaticRouter(dataRoutes, context);
  const helmetContext = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <ToastProvider>
          <StaticRouterProvider
            router={router}
            context={context}
            hydrate={false}
          />
        </ToastProvider>
      </HelmetProvider>
    </StrictMode>,
  );

  const { helmet } = helmetContext;

  const head = [helmet?.title, helmet?.meta, helmet?.link]
    .filter(Boolean)
    .map((x) => x.toString())
    .join("");

  return {
    html,
    head,
    hydrationData: {
      loaderData: context.loaderData,
      actionData: context.actionData,
      errors: context.errors,
    },
  };
}
