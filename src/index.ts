import mongoose from "mongoose";

import app from "./app";
import { logger } from "./middlewares/logger";
const PORT = process.env.PORT || 5000;

//connect db and start server
mongoose
  .connect(process.env.DATABASE_URL as string)
  .then(() => {
    console.log("db connected");
    app.listen(PORT, () => console.log(`server running at PORT - ${PORT}`));
  })
  .catch((err) => {
    //catching error with winston
    logger.log("error", err.message);

    if (process.env.NODE_ENV === "development") {
      console.log(err.message);
    }
  });
