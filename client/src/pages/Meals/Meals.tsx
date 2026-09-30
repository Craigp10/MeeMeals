import React, { useEffect, useState, useContext } from "react";
import "./scss/compiled.scss";
import apis from "../../api/index";
import MealCard from "../../components/MealCard/MealCard";
import MealView from "../../components/MealDialogs/MealView";
import MealForm, { MealDraft } from "../../components/MealDialogs/MealForm";
import { userContext } from "../../App";
import { MEAL_CATEGORIES, Meal, activeMeals } from "../../types/meal";

interface User {
  id: string;
  username: string;
  email: string;
}

type Dialog =
  | { mode: "view"; id: string }
  | { mode: "edit"; id: string }
  | { mode: "create" }
  | null;

type SortKey = "name" | "newest" | "type";

const FILTERS = [{ id: "all", label: "All" }, ...MEAL_CATEGORIES];
const TYPE_ORDER = MEAL_CATEGORIES.map((category) => category.id as string);

const sortMeals = (meals: Meal[], sort: SortKey) =>
  meals.slice().sort((a, b) => {
    if (sort === "newest") return Date.parse(b.date_created) - Date.parse(a.date_created);
    if (sort === "type") {
      const byType = TYPE_ORDER.indexOf(a.category) - TYPE_ORDER.indexOf(b.category);
      if (byType !== 0) return byType;
    }
    return a.display_name.localeCompare(b.display_name);
  });

const matchesSearch = (meal: Meal, query: string) =>
  [meal.display_name, ...meal.tags, ...meal.ingredients]
    .join(" ")
    .toLowerCase()
    .includes(query.toLowerCase());

const Meals = (props: any) => {
  const user = useContext<User>(userContext);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [confirmId, setConfirmId] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    apis
      .getUserMeals({ user_id: user.id })
      .then((resp) => {
        setMeals(activeMeals(resp.data.meals));
        // The home page links here with a meal to open.
        const previewId = props.location?.state?.mealPreview;
        if (props.history?.action === "PUSH" && previewId) {
          setDialog({ mode: "view", id: previewId });
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus("Your meals could not be loaded.");
      })
      .finally(() => setLoaded(true));
    // Runs once on arrival; the router props don't change while mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const mealById = (id: string) => meals.find((meal) => meal._id === id);

  const closeDialog = () => {
    setDialog(null);
    setSaveError("");
  };

  const submit = async (draft: MealDraft) => {
    if (!dialog || dialog.mode === "view") return;
    setSaving(true);
    setSaveError("");
    try {
      let resp;
      if (dialog.mode === "edit") {
        resp = await apis.editMeal({
          meal: { ...mealById(dialog.id), ...draft },
          user_id: user.id,
        });
      } else {
        // The create endpoint replies with the list from before the insert,
        // so read the list again to include the new meal.
        await apis.createNewMeal({ meal: draft, user_id: user.id });
        resp = await apis.getUserMeals({ user_id: user.id });
      }
      setMeals(activeMeals(resp.data.meals));
      setDialog(null);
      setStatus(draft.display_name + " saved.");
    } catch (err) {
      console.log(err);
      setSaveError("That meal couldn't be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (meal: Meal) => {
    try {
      const resp = await apis.deleteMeal({ meal_id: meal._id, user_id: user.id });
      setMeals(activeMeals(resp.data.meals));
      setConfirmId("");
      setDialog(null);
      setStatus(meal.display_name + " deleted.");
    } catch (err) {
      console.log(err);
      setStatus(meal.display_name + " couldn't be deleted. Try again.");
    }
  };

  const visible = sortMeals(
    meals.filter(
      (meal) => (filter === "all" || meal.category === filter) && matchesSearch(meal, query)
    ),
    sort
  );

  const viewing = dialog?.mode === "view" ? mealById(dialog.id) : undefined;
  const editing = dialog?.mode === "edit" ? mealById(dialog.id) : undefined;

  return (
    <div className="meals-wrapper">
      <header className="meals__header">
        <div className="meals__title">
          <h1>My meals</h1>
          <span>{meals.length === 1 ? "1 meal" : meals.length + " meals"}</span>
        </div>
        <label htmlFor="meals-search" className="meals__sr">
          Search meals
        </label>
        <div className="meals__search">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            id="meals-search"
            type="search"
            value={query}
            placeholder="Search names, ingredients and tags"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="meals__create"
          onClick={() => setDialog({ mode: "create" })}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create a meal
        </button>
      </header>

      <div className="meals__controls">
        <div role="group" aria-label="Filter by meal type" className="meals__filters">
          {FILTERS.map((entry) => {
            const count = meals.filter(
              (meal) => entry.id === "all" || meal.category === entry.id
            ).length;
            return (
              <button
                type="button"
                key={entry.id}
                aria-pressed={filter === entry.id}
                onClick={() => setFilter(entry.id)}
              >
                {entry.label}
                <span>{count}</span>
              </button>
            );
          })}
        </div>
        <label htmlFor="meals-sort">Sort by</label>
        <select
          id="meals-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
        >
          <option value="name">Name</option>
          <option value="newest">Newest first</option>
          <option value="type">Meal type</option>
        </select>
      </div>

      <main className="meals__list scroll-on-hover">
        {visible.length ? (
          <ul aria-label="Meals" className="meals__grid">
            {visible.map((meal) => (
              <MealCard
                key={meal._id}
                meal={meal}
                confirmingDelete={confirmId === meal._id}
                onView={() => setDialog({ mode: "view", id: meal._id })}
                onEdit={() => setDialog({ mode: "edit", id: meal._id })}
                onAskDelete={() => setConfirmId(meal._id)}
                onCancelDelete={() => setConfirmId("")}
                onDelete={() => remove(meal)}
              />
            ))}
          </ul>
        ) : loaded ? (
          <div className="meals__empty">
            <p className="meals__empty-title">
              {meals.length ? "Nothing matches that search" : "No meals yet"}
            </p>
            <p>
              {meals.length
                ? "Try another word, or show all meal types."
                : "Create your first meal to start planning your week."}
            </p>
          </div>
        ) : null}
      </main>

      <p role="status" aria-live="polite" className="meals__sr">
        {status}
      </p>

      {viewing ? (
        <MealView
          meal={viewing}
          onClose={closeDialog}
          onEdit={() => setDialog({ mode: "edit", id: viewing._id })}
          onDelete={() => remove(viewing)}
        />
      ) : null}

      {dialog?.mode === "create" || editing ? (
        <MealForm
          key={editing ? editing._id : "create"}
          mode={editing ? "edit" : "create"}
          meal={editing}
          saving={saving}
          saveError={saveError}
          onClose={closeDialog}
          onSubmit={submit}
        />
      ) : null}
    </div>
  );
};

export default Meals;
