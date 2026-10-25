---
name: NeuroNexus+
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#b395ff'
  on-tertiary-container: '#4900ae'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-lg: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system powers an integrated ecosystem unifying student cognitive health, personal micro-finance, and AI-driven academic orchestration. Targeted at digital-native university and post-graduate students navigating cognitive overload and financial volatility, the interface projects calm precision, effortless intelligence, and ambient focus. 

The aesthetic is Modern Technical Dark Glass: a deliberate pairing of ultra-deep cosmic canvas hues with luminous functional accents and layered translucency. High-density information is made digestible through disciplined layout hierarchies, tactile touch targets, and soft, radiant lighting cues that alleviate digital fatigue rather than inducing anxiety.

## Colors
The palette utilizes semantic luminous channels contrasted against deep slate tonal layers:

- **Canvas & Surfaces:**
  - Base Canvas: `#0B0F19` (Void Black-Blue) provides maximum energy conservation and visual depth.
  - Surface Tiers: `#111827` (Card Surface Level 1) and `#1E293B` (Elevated Panels & Flyouts Level 2).
  - Borders & Dividers: `#334155` rendered at `40%` to `60%` opacity to simulate structural frosted edges.

- **Accent Channels:**
  - **Electric Cyan (`#06B6D4`):** Primary agent for AI copilots, machine intelligence nodes, real-time analytics, and primary interactive states.
  - **Calm Emerald (`#10B981`):** Wellness milestones, balanced mental health metrics, positive financial delta, and completed task states.
  - **Energetic Violet (`#8B5CF6`):** Focus sprints, cognitive load timers, study blocks, and calendar integration.
  - **Warm Amber (`#F59E0B`):** System alerts, critical budget thresholds, high-stress warnings, and pending deadlines.

- **Content & Typography:**
  - Pure White (`#F8FAFC`) for primary headers and vital values.
  - Muted Slate (`#94A3B8`) for secondary body text.
  - Subdued Slate (`#64748B`) for tertiary labels, placeholder copy, and inactive navigation items.

## Typography
Typography is paired to balance character with utilitarian clarity. Headlines and focal numeric metrics utilize **Plus Jakarta Sans**, lending contemporary geometric confidence and soft friendly terminals. Body copy, tabular data, and dense interactive widgets rely on **Inter**, ensuring clinical readability at small scales on mobile displays.

Headings leverage slight negative letter-spacing for a cohesive display appearance, while compact labels and micro-indicators feature slight positive tracking for enhanced legibility against dark slate surfaces.

## Layout & Spacing
The layout architecture is mobile-first, operating on an 8pt baseline rhythm with a standard 4-column fluid mobile grid. 

- **Outer Margins:** Fixed at `1rem` (16px) on compact phones, relaxing to `1.5rem` (24px) on large phablets and tablets.
- **Vertical Rhythm:** Content clusters stack with `space-md` (16px) gaps, while distinct thematic sections separate with `space-xl` (32px).
- **Safe Area Insets:** Fixed bottom navigation clears an adaptive 88px clearance zone to prevent occlusion by the native system gesture pill.
- **Touch Ergonomics:** All actionable elements strictly maintain minimum bounding boxes of 44x44px.

## Elevation & Depth
Depth in the design system avoids heavy drop shadows, instead utilizing layered luminescence and translucent glass planes:

- **Surface 0 (Canvas):** Pure `#0B0F19`.
- **Surface 1 (Primary Cards):** Frosted `#111827` at 85% opacity with a `12px` backdrop blur, bound by a crisp 1px stroke of `rgba(51, 65, 85, 0.4)`.
- **Surface 2 (Floating Modals & Sheets):** Elevated `#1E293B` at 92% opacity with `24px` backdrop blur, bound by `rgba(51, 65, 85, 0.6)`.
- **Luminous Radiance:** Key interactive cards project localized radial glows: an outer diffused blur (`box-shadow: 0 0 24px -6px rgba(accent, 0.25)`) matched to the card's active thematic domain (cyan, violet, or emerald).

## Shapes
The shape language combines friendly, ergonomic softness with precision contours:

- **Standard Cards & Containers:** Styled with `rounded-xl` (16px) and `rounded-2xl` (24px) to cradle complex content blocks naturally on high-density touchscreens.
- **Micro Elements & Pills:** Badges, tags, and category identifiers leverage fully pill-shaped borders (`rounded-full` / 9999px).
- **Input Fields & Buttons:** Configured with `rounded-xl` (12px to 16px) for comfortable finger contact and visual alignment with enclosing cards.

## Components

### Buttons
- **Primary Action (AI & Core Flow):** Cyan-to-violet linear gradient fill (`135deg, #06B6D4 0%, #8B5CF6 100%`), bold white text, subtle inner top specular highlight (`1px inset rgba(255, 255, 255, 0.25)`), and 48px height.
- **Secondary / Surface Action:** `#1E293B` fill, 1px border of `rgba(51, 65, 85, 0.6)`, text in `#F8FAFC`.
- **Ghost Action:** Transparent background with `#06B6D4` text and glow on press.

### Chips & Badges
- **Pill Badges:** Fully rounded (`rounded-full`), height 24px–28px, semi-transparent tinted backgrounds (e.g., `rgba(6, 182, 212, 0.12)`) paired with solid accent borders (`rgba(6, 182, 212, 0.3)`) and accent text.
- **Filter Chips:** `#111827` background that illuminates with an active accent border and glow upon selection.

### Cards & Dashboards
- Multi-metric cards utilize Surface 1 (`#111827`) styling with top-right glowing indicator dots or accent edge ribbons indicating category (Cyan for AI insights, Emerald for budget & wellness, Violet for study tasks).

### Lists & Activity Feeds
- Grouped inset lists separated by subtle hairline rules (`rgba(51, 65, 85, 0.3)`).
- Leading circular glyph containers (36px) featuring a 10% accent wash and vibrant iconography.

### Inputs & Form Fields
- Height 48px, background `#111827`, border 1px `rgba(51, 65, 85, 0.5)`. Active/focused states transition the border to solid `#06B6D4` accompanied by a 4px soft ring (`rgba(6, 182, 212, 0.15)`).

### Selection Controls
- **Checkboxes & Radios:** 20px squares/circles with 1.5px border. On activation, animate with an electric fill and sharp white checkmark glyph.

### Bottom Navigation Bar
- Frosted floating dock anchored to the screen base: `#0B0F19` at 85% opacity, `20px` backdrop filter, and top hairline border in `rgba(51, 65, 85, 0.4)`. Inactive icons rest at `#64748B`; active icons ignite in `#06B6D4` with an ambient underside blur dot.