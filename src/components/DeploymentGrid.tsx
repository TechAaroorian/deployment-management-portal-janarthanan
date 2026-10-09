import DeploymentCard, { type Deployment } from "../exercise/example1";

interface DeploymentGridProps {
  deployments: readonly Deployment[];
  onAdvance?: (id: Deployment["id"], nextStatus: Deployment["status"]) => void;
}

export function DeploymentGrid({ deployments, onAdvance }: DeploymentGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {deployments.map((deployment) => (
        <DeploymentCard key={deployment.id} deployment={deployment} onAdvance={onAdvance} />
      ))}
    </div>
  );
}
