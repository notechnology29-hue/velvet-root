import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PitchPage from "@/components/pitch/PitchPage";
import { isValidPitchToken } from "@/lib/pitch-access";
import { getPitchContent } from "@/lib/pitch-content";
import { recordPitchView } from "@/lib/pitch-views";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "The Velvetyn Gala | Partnership",
  robots: { index: false, follow: false, nocache: true }
};

export default async function Page({ params }: { params: { token: string } }) {
  if (!isValidPitchToken("sponsors", params.token)) notFound();

  const content = await getPitchContent("sponsors");
  if (!content) notFound();

  await recordPitchView("sponsors");
  return <PitchPage content={content} />;
}
