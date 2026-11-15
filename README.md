# Becoming Bare

I want to build Becoming Bare: a visual, TikTok-style beauty and grooming discovery app and formulation intelligence network where users discover products verified for their exact skin tone, undertone, barrier condition, and hair texture. It features real video wear tests, licensed professional routines (estheticians, hairstylists, barbers), an AI Where-to-Buy store and price comparison across Target, Walmart, Ulta, Sephora, and global stockists, and a cashback reward and micro-affiliate model for reviews and purchases.

### Locked
- **Brand & Philosophy**: "Becoming Bare" reverse-engineers beauty: "we all start with a bare canvas... reverse engineering, right? Not like painting on top of... that esthetician feeling where the stylist understands you." Beauty enhances and cares for your natural canvas rather than masking or covering it up.
- **Universal & Unisex Audience**: "curated to all skin types, and shade, and also bc we are including skincare, makeup, haircare, it should include all skin tones, skin types, hair types, etc." Covers women, men, and non-binary individuals across all tones (pale to deep), undertones (cool, neutral, warm, olive), skin types (sensitive, acne-prone, rosacea, barrier repair, beard care), and hair textures (Type 1 straight to Type 4C coily).
- **Adopted Visual Direction**: "Warm Esthetician" (direction_id: warm-esthetician).
  - Exact Tokens:
    - `--color-clay`: `#B65F3F` (Primary brand accent, CTAs, tags)
    - `--color-oat`: `#F4ECE1` (Card background, light text on dark cocoa, pill fills)
    - `--color-sand`: `#E3D3BE` (Borders, subtle dividers, secondary surfaces)
    - `--color-cocoa`: `#2B1D16` (Deep ground background, dark text on oat)
    - `--color-umber`: `#6E5546` (Secondary metadata, brand labels)
    - Radius: `--r-card: 28px`, `--r-pill: 999px`
    - Typography: Display font `'Fraunces', serif` (italicized wordmark "bare", product titles, scores), Body font `'Inter', sans-serif` (metadata, buttons, body copy).
- **Core Screen 1: Discovery Feed (`feed-warm-esthetician`)**:
  - Full-bleed vertical video scroll (TikTok/Instagram Reels style, not Tinder swipe).
  - Top header: italic "bare" wordmark, interactive skin tone selector pill (e.g. "Deep Neutral (Tone 5)"), and "Trending" fire badge.
  - Video overlay badge: Wear test duration & claims (e.g. "Wear test · 6 hrs, zero cast").
  - Right action rail: "Skin Twin" match percentage ring (e.g. 98%), verified community swatches count (e.g. 240), bookmark/save button, and share.
  - Bottom product card: Oat card with rounded-28px corners, brand label (COSRX), product name (Daily Aloe SPF50), retailer tag (Target · $14.99), and "Founder Story" link button.
  - Docked CTA pill: Full-width clay button "Shop & Earn 8% Cashback ($1.20 back)".
- **Core Screen 2: Esthetician Routine & Where-to-Buy (`pro-routine-detail`)**:
  - Verified Pro header with specialist badge ("Maya Lin, Licensed Esthetician • Melanin Barrier Care").
  - Tutorial video player with step-by-step chapter navigation (e.g., "Evening Barrier Repair Routine").
  - Clinical technique guidance card explaining ingredient mechanisms (e.g., why gentle double-cleansing prevents post-inflammatory dark spots).
  - AI "Where to Buy" stock and live price comparison card across Target ($14.99 • In Stock), Ulta ($16.00 • In Stock), and Walmart ($14.98 • Low Stock).
  - Docked action pill: "Apply Code MAYA10 (10% Off + 6% Cashback)" and Save Routine button.
- **Onboarding & Progress: "The Canvas Consultation"**:
  - Warm, zero-judgment conversational chat interface (unisex, never gendered) diagnosing skin tone, undertone, barrier reactivity, and hair texture/porosity.
  - 30-Day "Bare Canvas" progress milestone: visual before-and-after photo logs for skin barrier healing, hair length checks, and product bottle lifespan tracking (unlocking cashback reviews).
- **Two-Sided Business Model**:
  - B2C: Affiliate cashback on purchases, review-to-earn cashback for verified 30-day reviews, and pro commission splits for licensed specialists.
  - B2B: Inclusive beauty formulation and shade-gap intelligence sold to brands and retailers, plus dual UGC options (brands syndicating onto the feed or licensing community 30-day wear tests for external ads).

### Open
- Full client-side state management for user profiles, skin and hair quiz answers, saved routines, and cashback wallet balance.
- Interactive tone and undertone selector modal allowing users to filter the video feed by Fitzpatrick depth (Fair, Light, Medium, Tan, Deep) and undertone (Cool, Neutral, Warm, Olive).
- Navigation between Discovery Feed, Explore/Trending, Pro Routines, Canvas Consultation / 30-Day Check-in, and Cashback Wallet.
- Responsive layout adapting gracefully from mobile (393px) to desktop while keeping the immersive vertical video feed and apothecary aesthetic.
- Sample realistic video/image placeholders representing diverse skin tones, hair textures, and genuine drugstore-to-prestige products.

Build a real working app, not a clickable prototype; the screen and kit files show layout, content and look (a wireframe's, structure only) and are never code to copy. The screens are the moments the user designed, not the whole product. Before building, walk through each flow as its user would and design what the pictures leave out, as a product designer would for this product: the steps a flow needs to finish and how the app responds to what the user does, including the moments its users will actually run into, like waiting on something or finding nothing yet. Add nothing a user of this product would never meet, and keep an app the user wants simple, simple. Never leave a step the product's core flows need as "coming soon", unless the brief says the user chose to. Where such a step needs an outside service, build every part up to it and say in your reply what's left to connect. Fill product gaps only, never a look the design set: an added step reuses the UI kit's tokens, chrome and parts and the nearest designed screen's layout, with no new visual direction. Look at every screen's picture before writing code; design.md says which picture or sheet holds each screen. Open the UI kit's shells and parts HTML for the header, tab bar, composer and components, not only its tokens. Use each finished screen's copy exactly as design.md lists it; never invent copy for one. A wireframe under design.md's Wireframes gives structure only: build it in the design's look, as design.md says. The screens' photos are placeholders for the mockups only: replace every photo design.md lists with the user's own upload for it, else as design.md says (a photo without people re-composed with imagegen--edit_image from it as a reference, a photo of people generated from its brief and never from the photo), and ship no set photo or its URL. For a design that came with no design.md, every photo on assets.lovable.dev or images.unsplash.com is a set photo: replace it with the user's own upload for it, else a new image generated for its slot, any person in it one who doesn't exist, never from the photo or a picture showing it. Build and check each screen at the canvas it was drawn at: phone 393×764, tablet landscape 1133×744, tablet portrait 744×1133, desktop 1280×832. After building, screenshot the app at those sizes and states, compare each finished screen with its picture, and fix every visual difference you didn't choose; check a wireframe's screen against its structure, never its grey look. End your reply with "Changed from the mockups": each deliberate change and why, and "Added beyond the mockups": each step, state or interaction you built that no screen shows.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bare-for-your-bloom.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f2e7e046-6123-408d-8514-e1680cde0784).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
