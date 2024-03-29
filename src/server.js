import express from "express";

const app = express();

const PORT = 4000;

const handlehome = (req, res) => {
    return res.send('This is my first Server')
}

const handleListening = () => console.log(`Server is listening on port localhose:${PORT}`);

app.get("/", handlehome);

app.listen(PORT, handleListening)