package main

import (
	"fmt"
	"log"

	db "github.com/Craigp10/meemeals/db"
	"go.mongodb.org/mongo-driver/bson"
)

func (c *Client) Bootstrap() {
	// Read yaml bootstrap
	// Insert into mongodb

	// User Demo?
	// Meals?
	// Schedule?
	newMeals := []db.Meal{
		{
			IsActive:    true,
			DisplayName: "Spinach Feta pasta w/ cherry tomatoes",
			Ingredients: []string{
				"Cherry Tomatoes",
				"Spinach",
				"pasta of choice",
				"Red Onion",
				"mozzarella",
			},
			Tags: []string{
				"Baked Dish",
				"Tik Tok",
			},
			DateCreated: "7/6/2021",
			Category:    "dinner",
			Description: "First seer the tomatoes with a hot pan, once seared for color lower heat and add oil. Add the onions and garlic, once those are good then everything else. After bake for 30mins.",
		},
		{
			IsActive:    true,
			DisplayName: "Sausage, Rice, Peppers dish",
			Ingredients: []string{
				"Sausage", "Rice", "Bell Peppers", "Yellow Onion",
			},
			DateCreated: "7/10/2021",
			Category:    "lunch",
			Description: "",
			Tags: []string{
				"1 Pot", "Simple",
			},
		},
		{
			IsActive:    true,
			DisplayName: "Cereal",
			Ingredients: []string{
				"almost milk", "cinnamon toast crunch",
			},
			Tags:        []string{},
			DateCreated: "7/1/2021",
			Category:    "breakfast",
			Description: "Pour milk then pour in cereal",
		},
		{
			IsActive:    true,
			DisplayName: "Chicken Parm",
			Ingredients: []string{
				"Chicken breast",
				"basil",
				"cheese",
				"breadcrumbs",
				"egg",
				"pasta",
			},
			Tags: []string{
				"Italian", "Date Nate",
			},
			DateCreated: "12/6/2020",
			Category:    "dinner",
			Description: "Bread the chicken breast, fry them, make your sauce and pasta, bake everything at 350 for 30 minutes",
		},
		{
			IsActive:    true,
			DisplayName: "Pad Thai",
			Ingredients: []string{
				"Peanut Butter", "egg", "pad thai sauce", "onion",
			},
			Tags: []string{
				"Nut Allergy", "Thai Food",
			},
			DateCreated: "5/6/2019",
			Category:    "dinner",
			Description: "",
		},
		{
			IsActive:    true,
			DisplayName: "Peanut Butter Toast",
			Ingredients: []string{
				"bread", "creamy peanut butter",
			},
			Tags:        []string{"Nut Allergy", "Simple"},
			DateCreated: "5/6/2019",
			Category:    "snack",
			Description: "",
		},
		{
			IsActive:    true,
			DisplayName: "Spaghetti and Sausage",
			Ingredients: []string{
				"bread", "creamy peanut butter",
			},
			Instructions: []string{
				"Make sauce", "Simmer sauce", "Boil noodles", "Combine",
			},
			Tags: []string{
				"Italian", "Vegetarian", "Date night",
			},
			DateCreated: "8/1/2021",
			Category:    "dinner",
			Description: "Delicious vegetarian Italian meal picked up fresh herbs and animal free protein",
		},
	}

	Users := []db.UserStorage{
		{
			Username:    "defaultUser",
			Email:       "cmpeoples3@gmail.com",
			Password:    "user3",
			DateCreated: "today",
			Meals:       newMeals,
			IsDemo:      true,
		},
	}

	fmt.Println("Users, %v", Users)
	collection := c.mClient.MongoClient.Database("Mi_Meals").Collection("users")
	id, err := c.mClient.Insert(collection, Users[0])
	if err != nil {
		log.Fatal("Error inserting")
	} else {
		fmt.Println("inserted!", id)
	}
	filter := bson.D{{"_id", id.InsertedID}}
	found, err := c.mClient.Find(collection, filter)

	if err != nil {
		log.Fatal("Nothing found err")
	}
	fmt.Println("found", found)

	count, err := c.mClient.Delete(collection, filter)
	if err != nil {
		panic(err)
	}
	fmt.Println(count.DeletedCount)

	return
}
