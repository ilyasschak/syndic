import AuthModel from "../models/authModel.js";
import bcryptjs from "bcryptjs";
import validation from "../validations/authValidation.js";
import RoleModel from "../models/roleModel.js";
import sendEmail from "../helpers/sendEmails.js";
import { config } from "dotenv";
import tokenHandler from "../helpers/tokenHandler.js";
import errorHandler from "../validations/validationsErrorHandler.js";
config();

export default class AuthController {
    static async register(req, res) {
        try {
            if (!req.cookies.token) {
                const { error } = validation.validateRegister(req, res);

                if (error) {
                    errorHandler(error);
                }

                const { name, email, password, phoneNumber, address, role } =
                    req.body;

                if (await AuthModel.getUserByEmail(email)) {
                    throw "Email address is already in use.";
                }

                const hashedPassword = await bcryptjs.hash(password, 10);

                const image = req.file ? req.file.filename : null;

                // const roleId = await RoleModel.getRoleId(role);

                const user = new AuthModel(
                    name,
                    image,
                    email,
                    hashedPassword,
                    phoneNumber,
                    address,
                    role
                );

                const registeredUser = await user.register();

                sendEmail(registeredUser, "verification");

                res.status(200).json({
                    success:
                        "Registered successfully, Check your inbox for verification email",
                });
            } else {
                throw new Error("You're already logged in, logged out first!");
            }
        } catch (error) {
            res.status(400).json({
                error: error,
            });
        }
    }

    static async verifyAccount(req, res) {
        const user = req.user;

        if (user.isVerified) {
            return res.status(200).json({
                success: "User has been already verified. Please Login",
            });
        } else {
            user.isVerified = true;

            if (!(await user.save())) {
                return res.status(500).json({
                    error: "Something went wrong on our side, try again later !",
                });
            } else {
                return res.status(200).json({
                    success: "Your account has been successfully verified",
                });
            }
        }
    }

    static async login(req, res) {
        try {
            if (!req.cookies.token) {
                const { error } = validation.validateLogin(req, res);

                if (error) {
                    errorHandler(error);
                }

                const { email, password } = req.body;

                const user = await AuthModel.getUserByEmail(email);

                if (user) {
                    if (await bcryptjs.compare(password, user.password)) {
                        if (user.isVerified) {
                            const token = tokenHandler.signToken(
                                { userId: user._id },
                                process.env.JWT_SECRET_KEY,
                                "7 days"
                            );
                            res.cookie("token", token, {
                                sameSite: "none",
                                secure: true,
                            });

                            req.user = user;
                            // const role = user.role.title

                            res.status(200).send(user);
                        } else {
                            sendEmail(user, "verification");

                            throw "Verify your account first to use the application ! A verification email was sent";
                        }
                    } else {
                        throw "Incorrect password";
                    }
                } else {
                    throw "Email not found";
                }
            } else {
                throw "You're already logged in, logged out first!";
            }
        } catch (error) {
            res.status(400).json({
                error: error,
            });
        }
    }

    static async forgetPassword(req, res) {
        try {
            const { error } = validation.validateForgotPassword(req, res);

            if (error) {
                errorHandler(error);
            }

            const { email } = req.body;

            const user = await AuthModel.getUserByEmail(email);

            if (user) {
                sendEmail(user, "reset");
                res.status(200).json({
                    success: "Verify your inbox for Reset Password email",
                });
            } else {
                throw "User Not Found";
            }
        } catch (error) {
            res.status(400).json({
                error: error,
            });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { error } = validation.validatePassword(req, res);

            if (error) {
                errorHandler(error);
            }

            const user = req.user;

            const { password } = req.body;

            const hashedPassword = await bcryptjs.hash(password, 10);

            user.password = hashedPassword;

            if (!(await user.save())) {
                throw "Something went wrong on our side, try again later !";
            } else {
                return res.status(200).json({
                    success: "Your password changed successfully",
                });
            }
        } catch (error) {
            res.status(400).json({
                error: error,
            });
        }
    }

    static logout(req, res) {
        res.clearCookie("token").status(200).send("Logged out successfully");
    }
}
