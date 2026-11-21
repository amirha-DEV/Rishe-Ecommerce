/**
 * @swagger
 * tags:
 *   name: BlogComments
 *   description: Blog comment management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogComment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "671a12345678901234567890"
 *         blogId:
 *           type: string
 *           example: "671a12345678901234567891"
 *         userId:
 *           type: string
 *           example: "671a12345678901234567892"
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 2000
 *           example: "This article provides valuable information."
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
 *     CreateBlogComment:
 *       type: object
 *       required:
 *         - blogId
 *         - content
 *       properties:
 *         blogId:
 *           type: string
 *           example: "671a12345678901234567891"
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 2000
 *           example: "This article provides valuable information."
 *
 *     CreateBlogReply:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 3
 *           maxLength: 2000
 *           example: "Thank you for sharing your thoughts."
 *
 *     BlogCommentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Comment created successfully"
 *         data:
 *           $ref: '#/components/schemas/BlogComment'
 *
 *     BlogCommentMessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Comment deleted successfully"
 *
 *     BlogCommentError:
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
 * /api/blog-comments:
 *   get:
 *     summary: Get all blog comments
 *     description: Retrieve all main blog comments. This endpoint is accessible only to administrators.
 *     tags: [BlogComments]
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
 *         description: Blog comments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   post:
 *     summary: Create a blog comment
 *     description: Authenticated users can submit comments on published blogs. Comments require administrator approval before becoming public.
 *     tags: [BlogComments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogComment'
 *     responses:
 *       201:
 *         description: Blog comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCommentResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Comments are not allowed for unpublished blogs
 *       404:
 *         description: User or blog not found
 */

/**
 * @swagger
 * /api/blog-comments/blog/{id}:
 *   get:
 *     summary: Get comments of a blog
 *     description: The id parameter is the blog ID. Public users can only see approved main comments.
 *     tags: [BlogComments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
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
 *         description: Blog comments retrieved successfully
 *       400:
 *         description: Invalid blog ID
 */

/**
 * @swagger
 * /api/blog-comments/{id}:
 *   post:
 *     summary: Reply to a blog comment
 *     description: Authenticated users can reply to main comments. Replies to other replies are not allowed. Replies from regular users require administrator approval.
 *     tags: [BlogComments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Main blog comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogReply'
 *     responses:
 *       201:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCommentResponse'
 *       400:
 *         description: Cannot reply to another reply
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog comment not found
 *
 *   patch:
 *     summary: Toggle blog comment approval
 *     description: Administrators can change the approval status of a blog comment or reply.
 *     tags: [BlogComments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog comment ID
 *     responses:
 *       200:
 *         description: Blog comment approval status changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCommentResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog comment not found
 *
 *   delete:
 *     summary: Delete a blog comment and its replies
 *     description: Administrators can delete a main comment. Its associated replies are deleted automatically.
 *     tags: [BlogComments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog comment ID
 *     responses:
 *       200:
 *         description: Blog comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCommentMessageResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog comment not found
 */
