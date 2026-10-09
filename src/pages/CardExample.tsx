import { useState } from "react";
import DeploymentCard, { type Deployment } from "../exercise/example1";
import { data } from "../data/MOCK_DATA";

export default function CardExample() {
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

