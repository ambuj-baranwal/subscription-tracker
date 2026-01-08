import {User} from "../config/prisma.js"
import {ApiResponse} from "../utils/ApiResponse.js";

const getUsers = async (req, res) => {
    try {
        const users = await User.findMany()

        return res.status(200).json(new ApiResponse(200, users))
    } catch (error) {
        console.error("Failed to get users", error);
        res.status(400).json({
            error: "Failed to get users",
        })
    }
}

const createUser = async (req, res) => {
    try {
        // const user = await
    } catch (error) {
        console.error("Failed to get users", error);
        res.status(400).json({
            error: "Failed to get users",
        })
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findUnique({
            where: {id : id},
            omit: {password: true},
        })
        if (!user) {return res.status(404).json({error: "User not found"}) }

        return res
            .status(200)
            .json(new ApiResponse(200, user))
    } catch (error) {
        console.error("Failed to get user", error);
        res.status(400).json({
            error: "Failed to get user",
        })
    }
}

const updateUser = async (req, res) => {
    try {
            //
    } catch (error) {
        console.error("Failed to get users", error);
        res.status(400).json({
            error: "Failed to get users",
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.delete({
            where: {id: '7ed2f11a-2a96-4a4e-9ad6-5307182e77f1'},
        })

        res.status(204).json(new ApiResponse(204, {}, "User Deleted Successfully"))
    } catch (error) {
        console.error("Failed to get users", error);
        res.status(400).json({
            error: "Failed to get users",
        })
    }
}


export {
    getUsers,
    getUser,
    createUser,
    deleteUser,
}