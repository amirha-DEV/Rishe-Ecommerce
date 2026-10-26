/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Authorization management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^09\d{9}$'
 *           example: "09123456789"
 *           description: Iranian mobile phone number (11 digits starting with 09)
 *
 *     LoginPasswordRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - password
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^09\d{9}$'
 *           example: "09123456789"
 *         password:
 *           type: string
 *           format: password
 *           example: "Password123"
 *
 *     LoginOtpRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^09\d{9}$'
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "12345"
 *           description: OTP code sent via SMS
 *
 *     ResendCodeRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^09\d{9}$'
 *           example: "09123456789"
 *
 *     ForgetPasswordRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *         - newPassword
 *       properties:
 *         phoneNumber:
 *           type: string
 *           pattern: '^09\d{9}$'
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "12345"
 *         newPassword:
 *           type: string
 *           format: password
 *           example: "StrongPass123"
 *           description: At least 8 characters with uppercase, lowercase, and number
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "code sent successfully"
 *         data:
 *           type: object
 *           properties:
 *             userExist:
 *               type: boolean
 *               example: true
 *             passwordExist:
 *               type: boolean
 *               example: false
 *
 *     LoginSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login successful"
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64b0f1a92e10a8c2d8e4b789"
 *                 phoneNumber:
 *                   type: string
 *                   example: "09123456789"
 *                 role:
 *                   type: string
 *                   example: "user"
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "phone number is required"
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Initial authentication check and OTP dispatch
 *     description: Checks if the user exists and has a password. If new or without password, sends an OTP code via SMS.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: Authentication status returned and OTP sent if needed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: SMS service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/login-password:
 *   post:
 *     summary: Login with phone number and password
 *     description: Authenticates existing user using their password and returns a JWT token.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginPasswordRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponse'
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/login-otp:
 *   post:
 *     summary: Login or Register with OTP code
 *     description: Verifies OTP code sent to the phone number. Creates user and cart if they do not exist.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginOtpRequest'
 *     responses:
 *       200:
 *         description: Login / registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponse'
 *       400:
 *         description: Incorrect OTP code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: Resend OTP code
 *     description: Resends OTP authentication code to user's phone number.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendCodeRequest'
 *     responses:
 *       200:
 *         description: OTP code resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "code sent successfully"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: SMS service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Reset password with OTP
 *     description: Verifies OTP code and sets a new password for the user.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "password changed successfully"
 *       400:
 *         description: Incorrect OTP code or invalid new password format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
