import { useState } from "react";
import DeploymentCard, { type Deployment } from "./exercise/example1";
import { data } from "./data/MOCK_DATA";

const App = () => {
  const [deployment, setDeployment] = useState<Deployment>(() => ({ ...data[0] }));

  function handleAdvance(id: string, nextStatus: Deployment["status"]) {
    setDeployment((current) =>
      current.id === id ? { ...current, status: nextStatus } : current,
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 border-b border-border pb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Deployment Queue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review deployment details and advance its status.
        </p>
      </header>
      <div className="w-full max-w-md">
        <DeploymentCard deployment={deployment} onAdvance={handleAdvance} />
      </div>
    </main>
  );
};

export default App;
