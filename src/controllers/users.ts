import express from 'express';

import { deleteUserById, getUsers } from '../db/users';


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
        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}