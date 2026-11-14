/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductLocalizedText:
 *       type: object
 *       required:
 *         - fa
 *         - en
 *       properties:
 *         fa:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: محصول چوبی دست‌ساز
 *         en:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: Handmade Wooden Product
 *
 *     ProductOptionalLocalizedText:
 *       type: object
 *       properties:
 *         fa:
 *           type: string
 *           minLength: 3
 *           maxLength: 5000
 *           example: توضیحات محصول به زبان فارسی
 *         en:
 *           type: string
 *           minLength: 3
 *           maxLength: 5000
 *           example: Product description in English
 *
 *     ProductInformation:
 *       type: object
 *       required:
 *         - key
 *         - value
 *       properties:
 *         key:
 *           $ref: '#/components/schemas/ProductOptionalLocalizedText'
 *         value:
 *           $ref: '#/components/schemas/ProductOptionalLocalizedText'
 *
 *     ProductTags:
 *       type: object
 *       properties:
 *         fa:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - چوبی
 *             - دست‌ساز
 *         en:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - wooden
 *             - handmade
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 673a12bc45de678901234567
 *         brandId:
 *           type: string
 *           example: 673a12bc45de678901234568
 *         categoryIds:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - 673a12bc45de678901234569
 *         title:
 *           $ref: '#/components/schemas/ProductLocalizedText'
 *         description:
 *           $ref: '#/components/schemas/ProductOptionalLocalizedText'
 *         details:
 *           $ref: '#/components/schemas/ProductOptionalLocalizedText'
 *         slug:
 *           type: object
 *           required:
 *             - fa
 *             - en
 *           properties:
 *             fa:
 *               type: string
 *               minLength: 3
 *               maxLength: 180
 *               example: محصول-چوبی
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 180
 *               example: wooden-product
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - products/image1.webp
 *             - products/image2.webp
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - products/video1.mp4
 *         information:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInformation'
 *         tags:
 *           $ref: '#/components/schemas/ProductTags'
 *         ratingCount:
 *           type: integer
 *           minimum: 0
 *           readOnly: true
 *           example: 12
 *         ratingAvg:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           readOnly: true
 *           example: 4.5
 *         boughtCount:
 *           type: integer
 *           minimum: 0
 *           readOnly: true
 *           example: 25
 *         isPublished:
 *           type: boolean
 *           example: true
 *         seoId:
 *           type: string
 *           nullable: true
 *           example: 673a12bc45de678901234570
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductInput:
 *       type: object
 *       required:
 *         - brandId
 *         - categoryIds
 *         - title
 *         - slug
 *       properties:
 *         brandId:
 *           type: string
 *           example: 673a12bc45de678901234568
 *         categoryIds:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: string
 *           example:
 *             - 673a12bc45de678901234569
 *         title:
 *           $ref: '#/components/schemas/ProductLocalizedText'
 *         description:
 *           $ref: '#/components/schemas/ProductOptionalLocalizedText'
 *         details:
 *           $ref: '#/components/schemas/ProductOptionalLocalizedText'
 *         slug:
 *           type: object
 *           required:
 *             - fa
 *             - en
 *           properties:
 *             fa:
 *               type: string
 *               minLength: 3
 *               maxLength: 180
 *               example: محصول-چوبی
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 180
 *               example: wooden-product
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - products/image1.webp
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - products/video1.mp4
 *         information:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInformation'
 *         tags:
 *           $ref: '#/components/schemas/ProductTags'
 *         isPublished:
 *           type: boolean
 *           default: false
 *           example: true
 *         seoId:
 *           type: string
 *           nullable: true
 *           example: 673a12bc45de678901234570
 *
 *     ProductUpdateInput:
 *       type: object
 *       description: All fields are optional. Only provided fields will be updated.
 *       properties:
 *         brandId:
 *           type: string
 *           example: 673a12bc45de678901234568
 *         categoryIds:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: string
 *         title:
 *           type: object
 *           properties:
 *             fa:
 *               type: string
 *               minLength: 3
 *               maxLength: 150
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 150
 *         description:
 *           $ref: '#/components/schemas/ProductOptionalLocalizedText'
 *         details:
 *           $ref: '#/components/schemas/ProductOptionalLocalizedText'
 *         slug:
 *           type: object
 *           properties:
 *             fa:
 *               type: string
 *               minLength: 3
 *               maxLength: 180
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 180
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *         information:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInformation'
 *         tags:
 *           $ref: '#/components/schemas/ProductTags'
 *         isPublished:
 *           type: boolean
 *         seoId:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
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
 *         description: Number of products per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by Persian or English title and description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort products by specific fields
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Select specific product fields
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID or product has sales history and cannot be deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
