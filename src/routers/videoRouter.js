import express from "express";

const videoRouter = express.Router();


const handleWatchVideo = (req, res) => { res.send("Watch Videos")}
const handleEdit = (req, res) => { res.send("Edit Videos")}

videoRouter.get('/watch', handleWatchVideo);
videoRouter.get('/edit', handleEdit);

export default videoRouter;