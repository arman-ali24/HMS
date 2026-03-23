import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://armanali0178614_db_user:2dZCOMV584Meyb8A@cluster0.dpkf3zi.mongodb.net/MediCare",
    )
    .then(() => {
      console.log("DB CONNECTED");
    });
};
