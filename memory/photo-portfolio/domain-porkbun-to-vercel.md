---
name: domain-porkbun-to-vercel
description: Live domain maiagabunia.com is registered at Porkbun and points at the Vercel project photo-portfolio (set up 2026-11-12)
metadata:
  node_type: memory
  type: project
  originSessionId: 3dc48b6d-99db-47d7-9eea-94f53f9a61d2
  modified: 2026-11-12T18:24:13.733Z
---

Since 2026-11-12, the site is live at https://www.maiagabunia.com. The bare domain gets a 308 redirect to www.
- Registrar: Porkbun. DNS stays at Porkbun (not Vercel DNS). Auto-renew, domain lock and WHOIS privacy are ON. Renews 2027-11-12, about $11.81.
- Porkbun records: A `@` → 216.198.79.1; CNAME `www` → project-specific `…vercel-dns-017.com` (copied from Vercel → project → Domains). The parking ALIAS and `*` CNAME were deleted. Porkbun's email-forwarding MX and SPF records were kept.
- Vercel: the domain is attached to project `photo-portfolio`, which deploys from the `master` branch through Git.

**Why:** Nika plans to move from Vite to Next.js. The registrar was kept separate from the host so that switching hosts only means changing DNS records.
**How to apply:** For the Next.js move, keep the same Vercel project and change Framework Preset from Vite to Next.js, so the domain needs no change. Old `#album/<slug>` links need a client-side redirect, because a server redirect never sees the part after `#`. Verify with `nslookup` + `curl -sIL` against Porkbun's nameserver and 1.1.1.1.
