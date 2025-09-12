import 'dotenv/config'
import app from "./src/app.js";
import { dbConnection } from './src/db/db.js';

const port = process.env.PORT;
dbConnection();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});