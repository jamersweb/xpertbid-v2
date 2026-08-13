import type { PropertyFilters } from "@/types/property";
import type { CategoryNode } from "@/types/property";

type Props = {
  action?: string;
  defaults?: Partial<PropertyFilters> & { city?: string };
  childOptions?: CategoryNode[];
};

export function PropertyFiltersForm({
  action = "/properties",
  defaults = {},
  childOptions = [],
}: Props) {
  return (
    <form className="property-filters-bar mb-4" method="get" action={action}>
      {defaults.sub_category ? (
        <input type="hidden" name="sub_category" value={defaults.sub_category} />
      ) : null}

      <div className="row g-3 align-items-end">
        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label">Search</label>
          <input
            className="form-control"
            name="q"
            defaultValue={defaults.q || ""}
            placeholder="Keyword"
          />
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label">City</label>
          <input
            className="form-control"
            name="city"
            defaultValue={defaults.city || ""}
            placeholder="e.g. Lahore"
          />
        </div>

        {!defaults.sub_category ? (
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label">Purpose</label>
            <select
              className="form-select"
              name="sub_category"
              defaultValue={defaults.sub_category || ""}
            >
              <option value="">Any</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>
          </div>
        ) : null}

        {childOptions.length ? (
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              name="child_category"
              defaultValue={defaults.child_category || ""}
            >
              <option value="">All types</option>
              {childOptions.map((child) => (
                <option key={child.id} value={child.slug}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label">Type</label>
            <input
              className="form-control"
              name="type"
              defaultValue={defaults.type || ""}
              placeholder="House, Flat…"
            />
          </div>
        )}

        <div className="col-6 col-md-2 col-lg-1">
          <label className="form-label">Beds</label>
          <input
            className="form-control"
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={defaults.bedrooms ?? ""}
          />
        </div>
        <div className="col-6 col-md-2 col-lg-1">
          <label className="form-label">Min</label>
          <input
            className="form-control"
            name="price_min"
            type="number"
            min={0}
            defaultValue={defaults.price_min ?? ""}
          />
        </div>
        <div className="col-6 col-md-2 col-lg-1">
          <label className="form-label">Max</label>
          <input
            className="form-control"
            name="price_max"
            type="number"
            min={0}
            defaultValue={defaults.price_max ?? ""}
          />
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label">Sort</label>
          <select className="form-select" name="sort" defaultValue={defaults.sort || "latest"}>
            <option value="latest">Latest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="featured">Featured</option>
          </select>
        </div>
        <div className="col-12 col-md-3 col-lg-2">
          <button
            className="btn w-100"
            type="submit"
            style={{
              background: "#23262F",
              color: "#fff",
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: 600,
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
}
