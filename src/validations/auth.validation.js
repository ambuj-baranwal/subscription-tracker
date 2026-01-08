import {z} from "zod";

const createUserSchema = z.object({
    body : z.object({
        fullName : z.string()
            .min(3, 'Name must be at least 3 characters')
            .max(255),
        email : z.email(),
        username : z.string().min(4, "Username must be at least 4 characters ").max(25, "Username can be at most 25 characters"),
        password: z.string().min(8, "Password must be at least 8 characters").max(25, "Password can be at most 25 characters"),
    })
})

const getUserSchema = z.object({
    params : z.object({
        userId : z.uuid("Invalid user ID format"),
    })
})

// 🚀 Incomplete Function
const updateUserSchema = z.object({
    params : z.object({
        userId : z.uuid("Invalid user ID format"),
    }),
    body: z.object({

    })
})


export {
    createUserSchema,
    getUserSchema,
    updateUserSchema,
}