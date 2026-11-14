<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Keep illustrative specialist listings and distance/filter logic in a browser-safe module; clearly distinguish sample credentials and prices from verified live listings.
- Use a dedicated specialist detail route shared by Discover, Pros, and feed links so provider information has one presentation.
- Use shared layout tokens for viewport sizing and safe-area navigation; keep the vertical feed portrait-framed on wide screens.
- Keep creator and brand workspaces under the authenticated layout, with owner-scoped database policies and validated server functions; workspace enrollment grants access only to the caller's own records.
- Treat content licensing as explicit creator opt-in and request/response interest, not a rights transfer or payment; expose only opt-in catalog fields to brands.
- Keep illustrative service posts separate from product wear tests and interleave them without assigning Skin Twin scores to salon services.
- Store signed-in canvas profiles in Cloud while retaining guest exploration locally; never expose canvas profiles to business workspaces or invent performance statistics.
- Keep Atlas brands and countries in a shared browser-safe catalog with canonical IDs; multiple discovery regions must not duplicate records.
- Keep ingredient education source-backed and separate from illustrative product claims; absent verification must produce an unknown state, never a compatibility score.
- Render founder biographies only on the shared brand detail page; product and feed entry points link there rather than duplicating the story.
- Persist Atlas follows and destination-specific interest locally until notification delivery is connected; never describe saved interest as delivered alerts or purchases.
- Publish consumer media through owner-validated server functions and a private bucket with public read access only for published posts; keep licensing opt-in separate from publication.
- Keep owned shelf, wishlist, empty-bottle logs and notification preferences distinct in local collection state; never treat enabling preferences or logging empties as delivered notifications or verified rewards.
- Filter feed tabs using explicit tutorial types and followed author/brand IDs; do not relabel illustrative wear tests as educational tutorials.
- Recover route-module download failures with an explicit full-page reload; router invalidation alone reuses a rejected lazy import, so never auto-reload in a loop.
- Keep temporary discovery canvases in provider memory, separate from persisted profiles; browsing must never overwrite the account canvas.
- Read skin needs through the shared legacy-compatible tag helper and derive discipline filters centrally; multiple selections and hidden filters must behave consistently.
- Group product discovery without changing shade-specific catalog types, and filter stores only from recorded offers; do not infer unlisted stockists.
- Keep Me as an owner-only profile surface: query published posts by owner with pagination, store editable identity in existing auth metadata, and link beauty tools to existing collection systems; unsupported public sharing, reposts, tags and consumer draft persistence stay unavailable rather than simulated.
- Store unified product/service reviews in beauty_reviews with owner read paths and public published-only reads; deduplicate legacy post links, never expose local logs, and share records across Discover and Atlas.
- Keep collection usage statuses and received-service visits owner-keyed locally, separate from bookmarks; private review media is readable only by its owner until publication.
