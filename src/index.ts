import express from "express";
import subjectsRouter from "./routes/subjects";
import cors from 'cors'


const app = express();
const PORT = 8000;


// JSON middleware
app.use(express.json());
app.use((cors({
    orgin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
})))
app.use("/subjects", subjectsRouter);


// Root GET route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Express TypeScript API!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
