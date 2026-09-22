import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ToastProvider } from "./components/ToastContext";
import "./root.module.css";

export default function App() {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="application-name" content="tshepiem.dev" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <Meta />
        <Links />
      </head>

      <body>
        <ToastProvider>
          <Outlet />
        </ToastProvider>

        <div id="modal-root"></div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
