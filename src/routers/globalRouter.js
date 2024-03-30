import express from "express";
import {trending} from "../controllers/vidoeController"
import {join} from "../controllers/userController"

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);

// export default globalRouter;
module.exports = globalRouter;