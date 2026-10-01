# Security Specification: Verdant Threads E-Commerce

## 1. Data Invariants
- Products and categories are publicly readable for storefront browsing.
- Only verified administrators (present in `/admins/{uid}`) can create, edit, or delete products, categories, store settings, and notifications.
- Any customer (guest or authenticated) can submit a new purchase order with validated fields, positive quantities, and valid totals.
- Customers can only read orders associated with their own `customerId`. Admins can read and update all orders.
- Customers cannot tamper with product prices or modify existing orders once placed.
- User profile data is isolated to `/users/{userId}` where only the matching `request.auth.uid` can read or write their own profile, or an admin.
- Store notifications are strictly accessible only by administrators.
- In-memory/client-side claims are rejected; admin verification checks the `/admins/{userId}` document.

## 2. Dirty Dozen Payloads (Designed to Fail)
1. **Unauthenticated Product Injection**: Guest user attempts `setDoc` on `/products/malicious-item` -> Expect PERMISSION_DENIED.
2. **Customer Price Alteration**: Non-admin user attempts `updateDoc` on `/products/tshirt-1` changing `price: 1` -> Expect PERMISSION_DENIED.
3. **Ghost Field Injection in Order**: Order creation including unauthorized system field `isFulfilled: true` or `role: 'admin'` -> Expect PERMISSION_DENIED.
4. **Order State Shortcutting**: Non-admin attempting to mark an order as `Delivered` -> Expect PERMISSION_DENIED.
5. **PII Snooping on User Profiles**: Customer A attempting to read `/users/CustomerB` -> Expect PERMISSION_DENIED.
6. **Notification Hijacking**: Regular customer attempting to read `/notifications` stream -> Expect PERMISSION_DENIED.
7. **Admin Self-Promotion**: Customer attempting to create a document in `/admins/{their_uid}` -> Expect PERMISSION_DENIED.
8. **Negative Order Total**: Order payload with `total: -50` -> Expect PERMISSION_DENIED.
9. **Junk ID Poisoning**: Document creation with 2KB junk character ID -> Expect PERMISSION_DENIED.
10. **Store Settings Overwrite**: Unauthenticated user attempting to alter `freeShippingThreshold` or payment config -> Expect PERMISSION_DENIED.
11. **Cross-Customer Order Query**: Customer query listing all orders without `customerId == auth.uid` constraint -> Expect PERMISSION_DENIED.
12. **Review Impersonation/Spam**: Over-sized review payload (>2000 chars) -> Expect PERMISSION_DENIED.
