import express from "express";
import {see, edit, deleteVideo, upload} from "../controllers/vidoeController"

const videoRouter = express.Router();

// ':' 를 url에 추가하면 express는 : 가 (Parameter)로 인식한다. :id, :potato 등 이름은 상관없다.
// :id가 들어간 라우터가 항상 밑에 들어가야 된다! 그렇지 않으면 /upload도 :id (Parameter)로 인식하게 되서 에러가 난다!!
videoRouter.get('/upload', upload);
videoRouter.get('/:id(\\d+)', see);
videoRouter.get('/:id(\\d+)/edit', edit);
videoRouter.get('/:id(\\d+)/delete', deleteVideo);




// export default videoRouter;
module.exports = videoRouter;