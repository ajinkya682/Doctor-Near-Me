import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import config from "./src/config/config.js";
import { initSocket } from "./src/services/socket.service.js";
import { initCronJobs } from "./src/services/cron.service.js";

// Connect to Database
connectDB();

const server = http.createServer(app);

// Initialize Services
initSocket(server);
initCronJobs();

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io initialized`);
  console.log(`⏰ Cron jobs started`);
});
