---
title: DoDeliver shipping — Phase 1 detailed plan
date: 2026-07-29
status: implementation-ready
artifact_readiness: implementation-ready
parent: docs/plans/2026-07-29-dodeliver-shipping-integration.md
---

# DoDeliver Phase 1 — Detailed Plan

## Confirmed decisions

| Topic | Decision |
|-------|----------|
| PayFast orders | User pays → **admin confirms order** → admin **manually Books** DoDeliver |
| COD orders | Same — **no auto book**; admin confirms → manual Book |
| Checkout shipping cost | Phase 1: remain `0` (no rate UI yet) |
| Advice / finance APIs | Phase 2 only |
| Pickup location | **Per product on Sell form** (listing pickup address). Not one env warehouse. Group shipments by product pickup / seller when booking. |
| Multi-seller cart | Multiple CNs: each distinct product pickup → own shipment; buyer address = consignee on every CN |

## Marketplace pickup model (important)

DoDeliver API key usually belongs to **one merchant account** (XpertBid), not each seller.

```text
Checkout order
  ├── Buyer (consignee) ← order.shipping_* address
  └── Items grouped by pickup location / seller
        ├── Seller A / Product location A → shipment 1 (pickup = product_location_A)
        └── Seller B / Product location B → shipment 2 (pickup = product_location_B)
```

### Confirmed UX direction (product pickup on Sell form)

Listings already have `country_id` / `state_id` / `city_id` (browse location). That is **not enough** for courier pickup.

**Sell form must also collect “Where should courier pick this product from?”:**

| Field | Purpose |
|-------|---------|
| `pickup_address_line1` (+ optional line2) | Street / shop / warehouse |
| `pickup_area` | Area / locality |
| `pickup_city` / city_id | City for DoDeliver mapping |
| `pickup_state` / `pickup_country` | Optional but useful |
| `pickup_contact_name` | Who hands over parcel (default seller name) |
| `pickup_contact_phone` | Rider contact at origin |

Store on **listing** (product-level) so one seller can ship different products from different places.

**When admin Books shipping:**
- Consignee = **buyer** address on order  
- Origin / pickup = each item’s **product pickup location**  
- Multi-seller or multi-location cart → **multiple CNs** (Seller1+location1, Seller2+location2, …)

**DoDeliver account note:** Platform still uses one `API_KEY`. Each distinct pickup address may need a registered DoDeliver `pickup_location_id` (create/map when seller saves listing, or admin maps before first book). Phase 1 can:
- **A (simpler):** save full pickup address on listing; on Book, admin/system uses address text + matched/created DoDeliver pickup id  
- **B:** require seller to complete pickup profile once, reuse id on listings  

Prefer **product-level address on sell form** + resolve/create DoDeliver pickup id at book time (or cache id on listing after first success).

---

## End-to-end flow (Phase 1 result)

```text
1. Customer checkout (PayFast / COD / bank…)
2. Order created in XpertBid (status pending / processing as today)
3. Admin opens Admin → Orders → Show
4. Admin reviews address + payment
5. Admin clicks “Book with DoDeliver”
6. System calls DoDeliver POST /api/order
7. Save tracking_id in shipments table
8. Admin can: Refresh Track | Cancel | Print AWB
9. Customer on My Order page sees tracking + timeline
```

**Result after Phase 1:** XpertBid orders can be handed to DoDeliver by admin, tracked, cancelled, and AWB printed — without exposing API key to the browser.

---

## What we will build (step by step)

### Step 1 — Config & env

**Do:**
- Add to `.env` / `.env.example`:
  - `DODELIVER_BASE_URL=https://portal.dodeliver.com.pk`
  - `DODELIVER_API_KEY=` (platform XpertBid merchant key — one account)
  - `DODELIVER_DEFAULT_SERVICE=` (default service type from portal prerequisites)
  - `DODELIVER_DEFAULT_PICKUP_LOCATION_ID=` (**optional fallback only** — not per-seller source of truth)
- Add seller/listing pickup fields via migration on `listings` (or `listing_data` JSON — prefer real columns for querying):
  - `pickup_address_line1`, `pickup_address_line2`, `pickup_area`, `pickup_city`, `pickup_state`, `pickup_country`
  - `pickup_contact_name`, `pickup_contact_phone`
  - `dodeliver_pickup_location_id` nullable (filled after first successful map/create on DoDeliver)
- Sell form (`Auctions/Create.jsx` / listing store): required “Product pickup location” section (separate from browse `city_id` if needed, or prefill from it)
- Add `dodeliver` block in `config/services.php`

**Where values come from:**
| Var / field | Source |
|-------------|--------|
| `API_KEY` | DoDeliver portal → Api Key (XpertBid company account) |
| `DEFAULT_SERVICE` | Portal prerequisites services list |
| Listing pickup address | **Seller fills on Sell form** — “Courier will pick product from here” |
| `listings.dodeliver_pickup_location_id` | Created/matched under XpertBid DoDeliver account when booking (or after address save) |
| `DEFAULT_PICKUP_LOCATION_ID` | Optional hub fallback only |

**Result:** Credentials on server; origin address is **product-scoped** from sell flow.

---

### Step 2 — `DoDeliverService` (HTTP client)

**File:** `app/Services/DoDeliverService.php`  
**Pattern:** like `PayFastService`

**Methods (Phase 1 only):**

| Method | DoDeliver API | Use |
|--------|---------------|-----|
| `getCities(?search)` | `GET /api/cities` | City dropdown / mapping |
| `getPickupLocations()` | Pickup locations GET | Validate default pickup |
| `createOrder(array $payload)` | `POST /api/order` | Book shipment |
| `trackOrder($trackingId)` | `GET /api/orders/{id}` | Timeline + detail |
| `cancelOrders(array $trackingIds)` | `POST /api/orders/cancel` | Cancel CN |
| `printAwb(array $trackingIds)` | `POST /api/awb-print` | PDF bytes/file |

**Do:**
- Always send `api_key` as query param (per PDF)
- Log request/response (without dumping full key in public logs if possible)
- Throw clear exceptions on `status: false` / HTTP errors

**Result:** One place for all courier calls.

**Test (service-level):**
1. `getCities('karachi')` returns cities array
2. `getPickupLocations()` returns at least one active location (or known empty)
3. Invalid API key → graceful error, not 500 HTML dump

---

### Step 3 — Database: `shipments` table + model

**Migration columns:**

| Column | Type | Notes |
|--------|------|--------|
| `id` | bigint | PK |
| `order_id` | FK → orders | cascade on delete optional |
| `provider` | string | default `dodeliver` |
| `tracking_id` | string/nullable unique | DoDeliver CN |
| `pickup_location_id` | string/int nullable | |
| `service` | string nullable | |
| `service_name` | string nullable | from response |
| `cod_amount` | decimal | 0 if not COD |
| `shipment_status` | string | Booked, Cancelled, Delivered… |
| `timeline` | json nullable | from track API |
| `awb_path` | string nullable | stored PDF under `storage/` or `public/` |
| `last_synced_at` | timestamp nullable | |
| `request_payload` | json nullable | debug |
| `response_payload` | json nullable | debug |
| timestamps | | |

**Model:** `app/Models/Shipment.php`  
**Relation:** `Order::hasOne/hasMany(Shipment)` — Phase 1: prefer **one active** shipment per order (latest non-cancelled, or block re-book until cancel).

**Result:** Courier data lives outside bloating `orders`.

**Test:**
1. Migrate up/down clean
2. Create shipment row linked to order
3. Unique `tracking_id` enforced

---

### Step 4 — Map XpertBid order → DoDeliver payload

**Logic in service or small mapper class:**

| DoDeliver field | Source |
|-----------------|--------|
| `consignee_name` | order shipping name (fallback billing) |
| `consignee_contact_no` | shipping phone |
| `consignee_address` | shipping address lines joined |
| `area` | shipping state / area or `"N/A"` |
| `city` | shipping city (normalized to DoDeliver name/value) |
| `product_name` | order_number + first item title |
| `service` | env default (admin can override later) |
| `pieces` | sum of order item quantities |
| `cod` | if `payment_method === 'cod'` → order `total`, else `0` |
| `customer_reference` | `order_number` |
| `weight` | default `1` (Phase 1) |
| `advice` | order `notes` if any |
| `pickup_location_id` | From listing’s mapped DoDeliver id (after product pickup address on sell form) |
| Origin context (admin UI) | Show seller name + product pickup address per shipment line |

**Booking rules (gate):**
- Order not `cancelled`
- No active (non-cancelled) shipment already, OR admin force after cancel
- PayFast/bank: prefer `payment_status` paid/approved (configurable soft warning)
- COD: allow book after admin review (same button)

**Result:** Consistent booking for PayFast and COD; COD amount only when COD.

---

### Step 5 — Admin backend routes & controller

**Routes** (under existing `admin` middleware group), e.g.:

- `POST admin/orders/{order}/shipments` → book  
- `POST admin/orders/{order}/shipments/sync` → track refresh  
- `POST admin/orders/{order}/shipments/cancel` → cancel  
- `GET  admin/orders/{order}/shipments/awb` → download/print AWB  

**Controller:** extend `Admin\OrderController` **or** new `Admin\ShipmentController`.

**`show` order:** eager-load `shipment` (or latest shipment) into Inertia props.

**Result:** Admin can trigger all Phase 1 courier actions via authenticated routes.

**Test:**
1. Guest → 403/redirect
2. Non-admin → unauthorized
3. Book on valid order → 302 back + success flash + shipment in DB
4. Double-book without cancel → validation error
5. Cancel → shipment_status Cancelled + DoDeliver cancel called

---

### Step 6 — Admin UI (`Admin/Orders/Show.jsx`)

**New “Shipping (DoDeliver)” panel:**

| State | UI |
|-------|-----|
| No shipment | Button **Book with DoDeliver** (+ confirm Swal) |
| Has shipment | Tracking ID, status, last synced, timeline list |
| Actions | **Refresh status**, **Cancel shipment**, **Print AWB** |

Optional small display: COD amount that will be / was sent.

**Result:** Admin does not need DoDeliver portal for day-to-day book/track/cancel/AWB.

**Test (manual UI):**
1. Open unpaid vs paid order — book still manual; message if payment pending (warn, don’t hard-block COD)
2. Book → panel shows tracking
3. Refresh → timeline updates
4. Print AWB → PDF opens/downloads
5. Cancel → status Cancelled; Book available again (if we allow rebook)

---

### Step 7 — User order page (`Orders/Show.jsx`)

**Show when shipment exists:**
- “Shipped via DoDeliver”
- Tracking ID
- Shipment status
- Simple timeline (date/time + log)

**Do not show:** API errors, raw payloads, api_key.

**Result:** Customer can see courier progress after admin books.

**Test:**
1. Before book → no tracking section (or “Not shipped yet”)
2. After book → tracking visible to order owner
3. Another user cannot open this order (existing auth)

---

### Step 8 — City helper (minimal)

**Phase 1 approach (simple):**
- On book, send order’s `shipping_city` string as DoDeliver expects (`city` name/value)
- Optional: call `getCities($shippingCity)` and pick best match; if no match → return admin error “City not supported — fix address or map city”

**Not in Phase 1:** full city sync admin CRUD.

**Result:** Fewer failed bookings; admin sees clear city errors.

---

## What Phase 1 will NOT do

- Auto book on PayFast success or COD place  
- Checkout shipping fee UI  
- Advice / return remarks  
- Finance settlement dashboard  
- Cron auto-sync all shipments (admin Refresh is enough for MVP)  
- Multi-courier  

---

## Definition of Done (Phase 1)

- [ ] Env config documented in `.env.example`
- [ ] `DoDeliverService` covers cities, pickup, create, track, cancel, AWB
- [ ] `shipments` migration + model + order relation
- [ ] Admin can Book / Refresh / Cancel / AWB from order show
- [ ] PayFast and COD both use **same manual Book** button
- [ ] COD sends `cod = order.total`; non-COD sends `cod = 0`
- [ ] User order page shows tracking + timeline after book
- [ ] API key never in Inertia props or JS
- [ ] Test checklist below passed on staging/local with real or sandbox key

---

## Testing plan (how you will test)

### A. Prep

1. Get DoDeliver API key from portal (Api Key screen)
2. Note one **pickup_location_id** and **service** value from prerequisites
3. Put them in `.env`, `php artisan config:clear`
4. Have 2 test orders:
   - One **PayFast/paid** (or mark payment approved in admin for test)
   - One **COD**

### B. Service smoke (optional tinker / feature test)

| # | Case | Expected |
|---|------|----------|
| B1 | Cities search | `status: true`, cities list |
| B2 | Pickup locations | locations with `is_active` |
| B3 | Bad API key | Error message, no shipment row |

### C. Admin booking — PayFast-style order

| # | Steps | Expected |
|---|--------|----------|
| C1 | Admin confirms/reviews order | Order still no shipment |
| C2 | Click Book with DoDeliver | Success flash; `shipments.tracking_id` set; `cod_amount = 0` |
| C3 | Panel shows tracking + Booked (or API status name) | Visible |
| C4 | Refresh Track | `timeline` JSON updated; `last_synced_at` set |
| C5 | Print AWB | PDF download / open |
| C6 | Cancel | Status Cancelled on DoDeliver + local |
| C7 | Book again after cancel | New tracking_id (if product allows) |

### D. Admin booking — COD order

| # | Steps | Expected |
|---|--------|----------|
| D1 | Book COD order | `cod_amount` = order total sent to API |
| D2 | Track / AWB / Cancel | Same as PayFast path |

### E. Gates & errors

| # | Case | Expected |
|---|------|----------|
| E1 | Book cancelled order | Blocked |
| E2 | Book when active shipment exists | Blocked |
| E3 | Unsupported city | Clear validation/flash error; no half-saved tracking |
| E4 | DoDeliver downtime | Flash error; order unchanged |

### F. Customer

| # | Steps | Expected |
|---|--------|----------|
| F1 | Before book | No tracking / “Not shipped yet” |
| F2 | After book | Tracking + timeline on `/order/{orderNumber}` |
| F3 | View page source / Network | No `DODELIVER_API_KEY` |

### G. Security

| # | Case | Expected |
|---|------|----------|
| G1 | Logged-out POST book | Rejected |
| G2 | Normal user POST admin book URL | Rejected |
| G3 | Inertia props on order show | No api_key field |

---

## Suggested implementation order (dev)

1. Config + Service (cities/pickup first — read-only APIs)  
2. Migration + Model  
3. Book endpoint + admin button  
4. Track refresh + timeline UI (admin)  
5. Cancel + AWB  
6. User order tracking UI  
7. Full checklist C–G  

**Estimate (rough):** ~2–4 days for one developer familiar with the repo, pending real API key access.

---

## Success picture (what you will see)

| Role | Before Phase 1 | After Phase 1 |
|------|----------------|---------------|
| Admin | Only change order status | Book courier, see CN, track, cancel, print AWB |
| Customer | Only “processing/completed” | Sees DoDeliver tracking timeline after admin books |
| System | Address on order only | `shipments` linked to order with tracking_id |

---

## Next step after this plan

Implement Phase 1 in the order above, starting with `DoDeliverService` + config once API key is available.
