import Link from "next/link";

type Props = {
  current: number;
  last: number;
  basePath: string;
  query?: Record<string, string | undefined>;
};

function hrefFor(page: number, basePath: string, query: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (!v || k === "page") return;
    params.set(k, v);
  });
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ current, last, basePath, query = {} }: Props) {
  if (last <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <nav className="d-flex justify-content-center mt-4" aria-label="Pagination">
      <ul className="pagination mb-0">
        {current > 1 ? (
          <li className="page-item">
            <Link className="page-link" href={hrefFor(current - 1, basePath, query)}>
              Prev
            </Link>
          </li>
        ) : null}
        {pages.map((page) => (
          <li key={page} className={`page-item${page === current ? " active" : ""}`}>
            {page === current ? (
              <span className="page-link">{page}</span>
            ) : (
              <Link className="page-link" href={hrefFor(page, basePath, query)}>
                {page}
              </Link>
            )}
          </li>
        ))}
        {current < last ? (
          <li className="page-item">
            <Link className="page-link" href={hrefFor(current + 1, basePath, query)}>
              Next
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
