import express from "express";

const userRouter = express.Router();


const handleEditUser = (req, res) => { res.send("User Edit")}
const handleDelete = (req, res) => { res.send("Delete Edit")}

userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDelete);

export default userRouter;