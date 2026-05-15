import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import config from "./src/config/config.js";

// Connect to Database
connectDB();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
