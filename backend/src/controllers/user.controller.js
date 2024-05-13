import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const options = {
    httpOnly: true,
    secure: true,
};

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

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
    const existingUser = await User.findOne({
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

    // if(req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length>0){
    //     // set profilePic path
    // }

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
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User Registered Successfully")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    // -------------------------------
    //  req body - data
    // username or email based auth
    // find user in db
    // password check
    // generate refresh and access token
    // send cookies
    // -------------------------------

    //  req body - data
    const { username, email, password } = req.body;
    // username or email based auth
    if (!username && !email) {
        throw new ApiError(400, "Username or Email is required");
    }
    // find user in db
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // password check
    const isPassValid = await user.checkPassword(password);
    if (!isPassValid) {
        throw new ApiError(401, "Invalid User Credentials");
    }
    // generate refresh and access token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    const loggedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    // send cookies
    // const options = {
    //     httpOnly: true,
    //     secure: true,
    // };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedUser, accessToken, refreshToken },
                "User Logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    // const options = {
    //     httpOnly: true,
    //     secure: true,
    // };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh Token expired or used");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access Token Refreshed Successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Error generating refreshed access token"
        );
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    //check if old password is correct
    const user = await findById(req.user?._id);
    const isPasswordValid = await user.checkPassword(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Old Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current User Details"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { username, email },
        { new: true }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User Updated Successfully"));
});

const updateProfilePicture = asyncHandler(async (req, res) => {
    const profilePictureLocalPath = req.file?.path;
    if (!profilePictureLocalPath) {
        throw new ApiError(400, "Profile Picture is required");
    }

    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
    if (!profilePicture) {
        throw new ApiError(400, "Profile Picture is required");
    }
    
    const oldProfilePicture = req.user.profilePicture;
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePicture: profilePicture.url },
        { new: true }
    );

    if (oldProfilePicture) {
        await destroyFromCloudinary(oldProfilePicture);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Profile Picture Updated Successfully"
            )
        );
});


//export
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUser,
    updateProfilePicture,
};
