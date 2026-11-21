/**
 * @swagger
 * tags:
 *   name: ProductVariants
 *   description: Product variant management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VariantAttribute:
 *       type: object
 *       required:
 *         - attributeId
 *         - valueId
 *       properties:
 *         attributeId:
 *           type: string
 *           description: Attribute ID
 *           example: "674abc123456789012345678"
 *         valueId:
 *           type: string
 *           description: Selected value ID
 *           example: "674abc123456789012345679"
 *
 *     VariantDetail:
 *       type: object
 *       required:
 *         - attributeId
 *         - value
 *       properties:
 *         attributeId:
 *           type: string
 *           description: Attribute ID
 *           example: "674abc123456789012345680"
 *         value:
 *           oneOf:
 *             - type: string
 *             - type: number
 *           description: Attribute value
 *           example: 600
 *
 *     ProductVariant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "674abc123456789012345681"
 *         productId:
 *           type: string
 *           example: "674abc123456789012345678"
 *         attributes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantAttribute'
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantDetail'
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 250000
 *         stock:
 *           type: integer
 *           minimum: 0
 *           example: 10
 *         isMadeToOrder:
 *           type: boolean
 *           example: false
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
 *     ProductVariantInput:
 *       type: object
 *       required:
 *         - productId
 *         - price
 *       properties:
 *         productId:
 *           type: string
 *           example: "674abc123456789012345678"
 *         attributes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantAttribute'
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantDetail'
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 250000
 *         stock:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 10
 *         isMadeToOrder:
 *           type: boolean
 *           default: false
 *         isActive:
 *           type: boolean
 *           default: true
 *
 *     ProductVariantUpdateInput:
 *       type: object
 *       properties:
 *         attributes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantAttribute'
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantDetail'
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 300000
 *         stock:
 *           type: integer
 *           minimum: 0
 *           example: 15
 *         isMadeToOrder:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *
 *     ProductVariantResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Product variant retrieved successfully.
 *         data:
 *           $ref: '#/components/schemas/ProductVariant'
 *
 *     ProductVariantsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Product variants retrieved successfully.
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 */

/**
 * @swagger
 * /api/product-variants:
 *   get:
 *     summary: Get all variants of a product
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product variants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantsResponse'
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *
 *   post:
 *     summary: Create a new product variant
 *     tags: [ProductVariants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariantInput'
 *     responses:
 *       201:
 *         description: Product variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantResponse'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 *       409:
 *         description: Duplicate variant combination
 *
 * /api/product-variants/{id}:
 *   get:
 *     summary: Get a product variant by ID
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Product variant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantResponse'
 *       400:
 *         description: Invalid variant ID
 *       404:
 *         description: Product variant not found
 *
 *   patch:
 *     summary: Update a product variant
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariantUpdateInput'
 *     responses:
 *       200:
 *         description: Product variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantResponse'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product variant or related product not found
 *       409:
 *         description: Duplicate variant combination
 *
 *   delete:
 *     summary: Deactivate a product variant
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Product variant deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantResponse'
 *       400:
 *         description: Invalid ID or variant already deactivated
 *       404:
 *         description: Product variant not found
 */
