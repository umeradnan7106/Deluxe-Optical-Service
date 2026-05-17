# Feature Specification: Deluxe Opt Service — Complete E-Commerce Website

**Feature Branch**: `001-complete-website`
**Created**: 2026-05-17
**Status**: Draft
**Input**: Complete Pakistani eyewear e-commerce website — frontend, backend, admin panel,
email system, and all supporting content pages.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Guest Customer Completes a Purchase (Priority: P1)

A new visitor browses the eyewear catalogue, selects a frame, customises their lenses with
a prescription, selects a payment method, enters their delivery details, and receives an
order confirmation with a unique order number.

**Why this priority**: This is the primary revenue-generating flow. Every other capability
in the system either supports or depends on this journey completing successfully.

**Independent Test**: Can be fully tested by placing a guest order end-to-end from the
product listing page through to the order confirmation page, then verifying the order
appears in the admin panel with correct totals and prescription data.

**Acceptance Scenarios**:

1. **Given** a visitor on the product listing page, **When** they apply a category or
   gender filter, **Then** only matching products are displayed with a visible result count.
2. **Given** a visitor on a product detail page, **When** they click "Select Your Lenses",
   **Then** they reach the 5-step lens selection flow for that specific frame.
3. **Given** a customer in the lens selection flow who manually enters a prescription,
   **When** the OD/OS difference exceeds safe thresholds, **Then** a non-blocking warning
   is shown and the customer can still proceed.
4. **Given** a customer who selects EasyPaisa as payment method in the cart, **Then** the
   cart total reflects a 15% payment discount applied to the pre-shipping subtotal.
5. **Given** a cart with subtotal at or above Rs. 3,000, **When** the customer views the
   cart summary, **Then** the shipping fee shows as Rs. 0 (free delivery).
6. **Given** a customer who submits a valid checkout form, **Then** they are redirected to
   an order confirmation page showing their unique DOS-YYYY-XXXX order number, and they
   receive a confirmation email.

---

### User Story 2 — Customer Tracks an Order Without Logging In (Priority: P1)

Any person — guest or registered — can look up the status of an order using only the
order number or their phone number, without needing an account.

**Why this priority**: Pakistani e-commerce customers frequently order as guests and rely
on phone-based tracking. This reduces inbound support requests and builds customer trust.

**Independent Test**: Can be tested by placing a guest order then immediately looking it
up on the tracking page using the order number.

**Acceptance Scenarios**:

1. **Given** the order tracking page, **When** a user enters a valid order number,
   **Then** the system shows the order status, a 4-step timeline, and the items ordered.
2. **Given** the tracking page, **When** a user enters a registered phone number,
   **Then** all orders associated with that phone number are shown.
3. **Given** an order with status "Shipped", **When** the customer tracks it, **Then** the
   tracking number provided by the admin is visible in the timeline.

---

### User Story 3 — Registered Customer Manages Their Account (Priority: P2)

A registered customer can view their order history, manage their wishlist, update profile
information, and change their password — all within a personal account dashboard.

**Why this priority**: Account features drive repeat purchases and retention, but require
the core shopping and order system to exist first.

**Independent Test**: Can be tested independently by registering an account, placing an
order, and verifying it appears in the orders tab with correct status and details.

**Acceptance Scenarios**:

1. **Given** a logged-in customer visits My Account → Orders, **Then** all their past
   orders are listed with order ID, date, total, and current status pill.
2. **Given** a logged-in customer adds a product to their wishlist, **Then** it appears in
   My Account → Wishlist and the product card shows a filled heart icon.
3. **Given** a logged-in customer updates their full name and saves, **Then** the change
   is reflected immediately in the account sidebar.

---

### User Story 4 — Admin Manages Products and Inventory (Priority: P2)

An admin can add new products with multiple colour/size variants, upload images, assign
lens options, set pricing, and directly adjust stock levels from the inventory page.

**Why this priority**: Without products in the catalogue no purchase is possible. Admin
product management directly unblocks the customer shopping flow.

**Independent Test**: Can be tested by creating a new product in the admin panel and
verifying it appears on the public listing page (when Active).

**Acceptance Scenarios**:

1. **Given** an admin submits the Add Product form with all required fields, **Then** the
   product is visible on the public listing page when its status is Active.
2. **Given** an admin adds a new colour/size variant with a stock quantity, **Then** the
   variant is selectable on the product detail page.
3. **Given** a variant whose stock is at or below the product's low-stock threshold,
   **When** an admin opens the Inventory page, **Then** that variant is highlighted as
   "Low Stock".
4. **Given** an admin clicks a stock number on the Inventory page and enters a new value,
   **Then** the stock updates immediately without leaving the page.

---

### User Story 5 — Admin Processes Orders and Triggers Status Emails (Priority: P2)

An admin can view all orders, update their status through the fulfilment lifecycle, add a
tracking number when shipping, and the customer receives an automated email at each change.

**Why this priority**: Order fulfilment is the core operational need after purchase. Without
it, placed orders have no lifecycle beyond "Placed".

**Independent Test**: Can be tested by placing an order, updating its status in the admin
panel, and verifying the corresponding customer email is sent.

**Acceptance Scenarios**:

1. **Given** an admin filters the Orders list by "Pending", **Then** only newly placed
   orders are displayed.
2. **Given** an admin changes an order status to "Shipped" and enters a tracking number,
   **Then** the customer receives a Shipped email containing the tracking number.
3. **Given** an admin marks an order as "Delivered", **Then** the system schedules a
   review-request email to be sent to the customer 3 days later.

---

### User Story 6 — Admin Moderates Customer Reviews (Priority: P3)

All customer-submitted reviews start unapproved. An admin reviews queued feedback,
approves or rejects each one, and can feature select reviews for homepage display.

**Why this priority**: Review moderation protects the brand from spam while social proof
from approved reviews drives conversions. Depends on the order and product systems.

**Independent Test**: Can be tested by submitting a review via the product detail page
and verifying it appears in the admin's Pending reviews tab.

**Acceptance Scenarios**:

1. **Given** a customer submits a review, **When** an admin visits Reviews → Pending,
   **Then** the new review appears in the queue.
2. **Given** an admin approves a review, **Then** it becomes visible on the public product
   detail page.
3. **Given** an admin marks a review as featured, **Then** it appears in the homepage
   customer reviews strip.

---

### User Story 7 — Admin Creates and Publishes Blog Content (Priority: P3)

An admin writes blog articles using a rich text editor, sets a category and cover image,
and either saves as draft or publishes. Published articles appear on the public blogs page.

**Why this priority**: Content marketing supports organic traffic. Depends on the core
platform being live.

**Independent Test**: Can be tested by creating a blog post in the CMS and verifying it
appears on the public `/blogs` page only after publishing.

**Acceptance Scenarios**:

1. **Given** an admin saves a blog post as Draft, **Then** it is NOT visible on the
   public blogs listing page.
2. **Given** an admin clicks Publish, **Then** the blog becomes visible on the public
   listing page with its published date.

---

### User Story 8 — System Recovers Abandoned Carts (Priority: P4)

If a customer adds items to their cart but does not complete checkout within 2 hours,
and an email address is available, the system automatically sends a cart reminder.

**Why this priority**: Abandoned cart recovery directly recovers lost revenue. Depends on
the cart and email infrastructure.

**Independent Test**: Can be tested by saving a cart with an email address and verifying
the reminder triggers after the configured window (shortened in a test environment).

**Acceptance Scenarios**:

1. **Given** a visitor adds items to cart and an email is captured, **When** 2 hours pass
   without an order being placed, **Then** an abandoned cart reminder email is sent.
2. **Given** a visitor completes checkout before the 2-hour mark, **Then** no abandoned
   cart email is sent.

---

### Edge Cases

- What happens when a customer attempts to checkout a product variant that went out of
  stock between adding to cart and order submission (race condition)?
- How does the system handle coupon discount stacked on top of a 15% payment discount —
  are both accurately reflected in the final server-side total?
- What is displayed if a guest enters a phone number with no matching orders on the
  tracking page?
- What happens if a prescription photo upload fails mid-lens-selection flow?
- When a customer selects "Non-Rx" lens type in step 1, are the prescription entry steps
  skipped entirely, or are they shown but marked optional?
- What happens to an approved review if its associated order is later cancelled?
- What happens when an admin soft-deletes a product that has active orders referencing it
  — are those orders still accessible in the admin panel?

---

## Requirements *(mandatory)*

### Functional Requirements

**Customer-Facing Shopping**

- **FR-001**: Customers MUST be able to browse all products and filter by category, gender,
  frame shape, material, and price range, and sort by newest, price ascending/descending,
  best-selling, and top-rated.
- **FR-002**: Each product listing MUST display all available colour and size variants as
  selectable options, with price and stock availability updating per selection.
- **FR-003**: Customers MUST be able to configure prescription lenses through a guided
  5-step flow: lens type → prescription entry → coating → add-ons → review summary.
- **FR-004**: Prescription entry MUST use dropdown controls only (SPH, CYL, Axis, ADD, PD);
  free-text prescription input is not permitted at any point.
- **FR-005**: The system MUST show a non-blocking warning when the OD/OS prescription
  difference exceeds safe thresholds, but MUST allow the customer to proceed regardless.
- **FR-006**: Customers MUST be able to upload a prescription photo as an alternative to
  manual dropdown entry.
- **FR-007**: The cart MUST automatically apply a 15% discount when EasyPaisa, JazzCash,
  or Bank Transfer is selected; Cash on Delivery receives no discount.
- **FR-008**: Shipping MUST be free for orders totalling Rs. 3,000 or more after discounts;
  a Rs. 200 fee applies below that threshold.
- **FR-009**: Coupon code discounts and payment-method discounts MUST stack; both are
  reflected in the final order total.
- **FR-010**: All price totals (frame + lens + coating + add-ons − discounts + shipping)
  MUST be calculated and validated server-side; the frontend displays but does not
  determine the authoritative total.
- **FR-011**: Guest checkout MUST be supported; no account is required to place an order.

**Order Management**

- **FR-012**: Each order MUST receive a unique order number in the format DOS-YYYY-XXXX,
  generated server-side at the moment of order creation.
- **FR-013**: Orders MUST follow the status flow: Placed → Processing → Shipped →
  Delivered. Cancellation is permitted from any status except Delivered.
- **FR-014**: Customers MUST be able to track their order by entering only their order
  number or registered phone number, without logging in.
- **FR-015**: When an order is placed, the stock for the purchased variant MUST be
  decremented server-side to prevent overselling.

**Account Management**

- **FR-016**: Customers MUST be able to register with full name, email, phone number, and
  password; they are automatically logged in upon successful registration.
- **FR-017**: Registered customers MUST be able to view their complete order history with
  each order's status, total, date, and a link to full order detail.
- **FR-018**: Registered customers MUST be able to add and remove products from a personal
  wishlist; wishlist state MUST persist across sessions.
- **FR-019**: Registered customers MUST be able to update their profile (name, phone,
  email) and change their password from the account dashboard.
- **FR-020**: Customers who forget their password MUST be able to request a reset link
  sent to their registered email; the link MUST expire after 1 hour.

**Review System**

- **FR-021**: Any visitor MUST be able to submit a review with a 1–5 star rating, title,
  body text, and optional photos.
- **FR-022**: All reviews MUST default to unapproved status; they become publicly visible
  only after explicit admin approval.
- **FR-023**: Approved reviews linked to a confirmed order MUST display a "Verified
  Purchase" badge.

**Admin Operations**

- **FR-024**: Admins MUST be able to create, edit, and soft-delete products (inactive
  products are hidden from public but not erased from the database).
- **FR-025**: Admins MUST be able to manage product variants (colour, size, stock quantity,
  price override) and upload, reorder, and delete product images.
- **FR-026**: The first image in sort order MUST be used as the main product thumbnail
  everywhere on the site.
- **FR-027**: Admins MUST be able to assign specific lens option sets (types, coatings,
  add-ons) to individual products; lens options shown in the lens selection flow are
  limited to those assigned to the current product.
- **FR-028**: Admins MUST be able to update stock quantities per variant directly from the
  Inventory page without opening the full product edit form.
- **FR-029**: The admin dashboard MUST display: today's order count, today's revenue,
  pending order count, and low-stock item count — refreshed on each page load.
- **FR-030**: Admins MUST be able to update an order's status and add a tracking number
  when marking it as "Shipped".
- **FR-031**: Admins MUST be able to approve, reject, or feature individual customer
  reviews from the Reviews panel.
- **FR-032**: Admins MUST be able to create, edit, publish, and unpublish blog articles
  with a rich text editor, cover image upload, category, and SEO metadata.
- **FR-033**: Admins MUST be able to create and manage promotional coupon codes with
  configurable discount type (percentage or fixed), minimum order value, usage limits,
  and expiry date.
- **FR-034**: Admins MUST be able to manage the FAQ catalogue including category grouping
  and custom display order.
- **FR-035**: Admins MUST be able to manage lens options (types, coatings, add-ons)
  including pricing, descriptions, active status, and display order.

**Email Communications**

- **FR-036**: The system MUST send automated emails for each of the following triggers:
  new registration (welcome), order placed (confirmation with all order details), order
  status changed to Processing, order status changed to Shipped (includes tracking number),
  order status changed to Delivered, abandoned cart (2 hours after cart creation with no
  order), review request (3 days after delivery), and password reset.
- **FR-037**: All emails MUST be sent asynchronously so they do not delay or block the
  customer-facing HTTP response.
- **FR-038**: Password reset links MUST expire 1 hour after issuance.

### Key Entities

- **Product**: An eyewear item with a name, category (sunglasses, prescription, blue-cut,
  screen, transition, kids), gender, frame shape, material, pricing (original and optional
  sale price), rich-text description, frame dimension measurements, and SEO metadata. Has
  multiple variants and images.
- **Product Variant**: A specific colour/size combination of a product with its own stock
  count and optional price override. Identified by a unique SKU variant code.
- **Lens Option**: A configurable lens upgrade of type "lens-type", "coating", or "add-on"
  with a name, price, and description. Options are individually assigned per product.
- **Order**: A customer's purchase of a product variant with optional lens customisation
  and prescription. Contains customer contact info, delivery address, payment method,
  all line-item prices, applied discounts, shipping fee, and current status.
- **Review**: Customer feedback for a product with a star rating (1–5), title, body, and
  optional photos. Requires admin approval before becoming public.
- **Promo Code**: A discount token (percentage or fixed amount) with optional minimum
  order threshold, usage cap, and expiry date.
- **Blog**: An editorial article with a title, rich-text body, cover image, category
  (lens-guide, frame-style, eye-health, prescription-tips), and published/draft status.
- **FAQ**: A question-answer pair assigned to a category and a custom display sort order.
- **Lens Collection**: A homepage marketing unit pairing a lens type (e.g. Transitions)
  with a promotional video, bullet points, and a starting price.
- **Abandoned Cart**: A record of a cart session with an associated email address,
  capturing item data and whether the recovery email has already been sent.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new visitor can go from the homepage to a completed order (including lens
  selection) in under 5 minutes on both desktop and mobile.
- **SC-002**: A customer can retrieve their order status within 10 seconds of entering a
  valid order number or phone number on the tracking page.
- **SC-003**: All customer-facing pages are fully usable on screens as narrow as 365px
  with no horizontal scrolling.
- **SC-004**: 100% of transactional emails (confirmation, shipped, delivered) reach the
  customer's inbox within 2 minutes of the triggering event.
- **SC-005**: An admin can view, update the status of, and add a tracking number to an
  order within 60 seconds of opening the order detail page.
- **SC-006**: A product created and set to Active by an admin appears on the public
  listing page within 30 seconds of saving.
- **SC-007**: All customer-submitted reviews appear in the admin pending queue within
  30 seconds of submission.
- **SC-008**: Abandoned cart emails are triggered within 5 minutes of the 2-hour window
  closing (allowing for scheduler polling tolerance).
- **SC-009**: The admin inventory page visually distinguishes In Stock, Low Stock, and
  Out of Stock states for every variant at a glance.
- **SC-010**: The complete checkout flow (cart → checkout → confirmation) can be
  completed by a guest customer with no account and no prior session data.

---

## Scope

### In Scope

- All 19 customer-facing pages (homepage, product listing, product detail, lens selection,
  cart, checkout, order confirmation, order tracking, account pages, auth pages, about,
  contact, FAQ, blogs, lens guide, shipping & returns)
- All admin panel pages (dashboard, products add/edit, orders list/detail, reviews,
  blogs CMS, inventory, promo codes, lens options, FAQs, lens collection)
- Complete backend API (auth, products, orders, reviews, cart utilities, wishlist, file
  uploads, blogs, FAQs, lens collection, and all admin endpoints)
- Full database schema (all models with relationships, constraints, and enum values)
- 8 transactional email templates delivered via the Resend API
- Automated email scheduling: abandoned cart (2-hour trigger) and review request (3-day
  trigger post-delivery)
- Mobile-responsive layout (min 365px) for all customer-facing and admin pages

### Out of Scope

- Live payment gateway processing (EasyPaisa/JazzCash/Bank Transfer are selection-only;
  no real-time payment processing in v1)
- Urdu language support
- Live chat widget
- Product comparison feature
- Advanced analytics beyond the admin dashboard stats (no third-party analytics platform)

### Assumptions

- The wireframe at `wireframe/DeluxeOpt_Wireframe_Complete.html` is the definitive visual
  source of truth for all page layouts; no layout decision may deviate from it.
- A Supabase PostgreSQL database, Cloudinary account, and Resend account are provisioned
  before development begins.
- All v1 orders use manual payment collection (customer pays via bank transfer, EasyPaisa
  app, or cash on delivery); no payment gateway integration is required.
- The admin panel is accessible only to users flagged as admin; there is no separate
  super-admin tier in v1.
- Pakistani city and province lists are stored as application constants, not in the
  database.
- Product and blog slugs are auto-generated from the name/title but can be manually
  overridden in the admin form.
