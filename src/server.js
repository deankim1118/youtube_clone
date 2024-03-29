import express from "express";
import morgan from "morgan";

const app = express();
const morganLogger =  morgan("dev");

const PORT = 4000;

const handleListening = () => console.log(`Server is listening on port localhose:${PORT}`);

// Middleware는 request에 응답하는 함수가 아니라, request를 지연시키고 작업을 다음 함수로 넘겨주는 함수이다.
const logger = (req, res, next) => {
  console.log(`Someone requests by method : ${req.method} url : ${req.url}`);
  next();
} 

const handlehome = (req, res) => {
  const responseText = `<h1>This is my first server</h1>`
  return res.send(responseText)
}

// app.use를 사용하면 모든 Routes 에서 Middleware가 실행된다.
app.use(logger);
app.use(morganLogger);

app.get("/", handlehome);

app.listen(PORT, handleListening)