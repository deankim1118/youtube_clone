import express from "express";
import {watch, getEdit, postEdit, getUpload, postUpload, deleteVideo} from "../controllers/videoController"

const videoRouter = express.Router();

// ':' 를 url에 추가하면 express는 : 가 (Parameter)로 인식한다. :id, :potato 등 이름은 상관없다.
// :id가 들어간 라우터가 항상 밑에 들어가야 된다! 그렇지 않으면 /upload도 :id (Parameter)로 인식하게 되서 에러가 난다!!
videoRouter.route('/upload').get(getUpload).post(postUpload);
videoRouter.get('/:id([0-9a-fA-F]{24})', watch);
videoRouter.route('/:id([0-9a-fA-F]{24})/edit').get(getEdit).post(postEdit);
videoRouter.route('/:id([0-9a-fA-F]{24})/delete').get(deleteVideo);

// export default videoRouter;
module.exports = videoRouter;