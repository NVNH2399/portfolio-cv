import { notFound } from "next/navigation";
import { getResourceConfig } from "@/lib/resources";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function ResourceEditPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource, id } = await params;
  if (!getResourceConfig(resource) || Number.isNaN(Number(id))) notFound();

  // ResourceForm tu render tieu de + breadcrumb rieng, khong can h1 o day nua
  return <ResourceForm resource={resource} id={Number(id)} />;
}
