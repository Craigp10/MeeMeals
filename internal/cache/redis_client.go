package redis

import "log"

type Config struct {
	Port           string
	Host           string
	Password       string
	Cookie_Name    string
	Session_Secret string
	// store          interface{}
}

type redisClient interface {
}

type Client struct {
	rConfig *Config
	rc      *redisClient
}

func New(cfg *Config) *Client {
	return &Client{}
}

func (c *Client) Validate() {
	if c.rConfig.Port == "" {
		log.Fatal("Missing Redis Port")
	}
	if c.rConfig.Host == "" {
		log.Fatal("Missing Redis Host")
	}
	if c.rConfig.Password == "" {
		log.Fatal("Missing Redis Password")
	}
}
