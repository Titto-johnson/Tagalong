import { ActivityCard } from "@/components/activity-card";
import { Card, PageShell } from "@/components/ui";
import { activities } from "@/lib/demo-data";

export default function AdventurePage() {
  return <PageShell><h1 className="text-4xl font-black">Adventure</h1><Card className="mt-6"><p className="text-ink/70">Adventure posts include difficulty, expected duration, equipment requirements, and safety notes.</p></Card><div className="mt-6 grid gap-5 lg:grid-cols-3">{activities.filter((a) => a.category === "ADVENTURE").map((a) => <ActivityCard key={a.id} activity={a} />)}</div></PageShell>;
}
