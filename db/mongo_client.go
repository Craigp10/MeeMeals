package db

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Client struct {
	mCfg    *MongoConfig
	mClient *mongo.Client
}

type MongoConfig struct {
	Uri      string
	Database string
	Host     string
	Port     string
	// password string
	// username string
}

func New(config *MongoConfig) Client {
	err := validate(config)
	if err != nil {
		panic(err)
	}
	return Client{
		mCfg: config,
	}
}

func validate(mCfg *MongoConfig) error {
	if mCfg.Uri == "" {
		log.Fatal("Missing mongo uri")
	}
	// if mCfg.password == "" {
	// 	log.Fatal("Missing mongo password")
	// }
	// if mCfg.username == "" {
	// 	log.Fatal("Missing mongo username")
	// }
	return nil
}

func (c *Client) Connect() {
	clientOptions := options.Client().ApplyURI(c.mCfg.Uri)
	mongoClient, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		panic(err)
	}
	c.mClient = mongoClient

}

// Ping mongo client
func (c *Client) Ping() {
	// Check the connection
	err := c.mClient.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Ping Successful!")
	}
}

func (c *Client) Disconnect() {
	err := c.mClient.Disconnect(context.TODO())

	if err != nil {
		panic(err)
	}
	fmt.Println("Connection to MongoDB closed.")
}
