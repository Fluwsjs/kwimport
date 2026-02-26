import { prisma } from "@/lib/db/prisma";
import { formatEuro } from "@/lib/utils";

export default async function AdminDashboard() {
  const [totalLeads, totalCalcs, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.calculation.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const nieuwLeads = await prisma.lead.count({ where: { status: "NIEUW" } });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy">Dashboard</h1>
        <p className="text-sm text-navy/50">Overzicht van leads en berekeningen</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Totaal leads", value: totalLeads, icon: "👤", color: "text-primary" },
          { label: "Nieuwe leads", value: nieuwLeads, icon: "🔔", color: "text-amber-500" },
          { label: "Berekeningen", value: totalCalcs, icon: "🧮", color: "text-primary" },
          { label: "Conversie", value: totalCalcs > 0 ? `${((totalLeads / totalCalcs) * 100).toFixed(1)}%` : "–", icon: "📈", color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <div className="text-xs text-navy/50">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy text-sm">Recente leads</h2>
          <a href="/admin/leads" className="text-xs text-primary hover:underline">Alle leads →</a>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-navy/50 text-center py-6">Nog geen leads</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-navy/40 border-b border-background">
                  <th className="text-left py-2 pr-4">Naam</th>
                  <th className="text-left py-2 pr-4">E-mail</th>
                  <th className="text-left py-2 pr-4">Bron</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-background last:border-0">
                    <td className="py-3 pr-4 font-medium text-navy">{lead.naam}</td>
                    <td className="py-3 pr-4 text-navy/60">{lead.email}</td>
                    <td className="py-3 pr-4 text-navy/60 text-xs">{lead.bron}</td>
                    <td className="py-3">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
