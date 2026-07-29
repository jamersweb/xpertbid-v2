---
title: DoDeliver shipping integration for XpertBid
date: 2026-07-29
status: implementation-ready
artifact_readiness: implementation-ready
---

# DoDeliver Shipping Integration Plan

## Problem / goal

XpertBid today creates orders with shipping **address only** and `shipping_cost = 0`. There is **no courier integration**. You want to use **DoDeliver** (`shipping/sACBpz.pdf`) as the shipping method so orders can be booked, tracked, cancelled, and settled (especially COD).

## Current state (what already exists)

| Area | Today |
|------|--------|
| Checkout | `CheckoutController@processCheckout` creates `Order` + `OrderItem`; shipping always `0` |
| UI | `resources/js/Pages/Checkout/Index.jsx` — `const shipping = 0; // TBD` |
| Order fields | Billing + shipping address strings, `shipping_cost`, `payment_method` includes `cod` |
| Statuses | `pending` / `processing` / `completed` / `cancelled` only (no shipped/delivered) |
| Admin | `Admin/Orders/Show.jsx` — status dropdown only |
| User | `/my-orders`, `/order/{orderNumber}` — address + status badges only |
| Config | No courier keys; follow `PayFastService` + `config/services.php` pattern |

**Source API doc:** `shipping/sACBpz.pdf` (DoDeliver portal APIs).

## Recommended product decisions

| Decision | Recommendation | Why |
|----------|----------------|-----|
| When to create DoDeliver order | **Always manual** for PayFast **and** COD: admin confirms order → “Book with DoDeliver” | Confirmed with product owner; no auto book |
| Shipping cost on checkout | Phase 1: keep `0` or fixed admin-config rate; Phase 2: service-based rates from DoDeliver | PDF doesn’t expose a clean public rate calculator in the summary APIs |
| City mapping | Map local city **name** → DoDeliver city `value`/`name`; cache DoDeliver cities | Orders store city as string today |
| Shipment data storage | New `shipments` table (1 order → 1 active shipment) | Keep `orders` clean; support rebook/cancel history |
| Order status vs courier status | Keep order `status`; add `shipment_status` on shipment | Don’t overload coarse order enum |
| COD | When `payment_method = cod`, send order `total` as DoDeliver `cod` | Matches COD payment already in checkout |
| Advice / remarks | Phase 2 | Needed for returns/reattempt; not required for first go-live |
| Finance settlement sync | Phase 2 | After booking + tracking work |

## Scope

### Phase 1 — MVP (must ship)

1. Config + `DoDeliverService` HTTP client (`api_key`)
2. DB: `shipments` (+ optional city cache)
3. Admin: Book / Track / Cancel / Print AWB on order detail
4. Persist `tracking_id`, courier timeline snapshot, AWB handling
5. User order detail: show tracking id + simple timeline
6. City list sync/helper for booking payload

### Phase 2 — Operations

1. Advice list + Add Remark (return / reattempt)
2. Finance status sync (COD settled or not)
3. Checkout shipping method UI (“DoDeliver”) + optional non-zero `shipping_cost`
4. Cron/job to refresh open shipment statuses
5. Bulk track for admin dashboards

### Out of scope (for now)

- Multi-courier abstraction (TCS/Trax beside DoDeliver)
- Customer self-serve “create label”
- Changing auction/listing international_shipping legacy fields

## Architecture

```text
Checkout (unchanged core)
  → Order (address + COD/total)
      → Admin “Book shipment”
          → DoDeliverService::createOrder()
          → shipments row (tracking_id, status, raw payload)
      → Track / Cancel / AWB via same service
User Order Show ← reads shipment + timeline
```

### DoDeliver APIs to use (Phase 1)

| Capability | API from PDF |
|------------|----------------|
| Auth | Portal API key (`api_key` query) |
| Cities | `GET /api/cities` (+ optional `/api/services/cities`) |
| Pickup locations | `GET` pickup locations |
| Create order | `POST /api/order` |
| List / track | `GET /api/orders`, `GET /api/orders/{tracking_id}` |
| Bulk track | `POST /api/track/orders` or `/api/track/order-status` |
| Cancel | `POST /api/orders/cancel` |
| AWB print | `POST /api/awb-print` |

### Phase 2 APIs

Finance status, advice lists, add remark.

## Data model changes

### New table: `shipments`

Suggested columns:

| Column | Purpose |
|--------|---------|
| `id` | PK |
| `order_id` | FK → orders |
| `provider` | `dodeliver` |
| `tracking_id` | DoDeliver tracking id |
| `pickup_location_id` | From DoDeliver pickup API |
| `service` / `service_name` | Delivery type from prerequisites |
| `cod_amount` | Amount sent to courier |
| `shipment_status` | Booked / Picked up / Out for delivery / Delivered / Cancelled / Returned… |
| `timeline` | JSON snapshot from track API |
| `awb_path` | Stored PDF path if saved locally |
| `last_synced_at` | Status refresh |
| `meta` | Raw API request/response (debug) |
| timestamps | |

Optional later: `dodeliver_cities` cache table (`id`, `name`, `value`).

### Config / env

```env
DODELIVER_BASE_URL=https://portal.dodeliver.com.pk
DODELIVER_API_KEY=...
DODELIVER_DEFAULT_PICKUP_LOCATION_ID=...
DODELIVER_DEFAULT_SERVICE=...
```

Wire in `config/services.php` as `services.dodeliver.*`.

## Files to add / change

| Action | Path |
|--------|------|
| Add | `app/Services/DoDeliverService.php` |
| Add | `app/Models/Shipment.php` |
| Add | `database/migrations/xxxx_create_shipments_table.php` |
| Add | `app/Http/Controllers/Admin/ShipmentController.php` (or methods on Admin OrderController) |
| Edit | `config/services.php`, `.env.example` |
| Edit | `routes/web.php` — admin shipment actions |
| Edit | `resources/js/Pages/Admin/Orders/Show.jsx` — Book / Track / Cancel / AWB |
| Edit | `resources/js/Pages/Orders/Show.jsx` — tracking + timeline |
| Optional Phase 2 | `Checkout/Index.jsx` — shipping method + cost |
| Optional | `app/Console/Commands/SyncDoDeliverShipments.php` |

**Patterns to copy:** `app/Services/PayFastService.php`, admin order show/updateStatus flow.

## Field mapping (Order → DoDeliver create)

| DoDeliver body | XpertBid source |
|----------------|-----------------|
| `consignee_name` | `shipping_name` / billing name |
| `consignee_contact_no` | `shipping_phone` |
| `consignee_address` | shipping address lines |
| `area` | shipping state/area if available; else `-` |
| `city` | Map to DoDeliver city value |
| `product_name` | First item title / order number |
| `service` | Config default or admin select |
| `pieces` | Sum of item quantities |
| `cod` | `total` if `payment_method=cod`, else `0` |
| `customer_reference` | `order_number` |
| `weight` | Default (e.g. `1`) or per-item later |
| `advice` | `orders.notes` |
| `pickup_location_id` | Env/admin default |

## Admin UX (Phase 1)

On `Admin/Orders/Show`:

1. If no shipment → **Book with DoDeliver** (confirm pickup + service)
2. If shipment exists → show tracking id, status, last sync
3. Buttons: **Refresh track**, **Cancel shipment**, **Print AWB**
4. Only allow book when payment is OK (paid/approved) **or** method is COD and order not cancelled

## User UX (Phase 1)

On `Orders/Show`:

- Tracking number
- Simple timeline (from `shipments.timeline`)
- Link/text “Shipped via DoDeliver”

## Security

| Risk | Mitigation |
|------|------------|
| API key leak | Server-side only; never expose key to Inertia/frontend |
| Unauthorized booking | Admin middleware + permission (reuse `order-list` or add `shipment-manage`) |
| Booking unpaid orders | Gate on payment_status / COD rules |
| Cancel abuse | Only admin; confirm dialog; log response |
| City injection | Validate against DoDeliver cities list |
| Webhook (if added later) | Signature/IP allowlist — PDF doesn’t document webhooks; prefer pull sync |

## Implementation sequence

1. Env + `DoDeliverService` (cities, pickup, create, track, cancel, awb) with logging
2. Migration + `Shipment` model + order relation
3. Admin book/track/cancel/awb routes + UI
4. User order tracking display
5. Manual smoke with sandbox/live API key
6. Phase 2: advice, finance, checkout shipping UI, status sync job

## Test scenarios (Phase 1)

1. Admin books COD order → DoDeliver returns `tracking_id` → shipment row saved
2. Non-COD paid order books with `cod = 0`
3. Track refresh updates `timeline` + `shipment_status`
4. Cancel updates local + remote status
5. AWB endpoint returns PDF / stores file
6. Guest/user order show displays tracking without API key exposure
7. Book blocked when order `cancelled`
8. Invalid city rejected with clear validation error
9. API failure surfaces admin error; order unchanged

## Risks

| Risk | Mitigation |
|------|------------|
| PDF URL inconsistency (portal vs ddworking host for pickup) | Make base URL + path configurable; verify with real key |
| City name mismatch | Sync cities; fuzzy map + admin override |
| Weight/service unknown at checkout | Defaults + admin edit before book |
| No webhooks | Polling command for open shipments |
| Stripe `status='paid'` bug in checkout | Fix separately; don’t depend on it for shipping gate |

## Success criteria (MVP)

- Admin can book a real DoDeliver CN from an XpertBid order
- Tracking id + timeline visible to admin and customer
- Cancel + AWB print work from admin
- API key never reaches the browser
- COD amount correctly passed for COD orders

## Open question (confirm before coding)

**Shipment create trigger:** Admin manual book (recommended) vs auto on payment success?

Default in this plan: **manual admin book**.
