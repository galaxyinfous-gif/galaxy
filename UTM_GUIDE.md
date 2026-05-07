# UTM Reference Guide — Galaxy IT & Marketing

Use these exact links in your social bios, email signatures, EDDM QR codes, and ads so GA4 can attribute every visit to the right channel. The site has a **referrer-based fallback** in `analytics.js` so attribution still works if you forget — but explicit UTMs are always more reliable than inferred ones.

## Format
`https://galaxyinfo.us/?utm_source={where}&utm_medium={how}&utm_campaign={why}`

- **utm_source** = the platform (instagram, facebook, youtube, email, eddm)
- **utm_medium** = the placement (bio, post, signature, qr, paid, organic)
- **utm_campaign** = the reason (galaxy_main, monthly_report, summer_2026)

## Bio links (paste in profile)

| Profile | URL to paste |
|---------|--------------|
| Instagram bio | `https://galaxyinfo.us/?utm_source=instagram&utm_medium=bio&utm_campaign=galaxy_main` |
| Facebook page bio | `https://galaxyinfo.us/?utm_source=facebook&utm_medium=bio&utm_campaign=galaxy_main` |
| YouTube About | `https://galaxyinfo.us/?utm_source=youtube&utm_medium=bio&utm_campaign=galaxy_main` |
| LinkedIn page | `https://galaxyinfo.us/?utm_source=linkedin&utm_medium=bio&utm_campaign=galaxy_main` |
| Google Business Profile website button | `https://galaxyinfo.us/?utm_source=gbp&utm_medium=profile_button&utm_campaign=local_search` |
| WhatsApp Business profile | `https://galaxyinfo.us/?utm_source=whatsapp&utm_medium=profile&utm_campaign=galaxy_main` |

## Email signatures

| Use case | URL |
|----------|-----|
| Galaxy IT team email signature | `https://galaxyinfo.us/?utm_source=email&utm_medium=signature&utm_campaign=team` |
| Monthly client report email | `https://galaxyinfo.us/?utm_source=email&utm_medium=client_report&utm_campaign=monthly_report` |
| Cold outreach email | `https://galaxyinfo.us/consultation?utm_source=email&utm_medium=cold_outreach&utm_campaign=YYYY_MM` |

## EDDM / Print campaigns

| Where | URL (encode in QR code) |
|-------|--------------------------|
| EDDM postcard May 2026 | `https://galaxyinfo.us/consultation?utm_source=eddm&utm_medium=print&utm_campaign=2026_05_postcard` |
| Door hanger | `https://galaxyinfo.us/?utm_source=door_hanger&utm_medium=print&utm_campaign=YYYY_MM` |
| Trade show flyer | `https://galaxyinfo.us/?utm_source=tradeshow&utm_medium=print&utm_campaign=event_name` |

## Paid ads

| Channel | URL pattern |
|---------|-------------|
| Google Ads (use auto-tagging + utm_source=google) | `&utm_medium=cpc&utm_campaign={CampaignId}&utm_term={Keyword}` |
| Meta Ads (Facebook/Instagram) | `&utm_source=meta&utm_medium=paid_social&utm_campaign={ad_set_name}` |
| Local Service Ads | `?utm_source=lsa&utm_medium=paid&utm_campaign=local_service_ads` |

## Verifying it works

1. Click any bio link from your phone (don't be logged in to Galaxy)
2. Open GA4 → Reports → Acquisition → Traffic acquisition
3. Within 30 seconds you should see the visit with the correct `Session source / medium`

## Checking which links currently lack UTMs

Run from any social profile manager: pull your Instagram bio, Facebook About, YouTube About, GBP website button, every email signature in Gmail. If the link is bare `galaxyinfo.us` without `?utm_source=`, replace it with one of the URLs above.

## Why this matters

Without UTMs, every Instagram visit shows up as "instagram.com / referral" or worse, "(direct) / (none)" — which makes the monthly client report blind on attribution. With UTMs, you can answer "did the May Instagram campaign actually drive any consultations?"
