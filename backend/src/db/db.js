import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`\nMongoDB connected !! DB HOST `);
  } catch (error) {
    console.log("dataBase error");
    process.exit(1);
  }
};

export { connectDB };
