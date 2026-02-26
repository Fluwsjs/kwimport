import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const pageSize = 20;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy">Leads</h1>
          <p className="text-sm text-navy/50">{total} totaal</p>
        </div>
        <a
          href="/api/leads?export=csv"
          className="btn-outline text-xs"
        >
          📥 Export CSV
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background border-b border-muted/20">
              <tr className="text-xs text-navy/40">
                <th className="text-left p-4">Naam</th>
                <th className="text-left p-4">E-mail</th>
                <th className="text-left p-4">Telefoon</th>
                <th className="text-left p-4">Bron</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Datum</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-navy/40 text-sm">
                    Nog geen leads
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-background last:border-0 hover:bg-background/50">
                    <td className="p-4 font-medium text-navy">{lead.naam}</td>
                    <td className="p-4">
                      <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                        {lead.email}
                      </a>
                    </td>
                    <td className="p-4 text-navy/60">{lead.telefoon ?? "–"}</td>
                    <td className="p-4">
                      <span className="text-xs bg-background px-2 py-0.5 rounded-full text-navy/60">
                        {lead.bron}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        lead.status === "NIEUW"
                          ? "bg-amber-100 text-amber-700"
                          : lead.status === "IN_BEHANDELING"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-navy/50 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-background">
            <span className="text-xs text-navy/50">
              Pagina {page} van {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/leads?page=${page - 1}`}
                  className="text-xs px-3 py-1.5 border border-muted/30 rounded-lg hover:bg-background transition-colors"
                >
                  ← Vorige
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/leads?page=${page + 1}`}
                  className="text-xs px-3 py-1.5 border border-muted/30 rounded-lg hover:bg-background transition-colors"
                >
                  Volgende →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
