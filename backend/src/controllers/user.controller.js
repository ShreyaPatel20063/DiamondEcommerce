import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // -----------------------------------------------------
    //get res form frontend
    //validations - empty fields
    //if user already exists
    //check for profilepic
    //upload to cloudinary
    // create user in db
    //remove password, refresh token from response
    //check user creation
    // return res
    // -----------------------------------------------------

    //get res form frontend
    const { username, email, password } = req.body;
    console.log(username, email, password);

    //validations - empty fields
    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    //if user already exists
    const existingUser = User.findOne({
        $or: [{ email }, { username }],
    });
    if (existingUser) {
        throw new ApiError(409, "User with Username or Email already exists");
    }

    //check for profilepic
    console.log(req.files);
    const profilePictureLocalPath = req.files?.profilePicture[0]?.path;
    if (!profilePictureLocalPath) {
        throw new ApiError(400, "Profile Picture is required");
    }

    //upload to cloudinary and check if uploaded successfully
    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
    if (!profilePicture) {
        throw new ApiError(400, "Profile Picture is required");
    }

    // create user in db
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        profilePicture: profilePicture.url,
    });

    //remove password, refresh token from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    //check user creation
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while creating user");
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
});

export { registerUser };
