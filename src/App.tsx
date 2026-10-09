import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, House, LayoutGrid, Menu, PanelsTopLeft, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";

const CardExample = lazy(() => import("./pages/CardExample"));
const SearchExample = lazy(() => import("./pages/SearchExample"));
const Example3 = lazy(() => import("./exercise/example3"));

const examples = [
  { path: "#/example1", icon: PanelsTopLeft, title: "Exercise 1 — Deployment Card", description: "Review deployment details and advance its status." },
  { path: "#/example2", icon: Search, title: "Exercise 2 — Deployment Search", description: "Search deployments by application name." },
  { path: "#/example3", icon: LayoutGrid, title: "Exercise 3 — Deployment Queue", description: "Monitor deployments loaded from the mock API." },
];

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getHash() {
  return window.location.hash || "#/";
}

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hash = useSyncExternalStore(subscribeToHash, getHash);
  const path = hash.split("?")[0];
  const example = examples.find((item) => item.path === path);

  useEffect(() => {
    document.title = `${example?.title ?? "Home"} | Deployment Queue`;
  }, [example]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground [--background:#eceaf0] [--foreground:#292630] [--card:#ffffff] [--card-foreground:#292630] [--muted:#eceaf0] [--muted-foreground:#625d6d] [--border:#d1ccd8] [--input:#d1ccd8] [--secondary:#eceaf0] [--secondary-foreground:#625d6d] [--accent:#eceaf0] [--accent-foreground:#292630] [--primary:#65468b] [--primary-foreground:#ffffff] [--ring:#65468b]">
      <button type="button" onClick={() => document.getElementById("main-content")?.focus()}
        className="sr-only cursor-pointer focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:min-h-11 focus:rounded-md focus:bg-primary focus:px-4 focus:text-primary-foreground focus:outline-2 focus:outline-offset-2 focus:outline-primary">
        Skip to content
      </button>
      <header className="relative z-20 w-full shrink-0 border-b border-border bg-card shadow-sm"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuButtonRef.current?.focus();
          }
        }}>
      <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <a href="#/" onClick={() => setMenuOpen(false)} className="inline-flex min-h-11 items-center gap-2 rounded-md font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <LayoutGrid aria-hidden="true" className="size-5" />
          Deployment Queue
        </a>
        <Button ref={menuButtonRef} type="button" variant="outline"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen} aria-controls="exercise-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="size-11 shrink-0 rounded-xl border-border bg-card text-primary duration-150 motion-safe:enabled:active:scale-[0.98] motion-reduce:transition-none">
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>
      <nav id="exercise-navigation" aria-label="Exercise navigation"
        className={`${menuOpen ? "flex" : "hidden"} mt-3 max-h-[40dvh] flex-col gap-1 overflow-y-auto md:mt-0 md:flex md:max-h-none md:flex-row md:flex-wrap md:gap-3 md:overflow-visible`}>
        {[{ path: "#/", title: "Home", icon: House }, ...examples].map((item) => (
          <a key={item.path} href={item.path} aria-label={item.title} aria-current={path === item.path ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65468b] aria-[current=page]:bg-muted aria-[current=page]:text-primary aria-[current=page]:font-semibold motion-reduce:transition-none">
            <item.icon aria-hidden="true" className="size-4 shrink-0" />
            <span className="md:hidden lg:inline">{item.title}</span>
            <span className="hidden md:inline lg:hidden">{item.title.split(" — ").at(-1)}</span>
          </a>
        ))}
      </nav>
      </div>
      </header>
      <div key={path} className="min-h-0 flex-1 overflow-y-auto">
      <div className="mb-4 border-b border-[#44404f] bg-[#30283f] text-[#f0ede8]">
      <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6 lg:px-8">
        <h1 className="text-lg leading-snug font-semibold tracking-tight sm:text-xl">{example?.title ?? (path === "#/" ? "Deployment Queue Exercises" : "Page not found")}</h1>
        <p className="mt-1 text-sm leading-relaxed text-[#f0ede8]/75">{example?.description ?? "Choose an exercise to explore its implementation."}</p>
      </div>
      </div>
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-screen-2xl px-4 pb-8 outline-none duration-200 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 sm:px-6 lg:px-8">
      {path === "#/" && (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {examples.map((item) => (
            <li key={item.path}>
              <Card className="h-full rounded-xl bg-card shadow-sm ring-border/80 transition-shadow duration-150 focus-within:ring-primary/50 motion-reduce:transition-none">
                <CardHeader className="gap-4">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-primary">
                    <item.icon aria-hidden="true" className="size-5" />
                  </span>
                  <CardTitle><h2 className="text-lg font-semibold">{item.title}</h2></CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <a href={item.path} aria-label={`Open ${item.title}`} className="group mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-2 font-medium text-primary transition-colors duration-150 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                    Open exercise
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform duration-150 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:translate-x-0.5 motion-reduce:transition-none" />
                  </a>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <Suspense fallback={<p role="status" className="py-6 text-muted-foreground">Loading exercise…</p>}>
      {path === "#/example1" && <CardExample />}
      {path === "#/example2" && <SearchExample />}
      {path === "#/example3" && <Example3 />}
      </Suspense>
      {!example && path !== "#/" && <a href="#/" className="text-[#65468b] underline">Return home</a>}
    </main>
    </div>
    </div>
  );
};

export default App;
