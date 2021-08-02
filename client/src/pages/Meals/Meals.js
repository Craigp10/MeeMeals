import React, { useEffect, useState } from "react";
import "./Meals.css";
import apis from "../../api/index";
import MealBox from "../../components/MealBox/MealBox";
import MealsModal from "../../components/MealsModal/MealsModal";

const Meals = (props) => {
  const [meals, setMeals] = useState([]);
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [activeMeal, setActiveMeal] = useState({});

  useEffect(async () => {
    await apis
      .getUserMeals({ user_id: props.user.id })
      .then((resp) => setMeals(resp.data.meals));
  }, [props]);

  const handleClose = () => {
    setActiveMeal({});
    setShow(false);
  };

  const handleShow = (action, idx) => {
    if (action == "edit" || action == "preview") {
      setActiveMeal({ ...meals[idx] });
    }
    setModalAction(action);
    setShow(true);
  };

  const handleSubmit = async (data) => {
    console.log("submitting data", data);
    const requestObj = {
      meal: data,
      user_id: props.user.id,
    };
    let resp = {};
    if (modalAction == "edit") {
      requestObj.meal._id = activeMeal._id;
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
    const requestObj = {
      meal_id,
      user_id: props.user.id,
    };
    await apis.deleteMeal(requestObj).then((resp) => setMeals(resp.data.meals));
  };
  // if (props.location.state?.mealPreview && !show) {
  //   console.log("MEAL PREVIEW1", props.location.state.mealPreview);
  //   handleShow(
  //     "preview",
  //     meals.filter((meal) => meal._id == props.location.state.mealPreview)[0]
  //   );
  // }
  return (
    <div className="meals-content-wrapper">
      {show ? (
        <MealsModal
          show={show}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          modalAction={modalAction}
          activeMeal={activeMeal}
        />
      ) : null}
      <div className="meals-content-board">
        <div className="meals-board-header">
          <div className="save-message">
            {/* <saveComponentHandler/> */}
            {/* Save message */}
          </div>
          <div className="title">Your Meals</div>
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
