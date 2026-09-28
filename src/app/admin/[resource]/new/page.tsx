import { notFound } from "next/navigation";
import { getResourceConfig } from "@/lib/resources";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function ResourceNewPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  if (!getResourceConfig(resource)) notFound();

  // ResourceForm tu render tieu de + breadcrumb rieng, khong can h1 o day nua
  return <ResourceForm resource={resource} />;
}
