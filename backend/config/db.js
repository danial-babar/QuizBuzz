const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Remove the following options as they are no longer supported in Mongoose 6+
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
