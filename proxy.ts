import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["he", "en", "fr", "es"];

// Hébreu par défaut ; seule une langue choisie avec le sélecteur (cookie) est suivie, jamais celle du navigateur.
function pickLocale(req: NextRequest) {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  return saved && LOCALES.includes(saved) ? saved : "he";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|media|icon|apple-icon|og\\.jpg|robots\\.txt|sitemap\\.xml|llms\\.txt|.*\\..*).*)"],
};
