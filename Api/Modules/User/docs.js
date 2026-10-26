/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and account security
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "671a12bc34de56f789012345"
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "John Doe"
 *         phoneNumber:
 *           type: string
 *           pattern: '^09\d{9}$'
 *           example: "09123456789"
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 *           example: user
 *         birthDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2000-05-15T00:00:00.000Z"
 *         boughtProductIds:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 *         favoriteProductIds:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 *         ratedProductIds:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 *         cartId:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UpdateUser:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "John Doe"
 *         birthDate:
 *           type: string
 *           format: date-time
 *           example: "2000-05-15T00:00:00.000Z"
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 *           example: admin
 *
 *     ChangePassword:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           example: "OldPass123"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$'
 *           example: "NewPass123"
 *
 *     UserSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "user updated successfully"
 *         data:
 *           $ref: '#/components/schemas/User'
 *
 *     UserErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "User not found"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve users with filtering, searching, sorting, and pagination.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by fullName or phoneNumber.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of users per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria supported by ApiFeatures.
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *
 * /api/users/change-password:
 *   patch:
 *     summary: Change user password
 *     description: Change the password of the currently authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid password or old password.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: User not found.
 *
 * /api/users/{id}:
 *   get:
 *     summary: Get one user
 *     description: Retrieve a user. Access must be restricted according to the authenticated user's role and permissions.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB user ID.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       400:
 *         description: Invalid user ID.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: User not found.
 *
 *   patch:
 *     summary: Update user
 *     description: Update user information. Only a superAdmin should be allowed to change roles.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSuccessResponse'
 *       400:
 *         description: Invalid user ID or input.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Insufficient permissions.
 *       404:
 *         description: User not found.
 *
 *   delete:
 *     summary: Activate or deactivate user
 *     description: Toggle the isActive status of a user. Requires admin access.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB user ID.
 *     responses:
 *       200:
 *         description: User status changed successfully.
 *       400:
 *         description: Invalid user ID.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: User not found.
 */
