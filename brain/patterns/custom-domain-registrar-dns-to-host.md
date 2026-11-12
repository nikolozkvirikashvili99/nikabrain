---
name: custom-domain-registrar-dns-to-host
description: Connecting a bought domain to a host (Vercel etc.). Keep DNS at the registrar, delete the registrar's parking defaults (ALIAS/`*` CNAME/URL forwarding), copy the host's project-specific records, then prove it with nslookup against the registrar NS and a public resolver plus `curl -sIL`.
metadata:
  type: project
  status: confirmed 2026-11-12
---

**In short:** the domain lives at the registrar, the site lives on the host, and two DNS records connect them. A registrar's own parking records silently win until you delete them.

1. **Pick a registrar separate from the host.** It's about the same price, and changing host later only means changing DNS records. Buying through the host ties you to it. Registrars like Cloudflare require their own DNS, and their proxy (orange cloud) conflicts with Vercel's SSL. On a Vercel site, use "DNS only".
2. **Copy the records from the project's Domains page** (Vercel → project → Domains → expand "Invalid Configuration"), not from blog posts or the team Domains page. Its form shows placeholder IPs. Vercel now gives project-specific values (A `216.198.79.1`, CNAME `<hash>.vercel-dns-0xx.com`), not the old `76.76.21.21`.
3. **At the registrar, delete the parking defaults:** Porkbun ships an `ALIAS @` and `CNAME *` → `uixie.porkbun.com`, plus "URL forwarding: Configured". Keep the MX and SPF (email forwarding) records.
4. **Prove it from outside** (seconds, no waiting on the dashboard):
   `nslookup -type=A domain <registrar-ns>` and `… 1.1.1.1`, then `nslookup -type=CNAME www.domain 1.1.1.1`. Then run `curl -sIL http://domain` and expect a chain of 308s ending in `200` from `server: Vercel`, with the right `<title>`.

Picking a name: check the ending exists in IANA's list (`data.iana.org/TLD/tlds-alpha-by-domain.txt`). Nika asked about `.lens`, which isn't an ending. Compare **renewal** prices, not first-year prices (`.photography` costs about $5 the first year, then about $29 a year). Read joined words aloud to catch bad splits (a name ending in "-mi" + "lashes" reads as "-mil ashes"; "lashesby<name>" avoids it). Comparison sites lag behind wholesale price changes: the 2026-11-01 .com increase made $11.08 → $11.81 at checkout.

**Why:** 2026-11-12, first custom domain. The DNS lookup showed the domain still pointing at the parking page until both defaults were deleted. After the fix, both DNS checks and the redirect chain passed on the first check.
**How to apply:** any "connect my domain" or "which domain" request.
**Signal:** a registrar screenshot showing "URL forwarding: Configured", or a host showing "Invalid Configuration".
**Next time:** ask Nika for screenshots of the registrar DNS list and the host's project Domains page in one go, and run the nslookup check before *and* after the change.
Related: [[outward-claims-carry-their-proof]].
