# Borneo Business Data Compliance Guardrail

This document is an operating rule for future product and data work. It is not legal advice and should be reviewed with qualified counsel before high-risk expansion.

## Product boundary

Borneo Business is an independent business-intelligence platform. It does not act as a government procurement portal, tender issuer or official representative of any source organisation.

Core rule:

> Facts are sourced. Calculations are explained. Assessments are transparent.

## Lines we do not cross

1. Do not present Borneo Business as an official government service, partner or endorsed platform unless a real written relationship exists.
2. Do not reuse government logos, seals, source-site visual identity or trademarks in a way that implies endorsement.
3. Do not mirror whole procurement websites or reproduce substantial copyrighted page/document content when the reuse right is not explicit.
4. Prefer factual extraction: reference, title, buyer, dates, status, amount, successful tenderer and other necessary factual fields.
5. Preserve source URL, publisher, observed/checked date and official-vs-platform classification wherever practical.
6. Do not bypass login walls, CAPTCHA, robots/access controls, rate limits, authentication or other technical restrictions.
7. Do not infer tender-specific eligibility such as CIDB, UPKJ, MOF or Bumiputera requirements unless the official tender source explicitly supports it.
8. Do not turn historical award observations into claims of preference, corruption, affiliation, guaranteed future success or special relationships.
9. Do not publish sensitive personal data merely because it appears somewhere online. Natural-person names, direct phone numbers, email addresses and other identifiers require a separate necessity/privacy review.
10. Do not fabricate traction, award likelihood, match percentages, verified business generated or other metrics.
11. Open-data permission does not automatically grant rights to government logos, third-party works, personal data or material outside the licensed dataset.
12. Unknown sources default to manual review. Automation is opt-in after a reuse basis is recorded.

## Source review record

Every new source should have these fields before automated ingestion is enabled:

- Source name and owner
- Host / URL pattern
- Official or non-official
- Licence / terms / reuse basis
- Reuse class: `open-data`, `public-facts-only`, `manual-review`, or `blocked`
- Attribution required
- Personal-data risk
- Crawl method
- Rate/access restrictions
- What fields may be stored
- What content must not be copied
- Last review date

The code registry lives in `lib/source-compliance.ts`.

## Default handling

### Open data
Use official API/download methods where possible, retain attribution/licence context, and separate dataset rights from logos, third-party rights and personal data.

### Public procurement pages with no clear broad reuse licence
Index minimal factual fields required for discovery/analysis, preserve a deep link to the official source, and do not mirror the source page or substantial narrative/document content.

### Unknown source
No automated ingestion. Review first. If commercially important before review is complete, store only a source link and minimal factual metadata that has been manually approved.

### Blocked source
Do not ingest, cache, reproduce or attempt to circumvent the restriction.

## Analysis language

Allowed examples:
- "Observed 12 published awards in the records currently indexed."
- "This buyer has published opportunities recently."
- "This company appears in 4 indexed award results."

Avoid claims such as:
- "This buyer prefers this company."
- "This company has connections with the agency."
- "You have an 80% chance of winning."
- "CIDB G5 is required" unless the specific official notice says so.

## Review trigger

Re-review a source when:
- terms/licence changes;
- access starts requiring login/CAPTCHA;
- robots/access controls change;
- the source owner asks for modification/removal;
- new personal-data fields appear;
- Borneo Business wants to republish more than factual metadata;
- the product expands into paid redistribution of source documents.
