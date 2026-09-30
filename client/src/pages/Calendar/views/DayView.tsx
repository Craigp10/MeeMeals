import React from "react";
import DateSelector from "../../../components/DateSelector/DateSelector";
import MealSlot from "../../../components/MealSlot/MealSlot";
import {
  PlannerProps,
  SLOTS,
  SLOT_IDS,
  dateKey,
  longDate,
  mealsInDay,
} from "../planner";

const DayView = (props: PlannerProps) => {
  const key = dateKey(props.anchor);
  const day = props.schedule[key];
  const planned = mealsInDay(day).length;
  const countLabel = (n: number) => (n === 1 ? "1 meal" : n + " meals");

  return (
    <section aria-label="Day plan" className="day-view">
      <DateSelector
        dates={props.dates}
        activeDate={props.anchor}
        today={props.today}
        isMobileView={false}
        onSelect={props.onOpenDay}
        describe={(date) =>
          countLabel(mealsInDay(props.schedule[dateKey(date)]).length)
        }
      />
      <div className="day-view__body">
        <div className="day-view__slots">
          {SLOTS.map((slot, row) => {
            const mealId = day?.[slot.id];
            const at = { date: key, slot: slot.id };
            return (
              <MealSlot
                key={slot.id}
                variant="full"
                date={key}
                dateLabel={longDate(props.anchor)}
                slot={slot.id}
                meal={mealId ? props.mealsById[mealId] : undefined}
                meals={props.meals}
                pickedMeal={props.pickedMeal}
                isToday={key === dateKey(props.today)}
                menuAbove={row >= 2}
                menuAlignRight={true}
                onPlace={(id) => props.onPlace(at, id)}
                onMove={(from) => props.onMove(from, at)}
                onRemove={() => props.onRemove(at)}
              />
            );
          })}
        </div>
        <aside aria-labelledby="day-summary-heading" className="day-view__summary">
          <h2 id="day-summary-heading">Day Summary</h2>
          <dl>
            <div>
              <dt>Meals Planned</dt>
              <dd>{planned}</dd>
            </div>
            <div>
              <dt>Open Slots</dt>
              <dd>{SLOT_IDS.length - planned}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
};

export default DayView;
