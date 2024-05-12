import express from "express";
import env from "dotenv"
import axios from "axios";
import cors from "cors";
env.config({
    path: './.env'
})

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', (req, res) => {
    res.send("Welcome To my backend.")
})

app.use('/api/jokes', async (req, res) => {
    try {
        let apiUrl = "https://api.chucknorris.io/jokes/random";

        // Check if category query parameter is provided
        let categoryResponse = await axios.get("https://api.chucknorris.io/jokes/categories");
        if (req.query.category) {
            apiUrl += `?category=${req.query.category}`;
        } else {
            const randomCategory = categoryResponse.data[Math.floor(Math.random() * categoryResponse.data.length)];
            apiUrl += `?category=${randomCategory}`;
        }

        // Fetch joke from Chuck Norris API
        const jokesResponse = await axios.get(apiUrl);

        // Send response with joke data
        res.send({
            joke: jokesResponse.data,
            categories: categoryResponse.data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ "message": "Something went wrong while getting jokes" });
    }
});



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}. Check at: http://localhost:${PORT}`);
});
