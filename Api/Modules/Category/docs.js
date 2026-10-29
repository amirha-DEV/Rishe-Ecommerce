/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LocalizedText:
 *       type: object
 *       required:
 *         - fa
 *         - en
 *       properties:
 *         fa:
 *           type: string
 *           maxLength: 100
 *           example: پوشاک
 *         en:
 *           type: string
 *           maxLength: 100
 *           example: Clothing
 *
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 671a1234567890abcdef1234
 *         name:
 *           $ref: '#/components/schemas/LocalizedText'
 *         slug:
 *           type: object
 *           required:
 *             - fa
 *             - en
 *           properties:
 *             fa:
 *               type: string
 *               minLength: 3
 *               maxLength: 100
 *               example: پوشاک
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 100
 *               example: clothing
 *         description:
 *           allOf:
 *             - $ref: '#/components/schemas/LocalizedText'
 *           nullable: true
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 *         image:
 *           type: string
 *           example: categories/clothing.webp
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *           example: 1
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
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           $ref: '#/components/schemas/LocalizedText'
 *         slug:
 *           type: object
 *           required:
 *             - fa
 *             - en
 *           properties:
 *             fa:
 *               type: string
 *               minLength: 3
 *               maxLength: 100
 *               example: پوشاک
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 100
 *               example: clothing
 *         description:
 *           $ref: '#/components/schemas/LocalizedText'
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 *         image:
 *           type: string
 *           example: categories/clothing.webp
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *         isActive:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of categories per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting fields
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search category names and descriptions
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 *
 *   patch:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 $ref: '#/components/schemas/LocalizedText'
 *               slug:
 *                 type: object
 *                 properties:
 *                   fa:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 100
 *                   en:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 100
 *               description:
 *                 $ref: '#/components/schemas/LocalizedText'
 *               parentId:
 *                 type: string
 *                 nullable: true
 *               image:
 *                 type: string
 *               displayOrder:
 *                 type: integer
 *                 minimum: 0
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category is used by a product or has child categories
 */
