package main

import (
	"fmt"
	"os"

	cache "github.com/Craigp10/meemeals/cache"
	db "github.com/Craigp10/meemeals/db"
	"github.com/kelseyhightower/envconfig"
	"gopkg.in/yaml.v2"
)

func main() {
	fmt.Println("Hello Meemeals!")

	c := New()
	fmt.Println(c)
	c.mClient.Connect()
	c.mClient.Ping()
	c.mClient.Disconnect()
}

type Config struct {
	Mongo *db.MongoConfig
	Redis *cache.RedisConfig
	Port  string
	// server *Config
}

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
	fmt.Println("uri", cfg.Redis)
	mClient := db.New(cfg.Mongo)
	rClient := cache.New(cfg.Redis)

	c := &Client{
		mClient: &mClient,
		rClient: &rClient,
	}
	return c
}
