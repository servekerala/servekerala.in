# Internal SERP Position Tracker

The admin dashboard's **SEO** tab now includes position tracking. It checks Google organic results through DataForSEO, compares ServeKerala.in with up to five competitor domains, and saves campaign history to Firestore.

## One-time setup

1. Create DataForSEO API credentials in [API Access](https://app.dataforseo.com/api-access).
2. Add `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` as server-side environment variables in Vercel. For local development, add them to the ignored `.env.local` file. Never put these credentials in browser JavaScript or commit them.
3. Publish the Firestore rules from `firestore.rules` so only the verified ServeKerala admin can read or write campaign settings and ranking snapshots. For example: `firebase deploy --only firestore:rules`.
4. Open `/admin/`, choose **SEO**, save the position tracking campaign, and run a check.

The API verifies the Firebase ID token server-side and requires the verified `servekerala.in@gmail.com` admin account. DataForSEO credentials stay on the server. Running checks is manual and on demand; each tracked keyword is a billable request, and Top 100 depth may cost more than Top 10. Review the provider's current pricing before enabling deeper checks.

## Campaign format

Enter one keyword per line. Add the Google location after `|`, for example:

```text
plumber in Thiruvalla|Thiruvalla,Kerala,India
electrician in Kottayam|Kottayam,Kerala,India
```

Set competitor domains without a protocol, such as `justdial.com, naatilepani.com`. The Google location string must match a location supported by the provider; if one is rejected, use DataForSEO's Google locations list to choose the closest supported target.

The visibility index is an internal campaign trend measure, not Semrush's proprietary Visibility metric. Each tracked keyword contributes `(101 - position)%` when the site ranks from 1 to 100, and zero when it is absent; the result is averaged across successful keyword checks. Competitors use the same formula for a like-for-like trend.

## What the tracker measures

- Latest organic position and result URL for the target domain and configured competitors
- Search location, language, device, and top 10 or top 100 organic result depth
- Campaign visibility, top 10 keyword count, history, and provider-reported request cost

This version checks organic web results. It does not collect Google Maps/local pack rankings or backlinks. It does not run checks on a recurring schedule; automatic weekly checks should be enabled only after choosing a provider budget and schedule.
