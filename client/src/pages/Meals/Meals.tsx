import React, { useEffect, useState, useContext } from "react";
import "./scss/compiled.scss";
import apis from "../../api/index";
import MealBox from "../../components/MealBox/MealBox";
import MealsModal from "../../components/MealsModal/MealsModal";
import { userContext, windowSizeContext } from "../../App";

type meal = {
  category: string;
  date_created: string;
  description: string;
  display_name: string;
  ingredients: string[];
  instructions: string[];
  isActive: boolean;
  tags: string[];
  _id: string;
};

interface User {
  id: string;
  username: string;
  email: string;
}

const Meals = (props: any) => {
  const [meals, setMeals] = useState<meal[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<string>("");
  const [activeMealID, setActiveMealID] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const user = useContext<User>(userContext);
  const windowSize = useContext(windowSizeContext);
  const MOBILE_VIEW = windowSize.width < 768 ? true : false;

  useEffect(() => {
    //When props change pull user meals by user id
    const getUserMealsFunc = async () =>
      await apis.getUserMeals({ user_id: user.id }).then((resp) => {
        setMeals(resp.data.meals);
        if (
          props.history.action == "PUSH" &&
          props.location.state?.mealPreview &&
          !activeMealID
        ) {
          setActiveMealID(props.location.state.mealPreview);
          setModalAction("preview");
          setShow(true);
        }
      });
    getUserMealsFunc();
  }, []);

  const handleClose = () => {
    //close modal, remove active meal state
    setActiveMealID("");
    setShow(false);
  };

  const handleShow = (action: string, id: string | null) => {
    //show modal, set activeMeal if preview or edit action
    if (action == "edit" || action == "preview") {
      setActiveMealID(id);
    }
    setModalAction(action);
    setShow(true);
  };

  const handleSubmit = async (data: meal) => {
    //Submit modal data
    console.log("submitting data", data);

    const requestObj = {
      meal: data,
      user_id: user.id,
      _id: activeMealID,
    };

    const resp =
      modalAction == "edit"
        ? await apis.editMeal(requestObj)
        : await apis.createNewMeal(requestObj);

    if (
      typeof resp?.data.meals != "object" ||
      typeof resp?.data.meals?.length != "number"
    ) {
      setMeals([]);
    } else {
      setMeals(resp.data.meals);
    }
    setShow(false);
    //run saver component
  };

  const handleDelete = async (meal_id: string) => {
    //handle deleting a meal on click
    const requestObj = {
      meal_id,
      user_id: user.id,
    };
    await apis.deleteMeal(requestObj).then((resp) => {
      setMeals(resp.data.meals);
    });
  };
  console.log(show);
  return (
    <>
      <div className="meals-wrapper">
        {show ? (
          <MealsModal
            show={show}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            modalAction={modalAction}
            mealData={meals.filter((meal) => meal._id == activeMealID)[0]}
          />
        ) : null}

        <div className="meals__board">
          <div className="meals__board__header">
            <div className="meals__board__header-search">
              {!MOBILE_VIEW ? (
                <div className="glyphicon glyphicon-search">
                  <input
                    id="search"
                    value={searchFilter}
                    placeholder="Search Meals"
                    onChange={(e) => setSearchFilter(e.target.value)}
                    autoComplete={"off"}
                  />
                </div>
              ) : null}
            </div>
            <div className="meals__board__header-title">Your Meals</div>
            <div className="meals__board__header-create">
              <button
                type="button"
                onClick={() => handleShow("create", null)}
                className={MOBILE_VIEW ? "glyphicon glyphicon-plus" : ""}
              >
                {!MOBILE_VIEW ? <span>Create A Meal</span> : null}
              </button>
            </div>
          </div>
          <div className="meals__board__scroll">
            <div className="meals__board__scroll-mealboxes">
              {meals?.length == 0 ? (
                <div className="meals__board__scroll-mealboxes-none">
                  You do not have any meals created!
                </div>
              ) : (
                meals
                  .filter((meal: meal, idx: number) => {
                    const mealData = [
                      meal.display_name,
                      ...meal.tags.map((tag: string) => tag),
                      ...meal.ingredients.map(
                        (ingredient: string) => ingredient
                      ),
                    ];
                    return mealData
                      .join(" ")
                      .toLowerCase()
                      .includes(searchFilter.toLowerCase());
                  })
                  .map((meal: meal, idx: number) => (
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
    </>
  );
};

export default Meals;
