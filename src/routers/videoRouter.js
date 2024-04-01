import express from "express";
import {watch, getEdit, postEdit} from "../controllers/videoController"

const videoRouter = express.Router();

// ':' 를 url에 추가하면 express는 : 가 (Parameter)로 인식한다. :id, :potato 등 이름은 상관없다.
// :id가 들어간 라우터가 항상 밑에 들어가야 된다! 그렇지 않으면 /upload도 :id (Parameter)로 인식하게 되서 에러가 난다!!
videoRouter.get('/:id(\\d+)', watch);
videoRouter.route('/:id(\\d+)/edit').get(getEdit).post(postEdit);


// export default videoRouter;
module.exports = videoRouter;