

/**
 * ============================================================================
 * Exercise 1 - Deployment Card
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Your team is building an internal Deployment Queue application used by
 * Release Engineers to monitor application deployments.
 *
 * A mock API response has been provided in src/data/MOCK_DATA.ts.
 *
 * In this exercise, your task is to build a reusable DeploymentCard component.
 *
 * ============================================================================
 *
 * ## Requirements

### 1. Component Setup

- Create a `DeploymentCard` component.
- Keep the provided imports unchanged.
- Use React with TypeScript.
- Use the existing Shadcn UI components:
  - Card
  - Badge
  - Button
  - Separator

---
### 2. Deployment Interface

Create the `Deployment` interface with the mockdata properties:
make sure 
environment: "Production" | "QA" | "Development" | "Staging";
status: "Pending" | "In Progress" | "Completed";
priority: "Low" | "Medium" | "High" | "Critical";



 * ============================================================================
 *
 * UI Requirements
 *
 * • Use the provided shadcn/ui components where appropriate.
 *
 * • Environment and Status should be displayed using badges.
 *
 * • Color the left border of the card based on priority.
 *   Priority values in the data are: Low, Medium, High, and Critical.
 *   Choose a distinct color for each priority.
 *
 * • Display a "advance to [next status]" button at the bottom of the card.
 *
 * • Use appropriate spacing and visual hierarchy.
 *
 * • The component should remain responsive.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • Use TypeScript.
 *
 * • Define appropriate interfaces/types.
 *
 * • Keep the component reusable.
 *
 * • Do not hardcode values.
 *
 * • Avoid unnecessary duplication.
 *
 * • Write clean, maintainable code.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * We will evaluate:
 *
 * ✓ React Fundamentals
 * ✓ Component Composition
 * ✓ TypeScript
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 *
 * Note
 *
 * This exercise focuses only on the DeploymentCard component.
 *
 * Additional requirements will be introduced in later exercises.
 *
 * ============================================================================
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CalendarClock, Check, Clock, MapPin, UserRound } from "lucide-react";

export interface Deployment {
  id: string;
  application: string;
  version: string;
  environment: "Production" | "QA" | "Development" | "Staging";
  status: "Pending" | "In Progress" | "Completed";
  requestedBy: string;
  requestedAt: string;
  scheduledAt: string;
  region: string;
  priority: "Low" | "Medium" | "High" | "Critical";
}

interface DeploymentCardProps {
  deployment: Deployment;
  onAdvance?: (id: Deployment["id"], nextStatus: Deployment["status"]) => void;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

function formatDate(value: string) {
  return `${dateFormatter.format(new Date(value))} UTC`;
}

const priorityBorderClasses: Record<Deployment["priority"], string> = {
  Low: "border-l-stone-400",
  Medium: "border-l-slate-500",
  High: "border-l-amber-700",
  Critical: "border-l-red-800",
};

const nextStatusByStatus: Record<Deployment["status"], Deployment["status"] | null> = {
  Pending: "In Progress",
  "In Progress": "Completed",
  Completed: null,
};

const statusBadgeClasses: Record<Deployment["status"], string> = {
  Pending: "bg-[#fef3c7] text-[#8b4c08]",
  "In Progress": "bg-[#eceaf0] text-[#65468b]",
  Completed: "bg-[#e8f3e8] text-[#27613d]",
};

const DeploymentCard = ({ deployment, onAdvance }: DeploymentCardProps) => {
  const nextStatus = nextStatusByStatus[deployment.status];

  return (
    <Card className={`@container w-full min-w-0 rounded-xl border-l-4 shadow-sm ring-border ${priorityBorderClasses[deployment.priority]}`}>
      <CardHeader className="gap-3">
        <CardTitle>
          <h2 className="wrap-break-word text-lg font-semibold">
            {deployment.application}
          </h2>
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
          <span>{deployment.id}</span>
          <span>{deployment.version}</span>
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-md">{deployment.environment}</Badge>
          <Badge variant="secondary" className={`rounded-md duration-150 motion-reduce:transition-none ${statusBadgeClasses[deployment.status]}`} role="status" aria-live="polite">{deployment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <dl className="grid grid-cols-1 gap-4 @sm:grid-cols-2 [&_dt]:text-xs [&_dd]:mt-1">
          <div className="min-w-0">
            <dt className="flex items-center gap-2 text-muted-foreground"><UserRound aria-hidden="true" className="size-3.5 shrink-0" />Requested by</dt>
            <dd className="wrap-break-word font-medium">{deployment.requestedBy}</dd>
          </div>
          <div className="min-w-0">
            <dt className="flex items-center gap-2 text-muted-foreground"><MapPin aria-hidden="true" className="size-3.5 shrink-0" />Region</dt>
            <dd className="wrap-break-word font-medium">{deployment.region}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted-foreground">Priority</dt>
            <dd className="font-medium">{deployment.priority}</dd>
          </div>
          <div className="col-span-full min-w-0">
            <dt className="flex items-center gap-2 text-muted-foreground"><Clock aria-hidden="true" className="size-3.5 shrink-0" />Requested at</dt>
            <dd className="wrap-break-word font-medium">
              <time dateTime={deployment.requestedAt}>{formatDate(deployment.requestedAt)}</time>
            </dd>
          </div>
          <div className="col-span-full min-w-0">
            <dt className="flex items-center gap-2 text-muted-foreground"><CalendarClock aria-hidden="true" className="size-3.5 shrink-0" />Scheduled at</dt>
            <dd className="wrap-break-word font-medium">
              <time dateTime={deployment.scheduledAt}>{formatDate(deployment.scheduledAt)}</time>
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="mt-auto bg-muted/60">
        <Button
          type="button"
          variant={nextStatus === null ? "outline" : "default"}
          className={`min-h-11 w-full whitespace-normal shadow-none duration-150 ease-out enabled:active:brightness-90 motion-safe:enabled:active:scale-[0.98] motion-reduce:transition-none ${
            nextStatus === null
              ? ""
              : "bg-[#65468b] text-white hover:bg-[#65468b] hover:brightness-90 focus-visible:ring-[#65468b]/40"
          }`}
          disabled={nextStatus === null || !onAdvance}
          onClick={() => {
            if (nextStatus !== null) {
              onAdvance?.(deployment.id, nextStatus);
            }
          }}
        >
          {nextStatus === null ? "Deployment completed" : `Advance to ${nextStatus}`}
          {nextStatus === null ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentCard;
