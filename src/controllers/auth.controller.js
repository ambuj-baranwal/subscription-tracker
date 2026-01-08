import {User} from "../config/prisma.js";
import {upload} from "../middlewares/multer.middleware.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {comparePassword, generateAccessToken, generateRefreshToken, hashPassword} from "../utils/auth.utils.js";

// Method
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findFirst({
            where: { id: userId },
            select: {id: true, email: true, username: true, fullName: true},
        })
        // create a method for generating both access and refresh token and then save refresh token to db then use it to match access token from user & update it
        const accessToken = await generateAccessToken(user)
        const refreshToken = await generateRefreshToken(user)
        await User.update({
            where: {
                id: userId
            },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        })
        return {accessToken, refreshToken}
    } catch (error) {
        console.log("Error while generating access and refreshToken", error);
        throw new Error("Error while generating refresh and access token");
    }
}


const signUp = async (req, res) => {
    try {
        const {fullName, email, username, password } = req.body

        if ([fullName, email, username, password].some((field) => field?.trim() === "")) {return  res.status(400).json({error: "All fields are required"})}

        const existingUser = await User.findFirst({ where: {
                OR : [ {email: email || ''},
                    {username: username?.toLowerCase() || ''},]
            }})
        if (existingUser) {return res.status(409).json({error: "User already exists"})}

        // const avatarLocalPath = req.files?.avatar[0]?.path
        // if (!avatarLocalPath) { res.status(400).json({error: "Avatar file is required"})}

        // const avatar = await uploadFileUtility(avatarLocalPath) // use service like cloudinary or any other appwrite bucket storage
        // const avatar = await upload(avatarLocalPath) // use service like cloudinary or any other appwrite bucket storage
        // if (!avatar) {return res.status(400).json({error: "Avatar file is required"})}

        // Hashing Password before saving it to database
        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            data: {
                fullName: fullName,
                email: email,
                username: username.toLowerCase(),
                password: hashedPassword, // Store hashed value of password
                avatar: "" // avatarLocalPath || "",
            }
        })
        if (!user) {return res.status(500).json({error: "Failed to create user."})}
        return res.status(201).json({
            response: new ApiResponse(200, user, "User registered successfully."),
        })

    } catch (error) {
        console.error("Registration failed : ", error);
        res.status(500).json({ error: "Failed to register user" });
    }
}



const login = async (req, res) => {
    try {
        let {email, username, password} = req.body;
        console.log(username, password);
        if (!(email || username) || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        if (!username) {username = ''}
        const user = await User.findFirst({
            where: {
                OR : [
                    { email: email || ''},
                    {username: username.trim().toLowerCase() || ''}
                ],
            },
        })
        if (!user) {
            return res.status(404).json({error: "User with this Email or Username doesn't exist. Please Sign Up"});
        }

        const isPasswordValid = await comparePassword(password, user.password) // using bcrypt to compare hashed password with database
        if (!isPasswordValid) {return res.status(401).json({ error: "Invalid password" });}

        const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user.id)
        const loggedInUser = await User.findUnique({
            where: {id: user.id},
            omit: { password: true, refreshToken : true },
        })

        const options = {
            httpOnly: true,
            secure: true,
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken},
                    "User Logged In Successfully.")
            )
    } catch (error) {
        console.error("Login failed : ", error);
        res
            .status(500)
            .json({ error: "Login Failed" });
    }
}


const logout = async (req, res) => {
    try {
        // const {email} = req.body;
        // getting user through auth middleware via cookie set by it
        const userId = req.user.id;
        await User.update({
            where: { id: userId },
            data: {
                refreshToken: null
            }
        })
        // options below is used for sending secure cookies that can't be modified by others
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully. "))

    } catch (error) {
        console.error("Logout failed : ", error);
        res.status(500).json({ error: "Failed to logout" });
    }
}


const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {res.status(401).json({error: "Refresh token is required"})}
        try {
            const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
            const user = await User.findUnique({where: {id: decodedToken.id}})
            if (!user) {
                res.status(401).json({error: "Invalid Refresh token"})
            }

            if (incomingRefreshToken !== user?.refreshToken) {
                res.status(401).json({error: "Refresh token is either expired or used"})
            }

            const options = {
                httpOnly: true,
                secure: true,
            }
            const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(user.id)
            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", newRefreshToken, options)
                .json(new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token Refreshed successfully"))
        } catch (e) {
            console.error("Invalid Refresh token : ", e)
            res.status(500).json({ error: "Invalid  refresh token" });
        }
    } catch (error) {
        console.error("Refresh access token is not valid: ", error);
        res.status(500).json({error: "Refresh token is not valid"})
    }
}

// Optional feature which need schema update  with following fields in prisma.schema of user
//     passwordResetToken String?
//     passwordResetExpires DateTime?

const changeCurrentPassword = async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const Id = req.user.id;  // through auth middleware
        const user = await User.findUnique({
            where: {id: Id},
            include: {password: true}
            })
        const isPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isPasswordValid) {return res.status(401).json({error: "Invalid Old Password"});}
        await User.update({
            where: { id: Id },
            data: {
                password: await hashPassword(newPassword)
            }
        })

        return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully."))

    } catch (error) {
        console.error("Failed to update current Password: ", error);
        res.status(500).json({ error: "Failed to update current Password" });
    }
}

const resetPassword = async (req, res) => {
    try {
        const {newPassword} = req.body;
        if (!newPassword) {res.status(401).json({error: "Please send valid Password"})}
        const Id = req.user.id;  // through auth middleware
        await User.update({
            where: { id: Id },
            data: {
                password: await hashPassword(newPassword)
            }
        })

        return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully."))

    } catch (error) {
        console.error("Failed to Reset Password: ", error);
        res.status(500).json({ error: "Failed to Reset Password" });
    }
}


// Incomplete Controller for Account Update
const updateAccountDetails = async (req, res) => {
    try {
        const {fullName, username} = req.body;
        const Id = req.user.id;
        if (!fullName || !username) {res.status(400).json({error: "Invalid full Name or email"});}
        const user = await User.update({
            where: { id: Id },
            data: {fullName},
            omit: {password: true, refreshToken: true},
        })

        return res
            .status(200)
            .json(new ApiResponse(200, user, "User details updated successfully."))
    } catch (error) {
        console.error("Failed to update account details: ", error);
        res.status(500).json({error: "Failed to update account details"});
    }
}

const getUserDetail = async (req, res) => {
    if (!req.user) {res.status(401).json({error: "Invalid User"})}
    const user = req.user;
    return res.status(200).json(new ApiResponse(200, user, "User details fetched successfully."));
}

// const updateUserAvatar = async (req, res) => {
//     try {
//         const avatarLocalPath = req.file?.path
//         if (!avatarLocalPath) {return res.status(400).json({error: "Invalid avatar local path"});}
//         const avatar = await upload(avatarLocalPath)  // update this function correctly
//         if (!avatar) {return res.status(400).json({error: "Invalid avatar local path"});}
//         const user = await User.upsert({ // pass avatar as avatar.url to store in database that you get from cloud utility
//             where: { id: req.user.id },update : {avatar: avatar},omit: {password: true, refreshToken: true},
//         })
//         return res
//             .status(200)
//             .json(new ApiResponse(200, user, "Avatar Image updated successfully."))
//     } catch (error) {
//         console.error("Failed to upload avatar: ", error);
//         res.status(500).json({error: "Failed to upload avatar"});
//     }
// }


export {
    signUp,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
    resetPassword,
    updateAccountDetails,
    getUserDetail,
    // updateUserAvatar,
}
