import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.js'
import {
    forgotPasswordRequestService,
    forgotPasswordService,
    loginUserService,
    logoutUserService,
    registerUserService,
    verifyUserService,
    changeCurrentPasswordService
} from '../services/auth.service.js'
import { ApiResponse } from '../utils/api-response.js'
import { findUserById } from '../repositories/auth.repositories.js'

const registerUserHandler = async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body
        if (!fullName || !userName || !email || !password) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'all fields are required'
            )
        }

        const user = await registerUserService({
            fullName,
            userName,
            email,
            password,
        })

        const createdUser = await findUserById(user._id)

        if (!createdUser) {
            throw new ApiError(404, 'user not found after registration')
        }

        return res
            .status(StatusCodes.CREATED)
            .json(
                new ApiResponse(
                    StatusCodes.CREATED,
                    createdUser,
                    "user created successfully and a verification mail is sent to the user's email"
                )
            )
    } catch (error) {
        console.log(error, 'error in register user handler')
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
}

const verifyUserHandler = async (req, res) => {
    try {
        const { rawToken } = req.params
        await verifyUserService(rawToken)
        return res
            .status(400)
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    {},
                    'user verification successful'
                )
            )
    } catch (error) {
        console.log(error, 'error in verify user handler')
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'error in verify user handler',
            {
                error,
            }
        )
    }
}

const loginUserHandler = async (req, res) => {
    try {
        const { email, password } = req.body
        const { user, accessToken, refreshToken } = await loginUserService({
            email,
            password,
        })
        return res
            .status(StatusCodes.OK)
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
            })
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    {
                        user,
                        accessToken,
                        refreshToken,
                    },
                    'user logged in successfully'
                )
            )
    } catch (error) {
        console.log(error.message, 'error in login user handler')
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'error in login user handler',
            {
                error,
            }
        )
    }
}

const getCurrentUserHandler = async (req, res) => {
    try {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    req.user,
                    'current user fetched successfully'
                )
            )
    } catch (error) {
        console.log(error, 'error in get current user handler')
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'error in current user handler'
        )
    }
}

const logoutUserHandler = async (req, res) => {
    try {
        await logoutUserService(req.user._id)
        return res
            .status(StatusCodes.OK)
            .cookie('accessToken', null, {
                httpOnly: true,
                secure: true,
            })
            .cookie('refreshToken', null, {
                httpOnly: true,
                secure: true,
            })
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    {},
                    'user logged out successfully'
                )
            )
    } catch (error) {
        console.log(error, 'error logging out user')
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'error in logout handler'
        )
    }
}

const forgotPasswordRequestHandler = async (req, res) => {
    try {
        const { email } = req.body
        await forgotPasswordRequestService(email)
        return res
            .status(StatusCodes.OK)
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    {},
                    'A verification mail has been sent to your email address'
                )
            )
    } catch (error) {
        console.log(error)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'error in forgot password request handler',
            {
                error,
            }
        )
    }
}

const forgotPasswordHandler = async (req, res) => {
    try {
        const { rawToken } = req.params
        const { newPassword } = req.body
        await forgotPasswordService(rawToken, newPassword)
        return res
            .status(StatusCodes.OK)
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    {},
                    'Password reset successfully'
                )
            )
    } catch (error) {
        console.log(error)
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'error in forgot password handler',
            {
                error,
            }
        )
    }
}

const changeCurrentPasswordHandler = async (req,res) => {
    try {
        const {oldPassword,newPassword} = req.body
        await changeCurrentPasswordService(req.user,oldPassword,newPassword)
        return res.status(StatusCodes.OK).json(
            new ApiResponse(
                StatusCodes.OK,
                {},
                "Password changed successfully"
            )
        )
    } catch (error) {
        console.log(error);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"error in change current password handler",{
            error
        })
        
    }

    

}

export {
    registerUserHandler,
    verifyUserHandler,
    loginUserHandler,
    getCurrentUserHandler,
    logoutUserHandler,
    forgotPasswordRequestHandler,
    forgotPasswordHandler,
    changeCurrentPasswordHandler
}
