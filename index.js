import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Create a new PostgreSQL client instance
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "todo",
    password: "add_ur_password",
    port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

async function getTasks() {
    try {
        const response = await db.query("SELECT * FROM tasks");
        return response.rows;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

app.get("/", async (req, res) => {
    const tasks = await getTasks();
    res.render("index.ejs", {
        tasks: tasks,
    });
});

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/remove", async (req, res) => {
    const taskId = parseInt(req.body['taskNumber'], 10);
    if (isNaN(taskId)) {
        return res.status(400).send("Invalid task ID");
    }
    try {
        await db.query("DELETE FROM tasks WHERE id = $1", [taskId]);
    } catch (error) {
        console.error("Error removing task:", error);
        return res.status(500).send("Error removing task");
    }
    res.redirect("/");
});

app.post("/new", async (req, res) => {
    const { title, desc } = req.body;
    try {
        await db.query(
            "INSERT INTO tasks (title, description) VALUES ($1, $2)",
            [title, desc]
        );
    } catch (error) {
        console.error("Error adding new task:", error);
        return res.status(500).send("Error adding task");
    }
    res.redirect("/");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
