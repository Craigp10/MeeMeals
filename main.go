package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("Hello Meemeals! Starting Server...")

	// Create new Server Client
	c := New()

	// Create multiplexer
	router := mux.NewRouter()

	// Endpoint paths should only contain nouns
	router.HandleFunc("/hello", c.Hello)

	// User Router
	userRouter := router.PathPrefix("/user").Subrouter()
	userRouter.HandleFunc("", c.User).Methods("GET")
	userRouter.HandleFunc("/meal", c.UserMeals).Methods("GET")
	userRouter.HandleFunc("/meal", c.UserMealNew).Methods("POST")
	userRouter.HandleFunc("/meal", c.UserMealDelete).Methods("DELETE")
	userRouter.HandleFunc("/meal", c.UserMealUpdate).Methods("PUT")

	// Meals Router -- Not used atm
	// mealsRouter := router.PathPrefix("/meals").Subrouter()
	// mealsRouter.HandleFunc("/hi", c.HiMeals).Methods("GET")
	// mealsRouter.HandleFunc("/test", c.TestMeals).Methods("POST")

	// Calendar Router
	calendarRouter := router.PathPrefix("/calendar").Subrouter()
	calendarRouter.HandleFunc("/change", c.CalendarChange).Methods("POST")
	calendarRouter.HandleFunc("/date", c.CalendarDate).Methods("GET")
	calendarRouter.HandleFunc("/schedule", c.CalendarSchedule).Methods("GET")

	// Auth Router -- Maybe want an account path and use auth just for auth purposes...
	authRouter := router.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/signup", c.AuthSignup).Methods("POST")
	authRouter.HandleFunc("/demo", c.AuthDemo).Methods("POST")
	authRouter.HandleFunc("/login", c.AuthLogin).Methods("POST")
	authRouter.HandleFunc("/logout", c.AuthLogout).Methods("GET")
	authRouter.HandleFunc("/create-account", c.AuthCreateAccount).Methods("POST")
	authRouter.HandleFunc("/session", c.AuthSession).Methods("GET")

	err := http.ListenAndServe(":8000", router)
	if err != nil {
		log.Fatal("error starting server", err)
	}
}
