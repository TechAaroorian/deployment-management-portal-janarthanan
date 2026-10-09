import { useState } from "react";
import DeploymentCard, { type Deployment } from "../exercise/example1";
import { data } from "../data/MOCK_DATA";
import { HelpTooltip } from "../components/HelpTooltip";

export default function CardExample() {
  const [deployment, setDeployment] = useState<Deployment>(() => ({ ...data[0] }));

  function handleAdvance(id: string, nextStatus: Deployment["status"]) {
    setDeployment((current) =>
      current.id === id ? { ...current, status: nextStatus } : current,
    );
  }

  return (
      <div className="w-full max-w-md space-y-3">
        <DeploymentCard deployment={deployment} onAdvance={handleAdvance} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <p>Interactive preview. Changes reset when you leave this page.</p>
          <HelpTooltip label="About preview status changes">
            This preview updates local React state. Advance from Pending to In Progress, then Completed. Completed is the final status, so its action is disabled.
          </HelpTooltip>
        </div>
      </div>
  );
}

