import { notFound } from "next/navigation";
import { getResourceConfig } from "@/lib/resources";
import ResourceTable from "@/components/admin/ResourceTable";

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  if (!getResourceConfig(resource)) notFound();

  return <ResourceTable resource={resource} />;
}
