module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/db/connection.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/meemeals";
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
let cached = global.mongoose || {
    conn: null,
    promise: null
};
if (!global.mongoose) {
    global.mongoose = cached;
}
async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectToDatabase;
}),
"[project]/lib/db/models/user.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MealSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    isActive: {
        type: Boolean,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [
            String
        ],
        required: false,
        default: []
    },
    instructions: {
        type: [
            String
        ],
        required: false,
        default: []
    },
    tags: {
        type: [
            String
        ],
        required: false,
        default: []
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    date_last_eaten: {
        type: String,
        required: false
    },
    date_created: {
        type: String,
        required: true
    }
});
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_created: {
        type: String,
        required: true
    },
    meals: {
        type: [
            MealSchema
        ],
        default: []
    },
    is_demo: {
        type: Boolean,
        required: true,
        default: false
    },
    roles: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
            ref: "Role"
        }
    ]
});
// Prevent model recompilation in development
const User = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("User", UserSchema);
const __TURBOPACK__default__export__ = User;
}),
"[project]/lib/db/models/calendar.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const CalendarUserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    user_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: "User"
    },
    breakfast: {
        type: String,
        required: false
    },
    lunch: {
        type: String,
        required: false
    },
    dinner: {
        type: String,
        required: false
    },
    snack: {
        type: String,
        required: false
    }
}, {
    _id: false
});
const CalendarSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    date: {
        type: String,
        required: true
    },
    users: {
        type: [
            CalendarUserSchema
        ],
        required: false,
        default: []
    }
}, {
    timestamps: true
});
// Prevent model recompilation in development
const Calendar = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Calendar || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Calendar", CalendarSchema);
const __TURBOPACK__default__export__ = Calendar;
}),
"[project]/lib/db/models/role.model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const RoleSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true
    }
});
// Prevent model recompilation in development
const Role = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Role || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Role", RoleSchema);
const __TURBOPACK__default__export__ = Role;
}),
"[project]/lib/db/models/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/models/user.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$calendar$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/models/calendar.model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$role$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/models/role.model.ts [app-route] (ecmascript)");
;
;
;
}),
"[project]/lib/db/models/user.model.ts [app-route] (ecmascript) <export default as User>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "User",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/models/user.model.ts [app-route] (ecmascript)");
}),
"[project]/lib/db/models/calendar.model.ts [app-route] (ecmascript) <export default as Calendar>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Calendar",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$calendar$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$calendar$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/models/calendar.model.ts [app-route] (ecmascript)");
}),
"[project]/lib/services/auth.service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDemoUser",
    ()=>createDemoUser,
    "deleteAllDemoUsers",
    ()=>deleteAllDemoUsers,
    "deleteDemoUser",
    ()=>deleteDemoUser,
    "signinUser",
    ()=>signinUser,
    "signupUser",
    ()=>signupUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dayjs/dayjs.min.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$connection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/connection.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/db/models/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/lib/db/models/user.model.ts [app-route] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$calendar$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/lib/db/models/calendar.model.ts [app-route] (ecmascript) <export default as Calendar>");
;
;
;
;
// Sample meals for demo users
const DEMO_MEALS = [
    {
        isActive: true,
        display_name: "Spinach Feta pasta w/ cherry tomatoes",
        ingredients: [
            "Cherry Tomatoes",
            "Spinach",
            "pasta of choice",
            "Red Onion",
            "mozzarella"
        ],
        instructions: [
            "Add a some olive oil to a medium-hot pan and sear tomatoes for 1-2 minutes",
            "Lower heat to medium and add more olive oil and chopped red onion",
            "Add in spinach and various spices of choice",
            "After 5-7 minutes move contents to oven safe baking pan, top with mozzerela cheese and bake 20-30 minutes at 350F",
            "Boil pasta and strain, save a little bit of pasta water for sauce",
            "When finished baking add pasta and pasta waster to dish, mix and serve!"
        ],
        tags: [
            "Baked Dish",
            "Tik Tok",
            "Vegetarian"
        ],
        date_created: "6/3/2021",
        category: "dinner",
        description: "Simple pasta delicious vegetarian dish. Can add any vegatables of choice."
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
            "red pepper flakes"
        ],
        instructions: [
            "Add oil and sauate Onions in large skillet pan on medium heat",
            "after 5-7 minutes pour in all veggies of choice (peppers, broccoli, etc...)",
            "Add in sausage and let cook for 4-5 minutes.",
            "Add more oil after 2-3 minutes and toss in garlic and red pepper flakes",
            "1 minutes later add 2 cups of rice of choice and slightly brown the rice",
            "Add in cooking wine and let it cook the alcohol out.",
            "Now add 4 cups of vegetable broth, bring up to boil and lower heat to a simmer. Let cook for 20-25 minutes."
        ],
        date_created: "7/10/2021",
        category: "lunch",
        description: "One pot dish where can we slowly cook each ingredient then throw in the next!",
        tags: [
            "1 Pot",
            "Simple"
        ]
    },
    {
        isActive: true,
        display_name: "Cereal",
        ingredients: [
            "almost milk",
            "cinnamon toast crunch"
        ],
        tags: [
            "fast",
            "simple"
        ],
        instructions: [
            "Pour milk into bowl ;)",
            "Pour in Cinnamon Toast Crunch"
        ],
        date_created: "7/1/2021",
        category: "breakfast",
        description: "Cereal of choice, make sure you pour in the milk first!"
    },
    {
        isActive: true,
        display_name: "Chicken Parm",
        ingredients: [
            "Chicken breast",
            "Mozzerella Cheese",
            "Breadcrumbs",
            "Egg",
            "Pasta of choice"
        ],
        instructions: [
            "Fry chicken breast until outter crust is golden brown",
            "Place chicken atop sauce oven safe pan, top with mozzerella cheese, bake at 350 for 20-25 minutes",
            "Boil pasta of choice and strain",
            "Once pasta is cooked and the oven is done combine and serve"
        ],
        tags: [
            "Italian",
            "Date Nate"
        ],
        date_created: "12/6/2020",
        category: "dinner",
        description: "Chicken Parmesan (also called Chicken Parmigiana). Simple oven baked dish served with garlic bread and pasta!"
    },
    {
        isActive: true,
        display_name: "Pad Thai",
        ingredients: [
            "Peanut Butter",
            "egg",
            "pad thai sauce",
            "onion"
        ],
        instructions: [
            "Pre soak noodles in room temp water for 10-20 minutes",
            "Combine fish oil, soy sauce, oyster sauce, finely ground peanuts, chili oil, garlic and ginger to make pad thai sauce",
            "Pre heat a large wok to medium-high heat",
            "Pour in oil and noodles into the wok",
            "Toss in veggies of choice (Onion, broccoli, sprouts, etc...",
            "Crack in eggs and scramble until cooked through",
            "Pour in sauce and cook for 2-3 minutes, then serve"
        ],
        tags: [
            "Nut Allergy",
            "Thai Food"
        ],
        date_created: "5/6/2019",
        category: "dinner",
        description: "Stir dish that includes vegatables of chioce, peanuts, egg and a chioce of protein!"
    },
    {
        isActive: true,
        display_name: "Peanut Butter Toast",
        ingredients: [
            "Bread of choice",
            "creamy peanut butter"
        ],
        tags: [
            "Nut Allergy",
            "Simple"
        ],
        instructions: [
            "Toast bread until golden brown",
            "Spread peanut butter on bread"
        ],
        date_created: "5/6/2019",
        category: "snack",
        description: "Quick and easy snack that can be made in a couple of minutes"
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
            "Combine"
        ],
        ingredients: [
            "Pasta of choice",
            "28oz Can Whole peeled tomatoes",
            "herbs of choice",
            "Beyond Meat Sausage",
            "Yellow Onion"
        ],
        tags: [
            "Italian",
            "Vegetarian",
            "Date night"
        ],
        date_created: "8/1/2021",
        category: "dinner",
        description: "Delicious vegetarian Italian meal picked up fresh herbs and animal free protein"
    }
];
async function createDemoUser(sessionId) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$connection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    const demoUsername = "demo" + sessionId.slice(0, 4);
    const demoEmail = `${demoUsername}@email.com`;
    // Check if demo user already exists
    let demoUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].findOne({
        email: demoEmail
    });
    if (!demoUser) {
        demoUser = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]({
            username: demoUsername,
            email: demoEmail,
            password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hashSync("demopassword", 8),
            date_created: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])().format("M/D/YYYY"),
            meals: DEMO_MEALS,
            is_demo: true
        });
        await demoUser.save();
        // Create calendar entry for today
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])().format("M/D/YYYY");
        const existingDate = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$calendar$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"].findOne({
            date: today
        });
        if (existingDate) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$calendar$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"].findOneAndUpdate({
                date: today
            }, {
                $push: {
                    users: {
                        user_id: demoUser._id,
                        breakfast: demoUser.meals[2]._id,
                        lunch: demoUser.meals[0]._id,
                        dinner: demoUser.meals[3]._id,
                        snack: demoUser.meals[5]._id
                    }
                }
            });
        } else {
            await new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$calendar$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"]({
                date: today,
                users: [
                    {
                        user_id: demoUser._id,
                        breakfast: demoUser.meals[2]._id,
                        lunch: demoUser.meals[0]._id,
                        dinner: demoUser.meals[3]._id,
                        snack: demoUser.meals[5]._id
                    }
                ]
            }).save();
        }
    }
    return {
        id: demoUser._id.toString(),
        username: demoUser.username,
        email: demoUser.email
    };
}
async function signupUser(username, email, password) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$connection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    // Check for existing user
    const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].findOne({
        $or: [
            {
                username
            },
            {
                email
            }
        ]
    });
    if (existingUser) {
        if (existingUser.username === username) {
            return {
                success: false,
                message: "Username already exists"
            };
        }
        return {
            success: false,
            message: "Email already exists"
        };
    }
    const user = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]({
        username,
        email,
        password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hashSync(password, 8),
        is_demo: false,
        date_created: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])().format("M/D/YYYY"),
        meals: []
    });
    await user.save();
    return {
        success: true,
        message: "User registered successfully",
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        }
    };
}
async function signinUser(username, password) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$connection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].findOne({
        username
    });
    if (!user) {
        return {
            success: false,
            message: "User not found",
            errorCode: 0
        };
    }
    const passwordIsValid = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compareSync(password, user.password);
    if (!passwordIsValid) {
        return {
            success: false,
            message: "Invalid password",
            errorCode: 1
        };
    }
    return {
        success: true,
        message: "Login successful",
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        }
    };
}
async function deleteDemoUser(sessionId) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$connection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    const demoUsername = "demo" + sessionId.slice(0, 4);
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].deleteOne({
        username: demoUsername,
        is_demo: true
    });
}
async function deleteAllDemoUsers() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$connection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$models$2f$user$2e$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].deleteMany({
        is_demo: true
    });
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/auth/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "destroySession",
    ()=>destroySession,
    "getSession",
    ()=>getSession,
    "sessionOptions",
    ()=>sessionOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/iron-session/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const sessionOptions = {
    password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
    cookieName: process.env.COOKIE_NAME || "meemeals_session",
    cookieOptions: {
        secure: ("TURBOPACK compile-time value", "development") === "production",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 30
    }
};
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(cookieStore, sessionOptions);
    // Initialize default values if not set
    if (session.isAuth === undefined) {
        session.isAuth = false;
    }
    if (session.isDemo === undefined) {
        session.isDemo = false;
    }
    return session;
}
async function createSession(user, isDemo = false) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(cookieStore, sessionOptions);
    session.isAuth = true;
    session.isDemo = isDemo;
    session.user = user;
    session.sessionId = crypto.randomUUID();
    await session.save();
    return session;
}
async function destroySession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(cookieStore, sessionOptions);
    session.destroy();
}
}),
"[project]/app/api/auth/demo/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/auth.service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/session.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    try {
        // Generate a unique session ID for the demo user
        const sessionId = crypto.randomUUID();
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createDemoUser"])(sessionId);
        // Create session for the demo user
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSession"])(user, true);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error("Demo signup error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03d635bf._.js.map