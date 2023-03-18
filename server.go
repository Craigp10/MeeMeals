package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

	cache "github.com/Craigp10/meemeals/cache"
	db "github.com/Craigp10/meemeals/db"
	"github.com/kelseyhightower/envconfig"
	"gopkg.in/yaml.v2"
)

type Config struct {
	Mongo *db.MongoConfig
	Redis *cache.RedisConfig
	Port  string
	// server *Config
}

// Golang Server Client
type Client struct {
	mClient *db.Client
	rClient *cache.Client
}

func (c *Client) Validate() {

}

func processError(err error) {
	fmt.Println(err)
	os.Exit(2)
}

func readFile(cfg *Config) {
	f, err := os.Open("config.yml")
	if err != nil {
		processError(err)
	}
	defer f.Close()

	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(cfg)
	if err != nil {
		processError(err)
	}
}

func readEnv(cfg *Config) {
	err := envconfig.Process("", cfg)
	if err != nil {
		processError(err)
	}
}

func New() *Client {
	cfg := Config{}
	readFile(&cfg)
	readEnv(&cfg)
	// fmt.Println("uri", cfg.Redis)
	mClient := db.New(cfg.Mongo)
	rClient := cache.New(cfg.Redis)

	c := &Client{
		mClient: &mClient,
		rClient: &rClient,
	}
	return c
}

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
