# Home Screen UI — V0 Detailed Prompt (English)

Use this prompt in **v0.dev** (or similar UI generators) to reproduce the subway route finder home screen and related selection screens. Copy the block below as-is or adapt sections as needed.

---

## V0 prompt (copy-paste)

```
Create a modern, minimal mobile-first UI for a subway route finder app's home screen and selection flow.

=== CONTEXT ===
- App: Subway route recommendation (departure → optional via stations → arrival).
- Platform: React / React Native–style components; mobile-first, touch-friendly.
- The main input is a single-row "station block": Departure | (Add via) | Arrival. This block keeps the same shape everywhere; only its vertical position and surrounding content change.

=== HOME SCREEN ===

1) Default state (nothing selected)
- Show only two fields in one horizontal row: **Departure** and **Arrival**.
- Labels: "Departure" / "Arrival"; placeholders: "Select departure" / "Select arrival".
- Do **not** show "Add via" in this state.
- Place this single row in the **vertical center** of the screen.
- Do **not** show a page title, subtitle, or search/actions area in this state.
- Tapping Departure or Arrival navigates to the respective selection screen.

2) Expanded state (at least one of departure, arrival, or via selected)
- Show a **smooth, natural animation** when transitioning from the default state: the same station row **moves from center to top** (e.g. layout animation or translateY, ~300ms ease-in-out). The block does not jump; it slides up.
- At the top: page title (e.g. "Find route") and subtitle (e.g. "Select departure and arrival").
- Directly below: the **same single-row block** (Departure | Add via | Arrival), now at the top.
- Below the block: a **"Search & more"** section with a primary **"Find route"** button.
- The search button is **enabled only when both** departure and arrival are selected; otherwise it is disabled (grayed out, not clickable).
- Use a single layout structure so the block is one continuous element that animates from center to top when state changes (no unmount/remount).

3) Add via
- Show the **"Add via"** slot in the same row **only when** at least one of departure or arrival is already selected.
- Maximum **3** via stations. When 3 are selected, show "Add via" as disabled or with text like "Max 3" / "Maximum 3".
- Tapping "Add via" navigates to the via-station selection screen.

4) Station block (row) styling
- One horizontal row: **Departure** | (Add via, when visible) | **Arrival**.
- **Horizontal margin/padding** from the left and right edges of the screen (e.g. 24px or 1.5rem) so the block does not touch the sides.
- Buttons/cells inside the block should feel **friendly and compact**: moderate gap between them (e.g. 16px), full-width distribution within the row but with comfortable padding. No obligation to pack them tightly; align the row across the width with clear margins from the edges.

=== SELECTION SCREENS ===

5) Departure selection screen
- **Block position: always at the top.** Same single-row block (Departure | Add via | Arrival) fixed at the top, below the screen header.
- Below the block: scrollable list (or placeholder) for selecting a departure station.
- Tapping Departure in the block goes back; tapping Arrival or Add via navigates to the respective screen.

6) Arrival selection screen
- **Block position: always at the top.** Same single-row block fixed at the top, below the header.
- Below the block: scrollable list (or placeholder) for selecting an arrival station.
- Tapping Arrival in the block goes back; tapping Departure or Add via navigates to the respective screen.

7) Via selection screen
- **Split layout:** Departure summary **at the top** (one row), Arrival summary **at the bottom** (one row), and the **via-station selection list in the middle**.
- Top bar: only the departure field (label + value/placeholder); tappable to go to departure selection.
- Bottom bar: only the arrival field (label + value/placeholder); tappable to go to arrival selection.
- Middle: list or search to add/order via stations (max 3).

=== DESIGN REQUIREMENTS ===
- Clean, minimal, subway-themed aesthetic. Use subtle borders, rounded corners, and clear typography.
- Touch targets at least 44px height. Use clear disabled states (opacity or gray) for the search button and for "Add via" when max is reached.
- Ensure the center-to-top transition on the home screen is **visible and smooth** (layout or transform animation), not an instant jump.
- Keep the station block’s **shape and row layout identical** on home and all selection screens; only vertical position and surrounding content change.
```

---

## Short summary for V0

- **Home:** One row (Departure | Add via? | Arrival). Empty → row centered, no title/search. Any selection → **animated** move to top + title + "Search & more" + Find-route button (enabled only when both set). Add via visible only when departure or arrival is set; max 3 via.
- **Block:** Same row everywhere; horizontal margins from edges; friendly spacing between buttons.
- **Departure/Arrival selection:** Block **always at top**; list below.
- **Via selection:** Departure row top, Arrival row bottom, via list in the middle.
- **Animation:** Smooth center-to-top transition on home when going from empty to expanded state.
