/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LocalizedBrandText:
 *       type: object
 *       required:
 *         - fa
 *         - en
 *       properties:
 *         fa:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: برند نمونه
 *         en:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: Sample Brand
 *
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6720ab1234567890abcdef12
 *         name:
 *           $ref: '#/components/schemas/LocalizedBrandText'
 *         slug:
 *           $ref: '#/components/schemas/LocalizedBrandText'
 *         description:
 *           allOf:
 *             - $ref: '#/components/schemas/LocalizedBrandText'
 *           nullable: true
 *         logo:
 *           type: string
 *           example: brands/sample-logo.png
 *         website:
 *           type: string
 *           example: https://example.com
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
 *     BrandInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           $ref: '#/components/schemas/LocalizedBrandText'
 *         slug:
 *           $ref: '#/components/schemas/LocalizedBrandText'
 *         description:
 *           $ref: '#/components/schemas/LocalizedBrandText'
 *         logo:
 *           type: string
 *         website:
 *           type: string
 *           format: uri
 *         isActive:
 *           type: boolean
 *
 *     BrandUpdateInput:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         name:
 *           $ref: '#/components/schemas/LocalizedBrandText'
 *         slug:
 *           $ref: '#/components/schemas/LocalizedBrandText'
 *         description:
 *           $ref: '#/components/schemas/LocalizedBrandText'
 *         logo:
 *           type: string
 *         website:
 *           type: string
 *           format: uri
 *         isActive:
 *           type: boolean
 *
 *     BrandResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Brand'
 *
 *     BrandError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Brand not found
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all visible brands
 *     tags: [Brands]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: search
 *         description: Search brand names in Persian and English
 *         schema:
 *           type: string
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [fa, en]
 *     responses:
 *       200:
 *         description: Brands retrieved successfully
 *
 *   post:
 *     summary: Create a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandInput'
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/brands/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *
 *   get:
 *     summary: Get a brand by ID
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Brand retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandResponse'
 *       404:
 *         description: Brand not found
 *
 *   patch:
 *     summary: Update a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandUpdateInput'
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Brand not found
 *
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       400:
 *         description: Brand is used by a product
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Brand not found
 */
