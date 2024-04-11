import express from 'express';

import { deleteUserById, getUserById, getUsers, updateUserById } from '../db/users';


export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers()
        return res.json(users)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params
        await deleteUserById(id)
        return res.sendStatus(204).json({ id, message: 'User deleted' })
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params

        const { username } = req.body

        if (!username) {
            return res.sendStatus(400)
        }

        const user = await getUserById(id)
        if (!user) {
            return res.sendStatus(404)
        }
        // user.username = username
        // await user.save()

        await updateUserById(id, { username })
        return res.sendStatus(204)
        // return res.sendStatus(204).json(user)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}