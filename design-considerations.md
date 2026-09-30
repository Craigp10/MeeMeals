# MeeMeals: design considerations

Open design decisions to settle later. Add new entries at the bottom. When one is decided, record the decision under it rather than deleting it.

Source design: the "Meal Planner Calendar" canvas (Week, Day and Month views).

---

## Calendar redesign (2026-09-30)

These features appear in the calendar design but aren't shown in the app for now.

### 1. Several meals per slot

- **Design:** a slot (for example, Tuesday lunch) can hold more than one meal.
- **App today:** the calendar model stores one meal ID per slot (`breakfast`, `lunch`, `dinner`, `snack` are strings).
- **Options:**
  - Keep one meal per slot. Dropping a meal replaces what's there.
  - Store a list of meal IDs per slot. This needs a schema and API change, and days already saved with a single ID must still read correctly.

### 2. Prep time and servings

- **Design:** meal cards show prep time ("20 min") and servings, and the Day summary adds up the day's prep time.
- **App today:** meals have no prep-time or servings fields.
- **Options:**
  - Leave them out, and show the meal category instead.
  - Add optional prep minutes and servings to the meal model, the create/edit form and the API.

### 3. Shopping List and Create a meal buttons

- **Design:** the calendar header has a Shopping List button, and the meals panel has a Create a meal button.
- **App today:** there's no shopping list feature. Creating a meal happens in the New Meal form on the Meals page.
- **Options:**
  - Create a meal opens the existing New Meal form from the calendar.
  - Shopping List gets built from the meals planned in the visible week, or stays out until that exists.

### 4. Mobile layout

- **Design:** drawn for desktop only (1440px wide).
- **App today:** the Calendar page has a mobile layout under 768px: a single date and a "Select a Meal" dropdown on empty slots.
- **Options:**
  - Show only the Day view on phones, and Week and Month from 768px up.
  - Make Week and Month responsive for phones too.
