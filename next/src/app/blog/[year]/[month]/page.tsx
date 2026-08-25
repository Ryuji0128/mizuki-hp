import { redirect } from "next/navigation";

export default async function LegacyBlogMonthPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; month: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { year, month } = await params;
  const query = new URLSearchParams({ year, month });
  const page = (await searchParams)?.page;
  if (page) query.set("page", page);
  redirect(`/blog?${query.toString()}`);
}
