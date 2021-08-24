
import React, { useEffect, useState, useContext } from "react";

import "./Meals.css";
import apis from "../../api/index";
import MealBox from "../../components/MealBox/MealBox";
import MealsModal from "../../components/MealsModal/MealsModal";


type meal = {
  category: string,
  date_created: string,
  description: string,
  display_name: string
  ingredients: string[],
  instructions: string[],
  isActive: boolean,
  tags: string[],
  _id: string,
}

type activeMealObj = {
  isActive:boolean,
  activeMealID:string
}

const Meals = (props:any) => {
  const [meals, setMeals] = useState<meal[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<string>("");
  const [activeMeal, setActiveMeal] = useState<activeMealObj>({
    isActive:false,
    activeMealID:"",
  });
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    //When props change pull user meals by user id
    const getUserMealsFunc = async () => await apis.getUserMeals({ user_id: props.user.id }).then((resp) => {
      console.log(resp.data.meals);
      setMeals(resp.data.meals);
    });

    getUserMealsFunc();
  }, []);

  const handleClose = () => {
    //close modal, remove active meal state
    setActiveMeal({
      isActive:false,
      activeMealID:"",
    });
    setShow(false);
  };

  const handleShow = (action: string, idx: number) => {
    //show modal, set activeMeal if preview or edit action
    if (action == "edit" || action == "preview") {
      // setActiveMeal({ ...meals[idx] });
    }
    setModalAction(action);
    setShow(true);
  };

  // const handleSubmit = async (data: meal) => {
  //   //Submit modal data
  //   console.log("submitting data", data);
  //   const requestObj = {
  //     meal: data,
  //     user_id: props.user.id,
  //   };
  //   let resp = {};
  //   if (modalAction == "edit") {
  //     requestObj.meal._id = activeMeal.activeMealID;
  //     resp = await apis.editMeal(requestObj);
  //   } else {
  //     resp = await apis.createNewMeal(requestObj);
  //   }
  //   if (
  //     typeof resp?.data.meals != "object" ||
  //     typeof resp?.data.meals?.length != "number"
  //   ) {
  //     setMeals([]);
  //   } else {
  //     setMeals(resp.data.meals);
  //   }
  //   //run saver component
  //   setShow(false);
  // };

  const handleDelete = async (meal_id:string) => {
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
            // handleSubmit={handleSubmit}
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
              <button type="button" onClick={() => null
              //handleShow("create")}>
              }>
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
