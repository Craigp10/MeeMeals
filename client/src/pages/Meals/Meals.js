import React, { useEffect, useState } from "react";
import "./Meals.css";
import apis from "../../api/index";
import MealBox from "../../components/MealBox/MealBox";
import MealsModal from "../../components/MealsModal/MealsModal";

// Modal.setAppElement(".meals-content-wrapper");

const Meals = () => {
  let subtitle;
  const [meals, setMeals] = useState([]);
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [editingMeal, setEdittingMeal] = useState({});

  useEffect(async () => {
    await apis
      .getUserMeals({ user_id: "60f5ffcaf12aefb5c7942f63" })
      .then((resp) => setMeals(resp.data.meals));
  }, []);

  const handleClose = () => {
    setEdittingMeal({});
    setShow(false);
  };

  const handleShow = (action, idx) => {
    setModalAction(action);
    if (action == "edit") {
      setEdittingMeal({ ...meals[idx] });
    }
    setShow(true);
  };

  const handleSubmit = async (data) => {
    console.log("submitting data", data);
    const requestObj = {
      meal: data,
      user_id: "60f5ffcaf12aefb5c7942f63",
    };
    let resp = {};
    if (modalAction == "edit") {
      requestObj.meal._id = editingMeal._id;
      resp = await apis.editMeal(requestObj);
    } else {
      resp = await apis.createNewMeal(requestObj);
    }
    if (
      typeof resp.data.meals != "object" ||
      typeof resp.data.meals?.length != "number"
    ) {
      setMeals([]);
    } else {
      setMeals(resp.data.meals);
    }
    //run saver component
    setShow(false);
  };

  const handleDelete = async (meal_id) => {
    //const userDoubleCheck await doubleCheckDeletePopup()
    // if (!userDoubleCheck) return;
    const requestObj = {
      meal_id,
      user_id: "60f5ffcaf12aefb5c7942f63",
    };
    await apis.deleteMeal(requestObj).then((resp) => setMeals(resp.data.meals));
  };
  console.log(meals, editingMeal);
  return (
    <div className="meals-content-wrapper">
      {show ? (
        <MealsModal
          show={show}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          modalAction={modalAction}
          mealEdit={editingMeal}
        />
      ) : null}
      <div className="meals-content-board">
        <div className="meals-board-header">
          <div className="save-message">
            {/* <saveComponentHandler/> */}
            {/* Save message */}
          </div>
          <div className="title">
            Your Meals
            {/* Your Mealsa */}
          </div>
          <div className="create">
            <button type="button" onClick={() => handleShow("create")}>
              Create A Meal
            </button>
          </div>
        </div>
        <div className="meals-board-scroll">
          <ul className="meals-content-mealboxes">
            {meals?.length == 0 ? (
              <div className="meals-content-no-meals">
                You do not have any meals created!
              </div>
            ) : (
              meals.map((meal, idx) => (
                <li key={meal._id}>
                  <MealBox
                    index={idx}
                    meal={meal}
                    deleteMeal={handleDelete}
                    handleShow={handleShow}
                    disable={show}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Meals;
