package mongo

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserStorage struct {
	Username    string
	Email       string
	Password    string
	DateCreated string
	Meals       []Meal
	IsDemo      bool
}

type Meal struct {
	IsActive      bool
	DisplayName   string
	Ingredients   []string
	Instructions  []string
	Tags          []string
	Category      string
	Description   string
	DateLastEaten string
	DateCreated   string
}

type Client struct {
	mCfg        *Config
	MongoClient *mongo.Client
	Mi_Meals    *mongo.Database
}

type Config struct {
	Uri      string
	Database string
	Host     string
	Port     string
	// password string
	// username string
}

func New(config *Config) *Client {
	err := validate(config)
	if err != nil {
		panic(err)
	}
	return &Client{
		mCfg: config,
	}
}

func validate(mCfg *Config) error {
	if mCfg.Uri == "" {
		log.Fatal("Missing mongo uri")
	}
	if mCfg.Database == "" {
		log.Fatal("Missing mongo database")
	}
	if mCfg.Port == "" {
		log.Fatal("Missing mongo port")
	}
	if mCfg.Host == "" {
		log.Fatal("Missing mongo host")
	}
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
	c.MongoClient = mongoClient
	// collection := c.mClient.Database("Mi_Meals").Collection("trainers")
	c.Mi_Meals = c.MongoClient.Database(c.mCfg.Database)
}

// Ping mongo client
func (c *Client) Ping() {
	// Check the connection
	err := c.MongoClient.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Ping Successful!")
	}
}

func (c *Client) Disconnect() {
	err := c.MongoClient.Disconnect(context.TODO())

	if err != nil {
		panic(err)
	}
	fmt.Println("Connection to MongoDB closed.")
}

type mongoID *mongo.InsertOneResult

func (c *Client) Insert(collection *mongo.Collection, data UserStorage) (mongoID, error) {
	insertResult, err := collection.InsertOne(context.TODO(), data)
	if err != nil {
		return nil, err
	}
	id := insertResult

	return id, nil
}

func (c *Client) Find(collection *mongo.Collection, filter bson.D) ([]UserStorage, error) {
	var results []UserStorage
	var result UserStorage

	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		return nil, err
	}

	results = append(results, result)

	return results, nil
}

func (c *Client) Delete(collection *mongo.Collection, filter bson.D) (*mongo.DeleteResult, error) {
	deleteResults, err := collection.DeleteMany(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	return deleteResults, nil
}

// Not tested
func (c *Client) Update(collection *mongo.Collection, filter bson.D, update bson.D) (*mongo.UpdateResult, error) {
	updateResult, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}

	return updateResult, nil
}
