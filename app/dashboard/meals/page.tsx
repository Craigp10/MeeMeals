"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useWindowSize } from "@/context/window-size-context";
import MealBox from "@/components/MealBox";
import MealsModal from "@/components/MealsModal";
import styles from "./meals.module.scss";

interface Meal {
  _id: string;
  display_name: string;
  date_created: string;
  ingredients: string[];
  description: string;
  category: string;
  tags: string[];
  instructions: string[];
  isActive: boolean;
}

interface MealData {
  _id?: string;
  display_name: string;
  ingredients: string[];
  description: string;
  category: string;
  instructions: string[];
  tags: string[];
}

export default function MealsPage() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const windowSize = useWindowSize();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [activeMealID, setActiveMealID] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const MOBILE_VIEW = windowSize.width < 768;

  useEffect(() => {
    if (!user?.id) return;

    const fetchMeals = async () => {
      try {
        const response = await fetch("/api/user/meals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        const data = await response.json();
        if (data.meals) {
          setMeals(data.meals);

          // Check for preview param from URL
          const previewId = searchParams.get("preview");
          if (previewId && !activeMealID) {
            setActiveMealID(previewId);
            setModalAction("preview");
            setShow(true);
          }
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, [user?.id, searchParams, activeMealID]);

  const handleClose = () => {
    setActiveMealID("");
    setShow(false);
  };

  const handleShow = (action: string, id: string | null) => {
    if (action === "edit" || action === "preview") {
      setActiveMealID(id || "");
    }
    setModalAction(action);
    setShow(true);
  };

  const handleSubmit = async (data: MealData) => {
    if (!user?.id) return;

    try {
      const requestObj = {
        meal: data,
        user_id: user.id,
      };

      const endpoint =
        modalAction === "edit" ? "/api/user/edit-meal" : "/api/user/new-meal";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestObj),
      });

      const result = await response.json();

      if (result.meals && Array.isArray(result.meals)) {
        setMeals(result.meals);
      }
    } catch (error) {
      console.error("Error saving meal:", error);
    }

    setShow(false);
  };

  const handleDelete = async (mealId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch("/api/user/delete-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal_id: mealId, user_id: user.id }),
      });

      const result = await response.json();
      if (result.meals) {
        setMeals(result.meals);
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const filteredMeals = meals.filter((meal) => {
    const mealData = [
      meal.display_name,
      ...meal.tags,
      ...meal.ingredients,
    ];
    return mealData
      .join(" ")
      .toLowerCase()
      .includes(searchFilter.toLowerCase());
  });

  return (
    <div className={styles.wrapper}>
      {show && (
        <MealsModal
          show={show}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          modalAction={modalAction}
          mealData={meals.find((meal) => meal._id === activeMealID)}
        />
      )}

      <div className={styles.board}>
        <div className={styles.header}>
          <div className={styles.search}>
            {!MOBILE_VIEW && (
              <div className={styles.searchInput}>
                <span className="glyphicon glyphicon-search" />
                <input
                  id="search"
                  value={searchFilter}
                  placeholder="Search Meals"
                  onChange={(e) => setSearchFilter(e.target.value)}
                  autoComplete="off"
                />
              </div>
            )}
          </div>
          <div className={styles.title}>Your Meals</div>
          <div className={styles.create}>
            <button
              type="button"
              onClick={() => handleShow("create", null)}
              className={MOBILE_VIEW ? "glyphicon glyphicon-plus" : ""}
            >
              {!MOBILE_VIEW && <span>Create A Meal</span>}
            </button>
          </div>
        </div>
        <div className={styles.scroll}>
          <div className={styles.mealboxes}>
            {meals.length === 0 ? (
              <div className={styles.none}>
                You do not have any meals created!
              </div>
            ) : (
              filteredMeals.map((meal, idx) => (
                <div key={meal._id}>
                  <MealBox
                    index={idx}
                    meal={meal}
                    deleteMeal={handleDelete}
                    handleShow={handleShow}
                    disable={show}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
