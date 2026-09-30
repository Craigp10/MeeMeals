import type { DragEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import type { Meal } from "../../types/meal";

export type { Meal };

export type SlotId = "breakfast" | "lunch" | "dinner" | "snack";

export type DaySchedule = Record<SlotId, string>;

export type Schedule = Record<string, DaySchedule>;

export type CalendarView = "day" | "week" | "month";

export type SlotRef = { date: string; slot: SlotId };

export type Layout = "phone" | "tablet" | "desktop";

// Phones under 768px ($tablet-width). Under 1200px ($large-desktop-width)
// the app's own nav sidebar leaves no room for the meals panel beside a week.
export const layoutFor = (width: number): Layout =>
  width < 768 ? "phone" : width < 1200 ? "tablet" : "desktop";

export interface PlannerProps {
  layout: Layout;
  dates: Dayjs[];
  anchor: Dayjs;
  today: Dayjs;
  schedule: Schedule;
  meals: Meal[];
  mealsById: Record<string, Meal>;
  pickedMeal?: Meal;
  onPlace: (to: SlotRef, mealId: string) => void;
  onMove: (from: SlotRef, to: SlotRef) => void;
  onRemove: (at: SlotRef) => void;
  onOpenDay: (date: Dayjs) => void;
}

export const SLOTS: { id: SlotId; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

export const SLOT_IDS: SlotId[] = SLOTS.map((slot) => slot.id);

export const EMPTY_DAY: DaySchedule = {
  breakfast: "",
  lunch: "",
  dinner: "",
  snack: "",
};

export const DRAG_TYPE = "application/x-meemeals-meal";

export type DragPayload = { mealId: string; from?: SlotRef };

// The server keys calendar days by this format, so every date key uses it.
export const dateKey = (date: Dayjs): string => date.format("M/D/YYYY");

export const longDate = (date: Dayjs): string =>
  date.format("dddd") + " " + dateKey(date);

export const startOfWeek = (date: Dayjs): Dayjs =>
  date.subtract((date.day() + 6) % 7, "day").startOf("day");

export const weekOf = (date: Dayjs): Dayjs[] => {
  const monday = startOfWeek(date);
  return [0, 1, 2, 3, 4, 5, 6].map((offset) => monday.add(offset, "day"));
};

// Six Monday-first weeks, so every month fits the same grid.
export const monthGridOf = (date: Dayjs): Dayjs[] => {
  const first = startOfWeek(date.startOf("month"));
  return Array.from({ length: 42 }, (_, offset) => first.add(offset, "day"));
};

export const visibleDates = (view: CalendarView, anchor: Dayjs): Dayjs[] =>
  view === "month" ? monthGridOf(anchor) : weekOf(anchor);

export const rangeLabel = (view: CalendarView, anchor: Dayjs): string => {
  if (view === "day") return anchor.format("dddd") + ", " + dateKey(anchor);
  if (view === "month") return anchor.format("MMMM YYYY");
  const week = weekOf(anchor);
  return dateKey(week[0]) + " – " + dateKey(week[6]);
};

// Fits a phone or tablet toolbar: "Tue 9/29", "9/28 – 10/4", "September 2026".
export const shortRangeLabel = (view: CalendarView, anchor: Dayjs): string => {
  if (view === "day") return anchor.format("ddd M/D");
  if (view === "month") return anchor.format("MMMM YYYY");
  const week = weekOf(anchor);
  return week[0].format("M/D") + " – " + week[6].format("M/D");
};

export const shiftAnchor = (
  view: CalendarView,
  anchor: Dayjs,
  direction: 1 | -1
): Dayjs => {
  if (view === "day") return anchor.add(direction, "day");
  if (view === "week") return anchor.add(direction * 7, "day");
  return anchor.startOf("month").add(direction, "month");
};

export const isSlotId = (value: string): value is SlotId =>
  SLOT_IDS.includes(value as SlotId);

export const slotLabel = (slot: SlotId): string =>
  SLOTS.find((entry) => entry.id === slot)?.label ?? slot;

export const readDragPayload = (
  event: DragEvent
): DragPayload | null => {
  try {
    const payload = JSON.parse(event.dataTransfer.getData(DRAG_TYPE));
    return payload && typeof payload.mealId === "string" ? payload : null;
  } catch (e) {
    return null;
  }
};

export const writeDragPayload = (
  event: DragEvent,
  payload: DragPayload
) => {
  event.dataTransfer.setData(DRAG_TYPE, JSON.stringify(payload));
  event.dataTransfer.effectAllowed = payload.from ? "move" : "copy";
};

export const hasDragPayload = (event: DragEvent): boolean =>
  Array.from(event.dataTransfer.types).includes(DRAG_TYPE);

export const mealsInDay = (day: DaySchedule | undefined): string[] =>
  day ? SLOT_IDS.map((slot) => day[slot]).filter((id) => !!id) : [];

export const today = (): Dayjs => dayjs().startOf("day");
