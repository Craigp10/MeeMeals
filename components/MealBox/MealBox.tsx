"use client";

import styles from "./MealBox.module.scss";

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

interface Props {
  index: number;
  meal: Meal;
  deleteMeal?: (meal_id: string) => void;
  handleShow: (action: string, id: string | null) => void;
  disable: boolean;
}

export default function MealBox({
  meal,
  deleteMeal,
  handleShow,
  disable,
}: Props) {
  if (disable) return <div className={styles.wrapper} />;

  return (
    <div className={`${styles.wrapper} ${styles.glow}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.displayName}>{meal.display_name}</div>
          <div className={styles.options}>
            <span
              className="glyphicon glyphicon-resize-full"
              onClick={() => handleShow("preview", meal._id)}
            />
            &nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-edit"
              onClick={() => handleShow("edit", meal._id)}
            />
            &nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-trash"
              onClick={() => deleteMeal?.(meal._id)}
            />
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.description}>
            <h6>Description</h6>
            {meal.description}
          </div>
          <div className={styles.ingredients}>
            <h6>Ingredients</h6>
            <ol>
              {meal.ingredients.map((ingredient, idx) => (
                <li className={styles.ingredient} key={idx}>
                  {ingredient}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className={styles.footer}>
          <span>Created On: {meal.date_created}</span>
          <span>Last scheduled: -Not implemented-</span>
        </div>
      </div>
    </div>
  );
}
