import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { formatEuro } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBerekeningenPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const pageSize = 20;

  const [calcs, total] = await Promise.all([
    prisma.calculation.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.calculation.count(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy">Berekeningen</h1>
          <p className="text-sm text-navy/50">{total} totaal</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background border-b border-muted/20">
              <tr className="text-xs text-navy/40">
                <th className="text-left p-4">Voertuig</th>
                <th className="text-left p-4">Methode</th>
                <th className="text-left p-4">Rest-BPM</th>
                <th className="text-left p-4">E-mail</th>
                <th className="text-left p-4">Datum</th>
              </tr>
            </thead>
            <tbody>
              {calcs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-navy/40 text-sm">
                    Nog geen berekeningen
                  </td>
                </tr>
              ) : (
                calcs.map((calc) => {
                  const result = calc.result as { totaalBpm?: number };
                  const input = calc.input as { brandstof?: string; co2Wltp?: number };
                  return (
                    <tr key={calc.id} className="border-b border-background last:border-0 hover:bg-background/50">
                      <td className="p-4">
                        <div className="font-medium text-navy capitalize">{calc.vehicleType}</div>
                        <div className="text-xs text-navy/40">{input.brandstof} · {input.co2Wltp} g/km</div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs bg-background px-2 py-0.5 rounded-full text-navy/60">
                          {calc.method}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-primary">
                        {result.totaalBpm != null ? formatEuro(result.totaalBpm) : "–"}
                      </td>
                      <td className="p-4 text-navy/50 text-xs">{calc.email ?? "–"}</td>
                      <td className="p-4 text-navy/50 text-xs">
                        {new Date(calc.createdAt).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-background">
            <span className="text-xs text-navy/50">Pagina {page} van {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/berekeningen?page=${page - 1}`} className="text-xs px-3 py-1.5 border border-muted/30 rounded-lg hover:bg-background transition-colors">
                  ← Vorige
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/berekeningen?page=${page + 1}`} className="text-xs px-3 py-1.5 border border-muted/30 rounded-lg hover:bg-background transition-colors">
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
