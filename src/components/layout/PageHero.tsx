import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  badge?: string;
}

export function PageHero({ title, description, breadcrumbs, badge }: PageHeroProps) {
  return (
    <div className="bg-primary">
      <div className="container-main py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-white/60 text-xs mb-5">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevron-right" size={12} className="text-white/40" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/90 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {badge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4 border border-white/20">
            {badge}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3">
          {title}
        </h1>
        {description && (
          <p className="text-white/75 max-w-xl leading-relaxed text-sm md:text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
