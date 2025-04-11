const {Router} = require("express");
const {generateHash} = require("../utils/utils");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');

const authRoutes = Router();
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

/**
 * POST /create_user
 * Creates a new user account
 * @name createUser
 * @function
 * @param {Object} body - Request body
 * @param {string} body.userName - Desired username
 * @param {string} body.password - Desired password
 * @returns {Object} Response indicating success or failure
 * @returns {boolean} success - Indicates if the request was successful
 * @returns {string} message - Success or error message
 */
authRoutes.post("/create_user", async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (userName == null || password == null) {
            res.status(400).json({ success: false, message: "username and password is required" });
            return
        }
        let passwordHash = generateHash(password);

        let user = await prisma.user.create({
            data: {
                name: userName,
                password: passwordHash
            }
        });
        res.status(200).json({success: true, message: `user with username ${userName} created`});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false, message: `username ${userName} taken`});
    }
});

/**
 * POST /login
 * Authenticates a user and returns a JWT token
 * @name login
 * @function
 * @param {Object} body - Request body
 * @param {string} body.userName - Username
 * @param {string} body.password - Password
 * @returns {Object} Response containing JWT token or error message
 * @returns {string} [token] - JWT token for authenticated requests
 * @returns {boolean} [success] - Indicates if the request was successful
 * @returns {string} [message] - Error message if authentication fails
 */
authRoutes.post("/login", async (req, res) => {
    try {
        const {userName, password} = req.body;
        let user = await prisma.user.findUnique({
            where: {
                name: userName
            }
        });
        let passwordHash = generateHash(password);
        if (passwordHash === user.password) {
            let token = jwt.sign(userName, secret);
            res.status(200).json({token});
            return
        } else {
            res.status(404).json({success: false, message: "invalid password"});
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({success: false, message: "invalind userid or password"});
    }
});

module.exports = authRoutes