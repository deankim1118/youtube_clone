import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`Server is listening on port localhose:${PORT}`);
app.listen(PORT, handleListening);