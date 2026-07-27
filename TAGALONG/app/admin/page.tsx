import { Badge, Card, PageShell } from "@/components/ui";

export default function AdminPage() {
  return <PageShell><h1 className="text-4xl font-black">Admin moderation dashboard</h1><div className="mt-6 grid gap-4 lg:grid-cols-3">{["Open reports", "Suspended accounts", "Audit trail"].map((item, i) => <Card key={item}><Badge tone={i === 0 ? "coral" : "mint"}>{i === 0 ? "Needs review" : "Sample data"}</Badge><h2 className="mt-3 text-xl font-black">{item}</h2><p className="mt-2 text-ink/70">Review reports, record actions, and keep a moderation audit trail.</p></Card>)}</div></PageShell>;
}
