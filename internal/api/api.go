package api

import (
	"fmt"
	"io"
	"net/http"
	"time"

	cache "github.com/Craigp10/meemeals/internal/cache"
	"github.com/Craigp10/meemeals/internal/config"
	mongo "github.com/Craigp10/meemeals/internal/db/mongo"
	"github.com/gorilla/mux"
)

type Config struct {
	Host string
	Port int
}

// Golang Server Client
type Client struct {
	MongoClient  *mongo.Client
	RedisClient  *cache.Client
	cfg          *Config
	ReadTimeout  int
	WriteTimeout int
}

func New(c *config.Config) *http.Server {
	// Create multiplexer
	router := mux.NewRouter()

	server := &http.Server{}

	// Endpoint paths should only contain nouns
	router.HandleFunc("/hello", server.Hello)

	// User Router
	userRouter := router.PathPrefix("/user").Subrouter()
	userRouter.HandleFunc("", server.User).Methods("GET")
	userRouter.HandleFunc("/meal", server.UserMeals).Methods("GET")
	userRouter.HandleFunc("/meal", server.UserMealNew).Methods("POST")
	userRouter.HandleFunc("/meal", server.UserMealDelete).Methods("DELETE")
	userRouter.HandleFunc("/meal", server.UserMealUpdate).Methods("PUT")

	// Meals Router -- Not used atm
	// mealsRouter := router.PathPrefix("/meals").Subrouter()
	// mealsRouter.HandleFunc("/hi", server.HiMeals).Methods("GET")
	// mealsRouter.HandleFunc("/test", server.TestMeals).Methods("POST")

	// Calendar Router
	calendarRouter := router.PathPrefix("/calendar").Subrouter()
	calendarRouter.HandleFunc("/change", server.CalendarChange).Methods("POST")
	calendarRouter.HandleFunc("/date", server.CalendarDate).Methods("GET")
	calendarRouter.HandleFunc("/schedule", server.CalendarSchedule).Methods("GET")

	// Auth Router -- Maybe want an account path and use auth just for auth purposes...
	authRouter := router.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/signup", server.AuthSignup).Methods("POST")
	authRouter.HandleFunc("/demo", server.AuthDemo).Methods("POST")
	authRouter.HandleFunc("/login", server.AuthLogin).Methods("POST")
	authRouter.HandleFunc("/logout", server.AuthLogout).Methods("GET")
	authRouter.HandleFunc("/create-account", server.AuthCreateAccount).Methods("POST")
	authRouter.HandleFunc("/session", server.AuthSession).Methods("GET")

	server := &http.Server{
		Addr:         server.Client.Address(),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	return server
}
func (c *Client) Validate() {
}

func (c *Client) Address() string {
	return fmt.Sprintf("%s:%d", server.cfg.Host, server.cfg.Port)
}

// TODO: Add DI to go server New/config -- Inject Config into our New() function to create different configs of meemeals
// func New(cfg *config.Config) *Client {
// 	// fmt.Println("uri", cfg.Redis)
// 	mClient := mongo.New(cfg.MongoDB)
// 	rClient := cache.New(cfg.Redis)

// 	c := &Client{
// 		MongoClient: mClient,
// 		RedisClient: rClient,
// 	}
// 	return c
// }

// curl http://localhost:8000/hello
func (c *Client) Hello(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello, Meemeals!\n")
}

// Index Handler if I want to create my own routing tree...
func (c *Client) IndexHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		io.WriteString(w, "Get Request!\n")
	case http.MethodPost:
		io.WriteString(w, "Post Request!\n")
	case http.MethodPut:
		io.WriteString(w, "Put Request!\n")
	case http.MethodDelete:
		io.WriteString(w, "Delete Request!\n")
	default:
		io.WriteString(w, "Unsupported request method provided. Please use either of [ GET, POST, PUT, DELETE ].\n")
	}
}

func (c *Client) User(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "User \n")
}

func (c *Client) UserMeals(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "UserMealUpdate \n")
}

func (c *Client) UserMealNew(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "UserMealNew \n")
}
func (c *Client) UserMealUpdate(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "UserMealUpdate \n")
}

func (c *Client) UserMealDelete(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "UserMealDelete \n")
}

func (c *Client) AuthLogin(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "AuthLogin in \n")
}

func (c *Client) AuthSignup(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "AuthSignup in \n")
}

func (c *Client) AuthDemo(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "AuthDemo in \n")
}

func (c *Client) AuthCreateAccount(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "AuthCreateAccount in \n")
}

func (c *Client) AuthSession(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "AuthSession in \n")
}

func (c *Client) AuthLogout(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "AuthLogout in \n")
}

func (c *Client) CalendarChange(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "CalendarChange \n")
}

func (c *Client) CalendarSchedule(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "CalendarSchedule \n")
}

func (c *Client) CalendarDate(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "CalendarDate \n")
}
