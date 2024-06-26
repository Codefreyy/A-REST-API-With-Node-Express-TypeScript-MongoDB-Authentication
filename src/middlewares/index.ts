import express from 'express';
// get and merge are functions from lodash for deep object manipulation
import { get, merge } from 'lodash'

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['JOY-AUTH']

        if (!sessionToken) {
            return res.sendStatus(401)
        }

        const existingUser = await getUserBySessionToken(sessionToken)
        if (!existingUser) {
            return res.sendStatus(401)
        }

        // this line aims to add the user object to the request object to be used in the next middleware
        merge(req, { identity: existingUser })

        return next()

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }

}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params


        const currentUserId = get(req, 'identity._id') as string

        console.log(currentUserId, id)
        if (!currentUserId) {
            return res.sendStatus(401)
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403)
        }

        next()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}
