import Image from "next/image";
import { notFound } from "next/navigation";
import { ActivityActions, Badge, Card, PageShell, SafetyNotice } from "@/components/ui";
import { activities, profiles } from "@/lib/demo-data";

export default async function ActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = activities.find((item) => item.id === id);
  if (!activity) notFound();
  const host = profiles.find((profile) => profile.id === activity.hostId);
  return (
    <PageShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden p-0">
          <div className="relative h-80"><Image src={activity.image} alt="" fill className="object-cover" /></div>
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2"><Badge>{activity.activityType}</Badge><Badge tone="sky">{activity.distance} mi away</Badge><Badge tone="wheat">{activity.costType.toLowerCase()}</Badge></div>
            <h1 className="text-4xl font-black">{activity.title}</h1>
            <p className="leading-7 text-ink/75">{activity.description}</p>
            <dl className="grid gap-4 md:grid-cols-2">
              <div><dt className="font-bold">When</dt><dd>{new Date(activity.startsAt).toLocaleString()}</dd></div>
              <div><dt className="font-bold">Approximate area</dt><dd>{activity.location}</dd></div>
              <div><dt className="font-bold">Spaces</dt><dd>{activity.maximumParticipants - activity.joined} open of {activity.maximumParticipants}</dd></div>
              <div><dt className="font-bold">Accessibility</dt><dd>{activity.accessibility ?? "Ask the host for details."}</dd></div>
              {activity.difficulty && <div><dt className="font-bold">Difficulty</dt><dd>{activity.difficulty}</dd></div>}
              {activity.duration && <div><dt className="font-bold">Duration</dt><dd>{activity.duration}</dd></div>}
              {activity.equipment && <div><dt className="font-bold">Equipment</dt><dd>{activity.equipment}</dd></div>}
              {activity.safetyNotes && <div className="md:col-span-2"><dt className="font-bold">Safety notes</dt><dd>{activity.safetyNotes}</dd></div>}
            </dl>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="text-xl font-black">Host</h2>
            <p className="mt-2 font-bold">{host?.displayName}</p>
            <p className="text-sm text-ink/70">{host?.approximateCity} · verified email · community rating 4.8 sample</p>
            <div className="mt-4"><ActivityActions /></div>
          </Card>
          <SafetyNotice help={activity.category === "HELP_VOLUNTEER"} />
        </div>
      </div>
    </PageShell>
  );
}
