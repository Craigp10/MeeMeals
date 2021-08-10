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
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(async () => {
    //When props change pull user meals by user id
    await apis.getUserMeals({ user_id: props.user.id }).then((resp) => {
      console.log(resp.data.meals);
      setMeals(resp.data.meals);
    });
  }, []);

  const handleClose = () => {
    //close modal, remove active meal state
    setActiveMeal({});
    setShow(false);
  };

  const handleShow = (action, idx) => {
    //show modal, set activeMeal if preview or edit action
    if (action == "edit" || action == "preview") {
      setActiveMeal({ ...meals[idx] });
    }
    setModalAction(action);
    setShow(true);
  };

  const handleSubmit = async (data) => {
    //Submit modal data
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
    //handle deleting a meal on click
    const requestObj = {
      meal_id,
      user_id: props.user.id,
    };
    await apis.deleteMeal(requestObj).then((resp) => {
      console.log(resp.data.meals);
      setMeals(resp.data.meals);
    });
  };

  return (
    <>
      <div className="meals-wrapper">
        {show ? (
          <MealsModal
            show={show}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            modalAction={modalAction}
            activeMeal={activeMeal}
          />
        ) : null}
        <div className="meals__board">
          <div className="meals__board__header">
            <div className="meals__board__header-search">
              <div className="glyphicon glyphicon-search">
                <input
                  id="search"
                  value={props.searchFilter}
                  placeholder="Search Meals"
                  onChange={(e) => setSearchFilter(e.target.value)}
                  autoComplete={"off"}
                />
              </div>
            </div>
            <div className="meals__board__header-title">Your Meals</div>
            <div className="meals__board__header-create">
              <button type="button" onClick={() => handleShow("create")}>
                Create A Meal
              </button>
            </div>
          </div>
          <div className="meals__board__scroll">
            <ul className="meals__board__scroll-mealboxes">
              {meals?.length == 0 ? (
                <div className="meals__board__scroll-mealboxes-none">
                  You do not have any meals created!
                </div>
              ) : (
                meals
                  .filter((meal, idx) => {
                    const mealData = [
                      meal.display_name,
                      ...meal.tags.map((tag) => tag),
                      ...meal.ingredients.map((ingredient) => ingredient),
                    ];
                    return mealData
                      .join(" ")
                      .toLowerCase()
                      .includes(searchFilter.toLowerCase());
                  })
                  .map((meal, idx) => (
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
    </>
  );
};

export default Meals;
