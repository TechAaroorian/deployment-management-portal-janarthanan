import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, House, LayoutGrid, Menu, PanelsTopLeft, Search, X } from "lucide-react";
import DeploymentCard, { type Deployment } from "./exercise/example1";
import { useDeploymentQueryFilters } from "./hooks/useDeploymentQueryFilters";
import { DeploymentFilters } from "./components/DeploymentFilters";
import Example3 from "./exercise/example3";
import { data } from "./data/MOCK_DATA";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";

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

function CardExample() {
  const [deployment, setDeployment] = useState<Deployment>(() => ({ ...data[0] }));

  function handleAdvance(id: string, nextStatus: Deployment["status"]) {
    setDeployment((current) =>
      current.id === id ? { ...current, status: nextStatus } : current,
    );
  }

  return (
      <div className="w-full max-w-md">
        <DeploymentCard deployment={deployment} onAdvance={handleAdvance} />
      </div>
  );
}

function SearchExample() {
  const { search, setSearch, statusFilter, setStatusFilter, filteredDeployments } = useDeploymentQueryFilters(data, "#/example2");

  return (
    <section className="space-y-6" aria-label="Deployment search">
      <DeploymentFilters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} filteredCount={filteredDeployments.length} totalCount={data.length} />
      {filteredDeployments.length === 0 ? (
        <p className="py-8 text-muted-foreground">No deployments match your search and status filter. Try another application name or select All statuses.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredDeployments.map((deployment) => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))}
        </div>
      )}
    </section>
  );
}

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hash = useSyncExternalStore(subscribeToHash, getHash);
  const path = hash.split("?")[0];
  const example = examples.find((item) => item.path === path);

  return (
    <div className="min-h-screen bg-background text-foreground [--background:#eceaf0] [--foreground:#292630] [--card:#ffffff] [--card-foreground:#292630] [--muted:#eceaf0] [--muted-foreground:#625d6d] [--border:#d1ccd8] [--input:#d1ccd8] [--secondary:#eceaf0] [--secondary-foreground:#625d6d] [--accent:#eceaf0] [--accent-foreground:#292630] [--primary:#65468b] [--primary-foreground:#ffffff] [--ring:#65468b]">
      <header className="sticky top-0 z-20 mb-8 w-full border-b border-border bg-card shadow-sm"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuButtonRef.current?.focus();
          }
        }}>
      <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <a href="#/" onClick={() => setMenuOpen(false)} className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary">
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
          <a key={item.path} href={item.path} aria-current={path === item.path ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65468b] aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground aria-[current=page]:font-semibold motion-reduce:transition-none">
            <item.icon aria-hidden="true" className="size-4 shrink-0" />
            {item.title}
          </a>
        ))}
      </nav>
      </div>
      <div className="border-t border-border bg-primary/10">
      <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">{example?.title ?? (path === "#/" ? "Deployment Queue Exercises" : "Page not found")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{example?.description ?? "Choose an exercise to explore its implementation."}</p>
      </div>
      </div>
      </header>
    <main className="mx-auto max-w-screen-2xl px-4 pb-8 sm:px-6 lg:px-8">
      {path === "#/" && (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {examples.map((item) => (
            <li key={item.path}>
              <Card className="h-full rounded-xl bg-card shadow-sm ring-border transition-shadow duration-150 focus-within:ring-primary/50 motion-reduce:transition-none">
                <CardHeader className="gap-4">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-primary">
                    <item.icon aria-hidden="true" className="size-5" />
                  </span>
                  <CardTitle><h2 className="text-lg font-semibold">{item.title}</h2></CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <a href={item.path} className="group mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-2 font-medium text-primary transition-colors duration-150 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                    Open exercise
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform duration-150 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:translate-x-0.5 motion-reduce:transition-none" />
                  </a>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
      {path === "#/example1" && <CardExample />}
      {path === "#/example2" && <SearchExample />}
      {path === "#/example3" && <Example3 />}
      {!example && path !== "#/" && <a href="#/" className="text-[#65468b] underline">Return home</a>}
    </main>
    </div>
  );
};

export default App;
