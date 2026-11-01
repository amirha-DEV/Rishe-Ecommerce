/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "671a12345678901234567890"
 *         productId:
 *           type: string
 *           example: "671a12345678901234567891"
 *         userId:
 *           type: string
 *           example: "671a12345678901234567892"
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 *         isBought:
 *           type: boolean
 *           example: true
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           nullable: true
 *           example: 5
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 2000
 *           example: "This product has excellent quality."
 *         isApproved:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateComment:
 *       type: object
 *       required:
 *         - productId
 *         - content
 *       properties:
 *         productId:
 *           type: string
 *           example: "671a12345678901234567891"
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 2000
 *           example: "This product has excellent quality."
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *
 *     CreateReply:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 2000
 *           example: "Thank you for sharing your experience."
 *
 *     CommentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Comment created successfully"
 *         data:
 *           $ref: '#/components/schemas/Comment'
 *
 *     CommentMessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Comment deleted successfully"
 *
 *     CommentError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Comment not found"
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-createdAt"
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   post:
 *     summary: Create a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComment'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       400:
 *         description: Validation error or invalid rating
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not eligible to rate this product
 *       404:
 *         description: User or product not found
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get main comments of a product
 *     description: The id parameter is the product ID. Only approved comments are returned to regular users.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product comments retrieved successfully
 *       400:
 *         description: Invalid product ID
 *
 *   post:
 *     summary: Reply to a comment
 *     description: The id parameter is the ID of the main comment, not the product ID.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Main comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReply'
 *     responses:
 *       201:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       400:
 *         description: Cannot reply to another reply
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *
 *   patch:
 *     summary: Toggle comment approval
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment approval status changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 *
 *   delete:
 *     summary: Delete a comment and its replies
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentMessageResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */
