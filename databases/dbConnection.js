import mongoose from "mongoose"

const dbConnection = () => {
    mongoose.connect(process.env.DB_CONNECTION)
    .then(conn => console.log(`Database connected on ${process.env.DB_CONNECTION}`))
    .catch(err =>(`Database connected on ${err}`))
}

export default dbConnection