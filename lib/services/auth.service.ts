import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { connectToDatabase } from "@/lib/db/connection";
import { User, Calendar } from "@/lib/db/models";
import type { SessionUser } from "@/types";
import type { IMeal } from "@/lib/db/models/user.model";

// Sample meals for demo users
const DEMO_MEALS: Omit<IMeal, "_id">[] = [
  {
    isActive: true,
    display_name: "Spinach Feta pasta w/ cherry tomatoes",
    ingredients: [
      "Cherry Tomatoes",
      "Spinach",
      "pasta of choice",
      "Red Onion",
      "mozzarella",
    ],
    instructions: [
      "Add a some olive oil to a medium-hot pan and sear tomatoes for 1-2 minutes",
      "Lower heat to medium and add more olive oil and chopped red onion",
      "Add in spinach and various spices of choice",
      "After 5-7 minutes move contents to oven safe baking pan, top with mozzerela cheese and bake 20-30 minutes at 350F",
      "Boil pasta and strain, save a little bit of pasta water for sauce",
      "When finished baking add pasta and pasta waster to dish, mix and serve!",
    ],
    tags: ["Baked Dish", "Tik Tok", "Vegetarian"],
    date_created: "6/3/2021",
    category: "dinner",
    description:
      "Simple pasta delicious vegetarian dish. Can add any vegatables of choice.",
  },
  {
    isActive: true,
    display_name: "Sausage, Rice, Peppers dish",
    ingredients: [
      "Sausage",
      "Rice",
      "Bell Peppers",
      "Yellow Onion",
      "garlic",
      "red pepper flakes",
    ],
    instructions: [
      "Add oil and sauate Onions in large skillet pan on medium heat",
      "after 5-7 minutes pour in all veggies of choice (peppers, broccoli, etc...)",
      "Add in sausage and let cook for 4-5 minutes.",
      "Add more oil after 2-3 minutes and toss in garlic and red pepper flakes",
      "1 minutes later add 2 cups of rice of choice and slightly brown the rice",
      "Add in cooking wine and let it cook the alcohol out.",
      "Now add 4 cups of vegetable broth, bring up to boil and lower heat to a simmer. Let cook for 20-25 minutes.",
    ],
    date_created: "7/10/2021",
    category: "lunch",
    description:
      "One pot dish where can we slowly cook each ingredient then throw in the next!",
    tags: ["1 Pot", "Simple"],
  },
  {
    isActive: true,
    display_name: "Cereal",
    ingredients: ["almost milk", "cinnamon toast crunch"],
    tags: ["fast", "simple"],
    instructions: ["Pour milk into bowl ;)", "Pour in Cinnamon Toast Crunch"],
    date_created: "7/1/2021",
    category: "breakfast",
    description: "Cereal of choice, make sure you pour in the milk first!",
  },
  {
    isActive: true,
    display_name: "Chicken Parm",
    ingredients: [
      "Chicken breast",
      "Mozzerella Cheese",
      "Breadcrumbs",
      "Egg",
      "Pasta of choice",
    ],
    instructions: [
      "Fry chicken breast until outter crust is golden brown",
      "Place chicken atop sauce oven safe pan, top with mozzerella cheese, bake at 350 for 20-25 minutes",
      "Boil pasta of choice and strain",
      "Once pasta is cooked and the oven is done combine and serve",
    ],
    tags: ["Italian", "Date Nate"],
    date_created: "12/6/2020",
    category: "dinner",
    description:
      "Chicken Parmesan (also called Chicken Parmigiana). Simple oven baked dish served with garlic bread and pasta!",
  },
  {
    isActive: true,
    display_name: "Pad Thai",
    ingredients: ["Peanut Butter", "egg", "pad thai sauce", "onion"],
    instructions: [
      "Pre soak noodles in room temp water for 10-20 minutes",
      "Combine fish oil, soy sauce, oyster sauce, finely ground peanuts, chili oil, garlic and ginger to make pad thai sauce",
      "Pre heat a large wok to medium-high heat",
      "Pour in oil and noodles into the wok",
      "Toss in veggies of choice (Onion, broccoli, sprouts, etc...",
      "Crack in eggs and scramble until cooked through",
      "Pour in sauce and cook for 2-3 minutes, then serve",
    ],
    tags: ["Nut Allergy", "Thai Food"],
    date_created: "5/6/2019",
    category: "dinner",
    description:
      "Stir dish that includes vegatables of chioce, peanuts, egg and a chioce of protein!",
  },
  {
    isActive: true,
    display_name: "Peanut Butter Toast",
    ingredients: ["Bread of choice", "creamy peanut butter"],
    tags: ["Nut Allergy", "Simple"],
    instructions: [
      "Toast bread until golden brown",
      "Spread peanut butter on bread",
    ],
    date_created: "5/6/2019",
    category: "snack",
    description:
      "Quick and easy snack that can be made in a couple of minutes",
  },
  {
    isActive: true,
    display_name: "Spaghetti and Sausage",
    instructions: [
      "Carmelize Onion in large frying pan.",
      "Toss in Beyond Meat Sausage and break up.",
      "Add additional oil and toss in garlic.",
      "Pour in 28oz Can of tomatoes and break up with spatula.",
      "Make sauce by ",
      "Simmer sauce",
      "Boil noodles",
      "Combine",
    ],
    ingredients: [
      "Pasta of choice",
      "28oz Can Whole peeled tomatoes",
      "herbs of choice",
      "Beyond Meat Sausage",
      "Yellow Onion",
    ],
    tags: ["Italian", "Vegetarian", "Date night"],
    date_created: "8/1/2021",
    category: "dinner",
    description:
      "Delicious vegetarian Italian meal picked up fresh herbs and animal free protein",
  },
];

export async function createDemoUser(sessionId: string): Promise<SessionUser> {
  await connectToDatabase();

  const demoUsername = "demo" + sessionId.slice(0, 4);
  const demoEmail = `${demoUsername}@email.com`;

  // Check if demo user already exists
  let demoUser = await User.findOne({ email: demoEmail });

  if (!demoUser) {
    demoUser = new User({
      username: demoUsername,
      email: demoEmail,
      password: bcrypt.hashSync("demopassword", 8),
      date_created: dayjs().format("M/D/YYYY"),
      meals: DEMO_MEALS,
      is_demo: true,
    });

    await demoUser.save();

    // Create calendar entry for today
    const today = dayjs().format("M/D/YYYY");
    const existingDate = await Calendar.findOne({ date: today });

    if (existingDate) {
      await Calendar.findOneAndUpdate(
        { date: today },
        {
          $push: {
            users: {
              user_id: demoUser._id,
              breakfast: demoUser.meals[2]._id,
              lunch: demoUser.meals[0]._id,
              dinner: demoUser.meals[3]._id,
              snack: demoUser.meals[5]._id,
            },
          },
        }
      );
    } else {
      await new Calendar({
        date: today,
        users: [
          {
            user_id: demoUser._id,
            breakfast: demoUser.meals[2]._id,
            lunch: demoUser.meals[0]._id,
            dinner: demoUser.meals[3]._id,
            snack: demoUser.meals[5]._id,
          },
        ],
      }).save();
    }
  }

  return {
    id: demoUser._id.toString(),
    username: demoUser.username,
    email: demoUser.email,
  };
}

export async function signupUser(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: SessionUser }> {
  await connectToDatabase();

  // Check for existing user
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    if (existingUser.username === username) {
      return { success: false, message: "Username already exists" };
    }
    return { success: false, message: "Email already exists" };
  }

  const user = new User({
    username,
    email,
    password: bcrypt.hashSync(password, 8),
    is_demo: false,
    date_created: dayjs().format("M/D/YYYY"),
    meals: [],
  });

  await user.save();

  return {
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
  };
}

export async function signinUser(
  username: string,
  password: string
): Promise<{ success: boolean; message: string; user?: SessionUser; errorCode?: number }> {
  await connectToDatabase();

  const user = await User.findOne({ username });

  if (!user) {
    return { success: false, message: "User not found", errorCode: 0 };
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return { success: false, message: "Invalid password", errorCode: 1 };
  }

  return {
    success: true,
    message: "Login successful",
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
  };
}

export async function deleteDemoUser(sessionId: string): Promise<void> {
  await connectToDatabase();

  const demoUsername = "demo" + sessionId.slice(0, 4);
  await User.deleteOne({ username: demoUsername, is_demo: true });
}

export async function deleteAllDemoUsers(): Promise<void> {
  await connectToDatabase();
  await User.deleteMany({ is_demo: true });
}
