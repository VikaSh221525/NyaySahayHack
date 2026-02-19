import 'dotenv/config';
import { createServer } from 'http';
import app from "./src/app.js";
import { dbConnection } from './src/db/db.js';
import initSocketServer from './src/sockets/socket.server.js';

const port = process.env.PORT || 3000;

// Connect to database
dbConnection();

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO server
initSocketServer(httpServer);

// Start server
httpServer.listen(port, () => {
    console.log(`🚀 NyaySahay Server running on port ${port}`);
    console.log(`📡 Socket.IO server initialized`);
    console.log(`⚖️ JusticeAI ready to assist`);
});

//////