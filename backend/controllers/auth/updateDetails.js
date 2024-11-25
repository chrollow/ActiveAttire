import userModel from "../../models/userModel.js";

// Update Details controller
export const updateDetailsController = async (req, res) => {
    try {
        const { newName, newEmail, newPhone, email } = req.body;

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
                errorType: "invalidUser",
            });
        }

        // Prepare the update object
        const updates = {};
        if (newName) updates.name = newName;
        if (newEmail) updates.email = newEmail;
        if (newPhone) updates.phone = newPhone;

        // Update the user details
        const updatedUser = await userModel.findOneAndUpdate(
            { email },
            updates,
            { new: true } // Returns the updated document
        );

        // Send success response
        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update Details Error:", error);
        res.status(500).send({
            success: false,
            message: "Error updating details",
            error,
        });
    }
};