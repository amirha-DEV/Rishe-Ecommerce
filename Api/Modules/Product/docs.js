
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
 *     LocalizedTitle:
 *       type: object
 *       required:
 *         - fa
 *         - en
 *       properties:
 *         fa:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: "تابلو چوبی شعر"
 *         en:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: "Wooden Poetry Plaque"
 *
 *     LocalizedText:
 *       type: object
 *       properties:
 *         fa:
 *           type: string
 *           minLength: 3
 *           maxLength: 5000
 *           example: "تابلوی چوبی دست‌ساز با شعر فارسی"
 *         en:
 *           type: string
 *           minLength: 3
 *           maxLength: 5000
 *           example: "Handmade wooden plaque with Persian poetry"
 *
 *     ProductInformation:
 *       type: object
 *       required:
 *         - key
 *         - value
 *       properties:
 *         key:
 *           $ref: '#/components/schemas/LocalizedText'
 *         value:
 *           $ref: '#/components/schemas/LocalizedText'
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
 *             - دکوراتیو
 *         en:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - wooden
 *             - decorative
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
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: "671234567890123456789012"
 *           description: MongoDB ID of the product brand
 *         categoryIds:
 *           type: array
 *           minItems: 1
 *           uniqueItems: true
 *           items:
 *             type: string
 *             pattern: '^[0-9a-fA-F]{24}$'
 *           example:
 *             - "671234567890123456789013"
 *             - "671234567890123456789014"
 *         title:
 *           $ref: '#/components/schemas/LocalizedTitle'
 *         description:
 *           $ref: '#/components/schemas/LocalizedText'
 *         details:
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
 *               maxLength: 180
 *               example: "تابلو-شعر-چوبی"
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 180
 *               example: "wooden-poetry-plaque"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "uploads/products/product-1.jpg"
 *             - "uploads/products/product-2.jpg"
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "uploads/products/product-video.mp4"
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
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: "671234567890123456789015"
 *
 *     Product:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               readOnly: true
 *               example: "671234567890123456789016"
 *             ratingCount:
 *               type: integer
 *               minimum: 0
 *               readOnly: true
 *               example: 12
 *             ratingAvg:
 *               type: number
 *               minimum: 0
 *               maximum: 5
 *               readOnly: true
 *               example: 4.5
 *             boughtCount:
 *               type: integer
 *               minimum: 0
 *               readOnly: true
 *               example: 8
 *             createdAt:
 *               type: string
 *               format: date-time
 *               readOnly: true
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               readOnly: true
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Product retrieved successfully"
 *         data:
 *           $ref: '#/components/schemas/Product'
 *
 *     ProductListResponse:
 *       type: object
 *       description: Product list response returned by ApiFeatures. Exact pagination fields depend on the ApiFeatures implementation.
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *
 *     ProductMessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Product created successfully"
 *         data:
 *           $ref: '#/components/schemas/Product'
 *
 *     ProductDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Product deleted successfully"
 *
 *     ProductErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Product not found"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Returns published products for regular users and all products for admin and superAdmin roles. Supports filtering, searching, sorting, field selection and pagination through ApiFeatures.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number supported by ApiFeatures
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of products per page, if supported by ApiFeatures
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in Persian and English product titles and descriptions
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting expression supported by ApiFeatures
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [fa, en]
 *         description: Preferred language for error and success messages
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a product
 *     description: Creates a new product. Requires admin or superAdmin access.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductMessageResponse'
 *       400:
 *         description: Invalid product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Returns a published product for regular users. Admin and superAdmin roles can also retrieve unpublished products.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ID of the product
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [fa, en]
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       422:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update a product
 *     description: Updates an existing product. Only the provided fields need to be sent. Requires admin or superAdmin access.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *               categoryIds:
 *                 type: array
 *                 minItems: 1
 *                 uniqueItems: true
 *                 items:
 *                   type: string
 *                   pattern: '^[0-9a-fA-F]{24}$'
 *               title:
 *                 $ref: '#/components/schemas/LocalizedTitle'
 *               description:
 *                 $ref: '#/components/schemas/LocalizedText'
 *               details:
 *                 $ref: '#/components/schemas/LocalizedText'
 *               slug:
 *                 type: object
 *                 properties:
 *                   fa:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 180
 *                   en:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 180
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *               information:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductInformation'
 *               tags:
 *                 $ref: '#/components/schemas/ProductTags'
 *               isPublished:
 *                 type: boolean
 *               seoId:
 *                 type: string
 *                 nullable: true
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductMessageResponse'
 *       400:
 *         description: Invalid product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product and its media files if it exists and has no sales history. Requires admin or superAdmin access.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ID of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDeleteResponse'
 *       400:
 *         description: Product has sales history and cannot be deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductErrorResponse'
 *       500:
 *         description: Internal server error
 */
