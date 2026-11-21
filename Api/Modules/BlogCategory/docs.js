
/**
 * @swagger
 * tags:
 *   name: BlogCategories
 *   description: Blog category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LocalizedName:
 *       type: object
 *       required:
 *         - fa
 *         - en
 *       properties:
 *         fa:
 *           type: string
 *           example: "هنرهای چوبی"
 *         en:
 *           type: string
 *           example: "Wooden Arts"
 *
 *     LocalizedSlug:
 *       type: object
 *       required:
 *         - fa
 *         - en
 *       properties:
 *         fa:
 *           type: string
 *           example: "هنرهای-چوبی"
 *         en:
 *           type: string
 *           example: "wooden-arts"
 *
 *     LocalizedDescription:
 *       type: object
 *       properties:
 *         fa:
 *           type: string
 *           example: "آشنایی با هنر ساخت محصولات چوبی دست‌ساز و روش‌های نگهداری از آن‌ها."
 *         en:
 *           type: string
 *           example: "Learn about handmade wooden crafts and how to care for them."
 *
 *     BlogCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "674abc123456789012345678"
 *         name:
 *           $ref: '#/components/schemas/LocalizedName'
 *         slug:
 *           $ref: '#/components/schemas/LocalizedSlug'
 *         description:
 *           $ref: '#/components/schemas/LocalizedDescription'
 *         image:
 *           type: string
 *           example: "https://example.com/images/wooden-arts.jpg"
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 *         isActive:
 *           type: boolean
 *           example: true
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     BlogCategoryInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           $ref: '#/components/schemas/LocalizedName'
 *         slug:
 *           $ref: '#/components/schemas/LocalizedSlug'
 *         description:
 *           $ref: '#/components/schemas/LocalizedDescription'
 *         image:
 *           type: string
 *           example: "https://example.com/images/wooden-arts.jpg"
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 1
 *
 *     BlogCategoryUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           $ref: '#/components/schemas/LocalizedName'
 *         slug:
 *           $ref: '#/components/schemas/LocalizedSlug'
 *         description:
 *           $ref: '#/components/schemas/LocalizedDescription'
 *         image:
 *           type: string
 *           example: "https://example.com/images/wooden-arts.jpg"
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 *         isActive:
 *           type: boolean
 *           example: true
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *           example: 2
 *
 *     BlogCategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Category retrieved successfully."
 *         data:
 *           $ref: '#/components/schemas/BlogCategory'
 *
 *     BlogCategoriesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Categories retrieved successfully."
 *         results:
 *           type: integer
 *           example: 3
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogCategory'
 */

/**
 * @swagger
 * /api/blog-categories:
 *   get:
 *     summary: Get all blog categories
 *     tags: [BlogCategories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter categories by active status
 *       - in: query
 *         name: parentId
 *         required: false
 *         schema:
 *           type: string
 *         description: Parent category ID or "null" for root categories
 *     responses:
 *       200:
 *         description: Blog categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategoriesResponse'
 *       400:
 *         description: Invalid query parameters
 *
 *   post:
 *     summary: Create a new blog category
 *     tags: [BlogCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogCategoryInput'
 *     responses:
 *       201:
 *         description: Blog category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategoryResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Parent category not found
 *       409:
 *         description: Duplicate category slug
 *
 * /api/blog-categories/{id}:
 *   get:
 *     summary: Get a blog category by ID
 *     tags: [BlogCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog category ID
 *     responses:
 *       200:
 *         description: Blog category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategoryResponse'
 *       400:
 *         description: Invalid category ID
 *       404:
 *         description: Blog category not found
 *
 *   patch:
 *     summary: Update a blog category
 *     tags: [BlogCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogCategoryUpdateInput'
 *     responses:
 *       200:
 *         description: Blog category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategoryResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog category or parent category not found
 *       409:
 *         description: Duplicate category slug
 *
 *   delete:
 *     summary: Delete a blog category
 *     tags: [BlogCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog category ID
 *     responses:
 *       200:
 *         description: Blog category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategoryResponse'
 *       400:
 *         description: Invalid category ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog category not found
 *       409:
 *         description: Cannot delete a category with children or related blogs
 */
