/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Discount management and validation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Discount:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "671a12345678901234567890"
 *         code:
 *           type: string
 *           example: "SUMMER20"
 *         type:
 *           type: string
 *           enum: [fixed, percentage]
 *           example: percentage
 *         value:
 *           type: number
 *           example: 20
 *         minPrice:
 *           type: number
 *           nullable: true
 *           example: 500000
 *         maxPrice:
 *           type: number
 *           nullable: true
 *           example: 5000000
 *         startAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         expireAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         usageLimit:
 *           type: integer
 *           nullable: true
 *           example: 100
 *         userUsedLimit:
 *           type: integer
 *           example: 1
 *         usedCount:
 *           type: integer
 *           example: 10
 *         userUsage:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               usedCount:
 *                 type: integer
 *         isActive:
 *           type: boolean
 *           example: true
 *         freeShipping:
 *           type: boolean
 *           example: false
 *
 *     CreateDiscount:
 *       type: object
 *       required:
 *         - code
 *         - type
 *         - value
 *       properties:
 *         code:
 *           type: string
 *           example: "SUMMER20"
 *         type:
 *           type: string
 *           enum: [fixed, percentage]
 *           example: percentage
 *         value:
 *           type: number
 *           example: 20
 *         minPrice:
 *           type: number
 *           nullable: true
 *           example: 500000
 *         maxPrice:
 *           type: number
 *           nullable: true
 *           example: 5000000
 *         startAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-11-01T00:00:00.000Z"
 *         expireAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-12-01T00:00:00.000Z"
 *         usageLimit:
 *           type: integer
 *           nullable: true
 *           example: 100
 *         userUsedLimit:
 *           type: integer
 *           example: 1
 *         isActive:
 *           type: boolean
 *           example: true
 *         freeShipping:
 *           type: boolean
 *           example: false
 *
 *     UpdateDiscount:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "WINTER30"
 *         type:
 *           type: string
 *           enum: [fixed, percentage]
 *         value:
 *           type: number
 *           example: 30
 *         minPrice:
 *           type: number
 *           nullable: true
 *         maxPrice:
 *           type: number
 *           nullable: true
 *         startAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         expireAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         usageLimit:
 *           type: integer
 *           nullable: true
 *         userUsedLimit:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         freeShipping:
 *           type: boolean
 *
 *     CheckDiscountCode:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: "SUMMER20"
 *
 *     DiscountResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Discount'
 *
 *     CheckDiscountResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             finalPriceAfterDiscount:
 *               type: number
 *               example: 800000
 *         message:
 *           type: string
 *           example: "Discount is valid"
 */

/**
 * @swagger
 * /api/discounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Search by discount code
 *     responses:
 *       200:
 *         description: Discounts retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   post:
 *     summary: Create a discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDiscount'
 *     responses:
 *       201:
 *         description: Discount created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountResponse'
 *       400:
 *         description: Validation error or duplicate discount code
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/discounts/{id}:
 *   get:
 *     summary: Get one discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Discount MongoDB ID
 *     responses:
 *       200:
 *         description: Discount retrieved successfully
 *       404:
 *         description: Discount not found
 *
 *   patch:
 *     summary: Update a discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDiscount'
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Discount not found
 *
 *   delete:
 *     summary: Delete a discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       400:
 *         description: Discount has already been used
 *       404:
 *         description: Discount not found
 */

/**
 * @swagger
 * /api/discounts/check-code:
 *   post:
 *     summary: Validate a discount code for the logged-in user's cart
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckDiscountCode'
 *     responses:
 *       200:
 *         description: Discount code is valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckDiscountResponse'
 *       400:
 *         description: Discount code is invalid
 *       401:
 *         description: Login required
 *       404:
 *         description: Cart or discount not found
 */
