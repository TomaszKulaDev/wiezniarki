import Link from "next/link";

interface BreadcrumbsProps {
  pageName: string;
  pageUrl?: string;
  backgroundColor?: string;
}

export default function Breadcrumbs({
  pageName,
  pageUrl,
  backgroundColor = "bg-accent",
}: BreadcrumbsProps) {
  return (
    <div className={`${backgroundColor} py-1 border-b border-gray-100`}>
      <div className="container mx-auto px-4">
        <div className="text-xs text-gray-600 flex items-center py-0.5">
          <Link href="/" className="hover:text-primary transition">
            Strona główna
          </Link>
          <span className="mx-1 text-gray-400">&gt;</span>
          {pageUrl ? (
            <Link
              href={pageUrl}
              className="text-gray-800 hover:text-primary transition"
            >
              {pageName}
            </Link>
          ) : (
            <span className="text-gray-800">{pageName}</span>
          )}
        </div>
      </div>
    </div>
  );
}
