import { comparePassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";
import JWT from "jsonwebtoken";


// POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password, fcmToken } = req.body;  // Retrieve fcmToken from request body

        // Checking the EMAIL and PASSWORD
        if (!email || !password) {
            console.log("Login attempt with missing email or password.");
            return res.status(401).send({
                success: false,
                message: "Invalid username or password",
                errorType: "invalidCredentials",
            });
        }

        // FINDING THE USER
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log(`Login failed. User not found for email: ${email}`);
            return res.status(401).send({
                success: false,
                message: "User Not Registered!",
                errorType: "invalidUser",
            });
        }

        // IF USER EXISTS - CHECKING THE PASSWORD
        const match = await comparePassword(password, user.password);
        if (!match) {
            console.log(`Login failed. Incorrect password for user: ${email}`);
            return res.status(401).send({
                success: false,
                message: "Invalid Password!",
                errorType: "invalidPassword",
            });
        }

        try {
            if (fcmToken) {
                user.fcmToken = fcmToken; // Save the FCM token in the user document
                await user.save();  // Save updated user with the new FCM token
                console.log("FCM Token saved for user:", email);
                console.log("FCM Token:", fcmToken);
            }
        } catch (error) {
            console.log("Error saving FCM Token:", error);  // Log any errors
        }

        // Generate JWT token
        const token = await JWT.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Log the token in the console
        console.log("JWT Generated:", token);

        // SUCCESS RESPONSE
        res.status(200).send({
            success: true,
            message: "Logged in Successfully!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                profilePicture: user.profilePicture,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log("Login error: " + error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error,
        });
    }
};

// POST LOGOUT
export const logoutController = async (req, res) => {
    try {
        const { userId } = req.body; // Expecting the user ID in the request body

        // Validate user ID
        if (!userId) {
            console.log("Logout attempt without user ID.");
            return res.status(400).send({
                success: false,
                message: "User ID is required for logout.",
            });
        }

        // Find user and clear the FCM token
        const user = await userModel.findById(userId);
        if (!user) {
            console.log(`Logout failed. User not found for ID: ${userId}`);
            return res.status(404).send({
                success: false,
                message: "User not found.",
            });
        }

        // Clear the FCM token
        user.fcmToken = null;
        await user.save();
        console.log(`FCM token cleared for user ID: ${userId}`);

        // Respond with success
        res.status(200).send({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).send({
            success: false,
            message: "Error in logout.",
            error,
        });
    }
};