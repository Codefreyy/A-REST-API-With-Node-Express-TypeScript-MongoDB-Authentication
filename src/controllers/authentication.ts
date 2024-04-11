import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.sendStatus(409)
        }

        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                // the password field in the database will be the hash of the password that the user provided
                password: authentication(salt, password),
                salt
            }
        })

        return res.status(201).json(user)

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }

}

export const login = async (req: express.Request, res: express.Response) => {
    try {

        const { username, password, email } = req.body

        if (!email && !username) {
            return res.sendStatus(400)
        }

        // select the password and salt fields from the database, so that later we can compare the password that the user provided with the password stored in the database
        const user = await getUserByEmail(email).select('+authentication.password +authentication.salt')
        if (!user) {
            return res.sendStatus(404)
        }

        // expectedHash is the hash of the password that the user provided
        // user.authentication.salt is the salt that was used to hash the password that the user provided
        const expectedHash = authentication(user.authentication.salt, password)

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(401)
        }

        const salt = random()
        // generate a new session token for the user
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        // set the JOY-AUTH cookie in the user's browser to the session token to authenticate the user and authorize the user to access protected routes
        res.cookie('JOY-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' })

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }

}