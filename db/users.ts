import mongoose from 'mongoose';

// userschema is a schema for the user collection
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        // select: false means that the password will not be returned when querying the database
        password: { type: String, required: true, select: false },
        // salt is used to hash the password
        salt: { type: String, required: true, select: false },
        // sessionToken is used to authenticate the user
        sessionToken: { type: String, select: false }
    }
})

// usermodel is a model for the user collection
export const UserModel = mongoose.model('User', UserSchema)

export const getUsers = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({ email })
// getUserBySessionToken is a function that returns a user with the given session token
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken })
export const getUserById = (id: string) => UserModel.findById(id)
// user.toObject() is a function that returns a plain object
export const createUser = (users: Record<string, any>) => new UserModel(users).save().then((user) => user.toObject())
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id })
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)