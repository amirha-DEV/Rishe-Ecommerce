
/**
 * @swagger
 * tags:
 *   name: Attributes
 *   description: Product attribute management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AttributeValue:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *           example: 672a1b2c3d4e5f6789012345
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
 *               example: کوچک
 *             en:
 *               type: string
 *               example: small
 *         isActive:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *     Attribute:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 672a1b2c3d4e5f6789012345
 *         name:
 *           $ref: '#/components/schemas/LocalizedText'
 *         slug:
 *           type: object
 *           properties:
 *             fa:
 *               type: string
 *               example: اندازه
 *             en:
 *               type: string
 *               example: size
 *         type:
 *           type: string
 *           enum: [select, text, number]
 *           example: select
 *         isVariant:
 *           type: boolean
 *           example: true
 *         unit:
 *           type: string
 *           example: cm
 *         values:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributeValue'
 *         isActive:
 *           type: boolean
 *           example: true
 *         displayOrder:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AttributeInput:
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
 *               example: اندازه
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 100
 *               example: size
 *         type:
 *           type: string
 *           enum: [select, text, number]
 *           default: select
 *           example: select
 *         isVariant:
 *           type: boolean
 *           default: false
 *           example: true
 *         unit:
 *           type: string
 *           example: cm
 *         values:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributeValue'
 *         isActive:
 *           type: boolean
 *           default: true
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *
 *     AttributeUpdate:
 *       type: object
 *       minProperties: 1
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
 *             en:
 *               type: string
 *               minLength: 3
 *               maxLength: 100
 *         type:
 *           type: string
 *           enum: [select, text, number]
 *         isVariant:
 *           type: boolean
 *         unit:
 *           type: string
 *         values:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttributeValue'
 *         isActive:
 *           type: boolean
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 */

/**
 * @swagger
 * /api/attributes:
 *   get:
 *     summary: Get all attributes
 *     description: Returns active attributes for regular users and all attributes for administrators.
 *     tags: [Attributes]
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
 *         description: Number of attributes per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting fields
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include in response
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by Persian/English name or slug
 *     responses:
 *       200:
 *         description: Attributes retrieved successfully
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new attribute
 *     tags: [Attributes]
 *     description: Only administrators can create attributes.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttributeInput'
 *           examples:
 *             selectAttribute:
 *               summary: Select attribute
 *               value:
 *                 name:
 *                   fa: اندازه
 *                   en: Size
 *                 slug:
 *                   fa: size
 *                   en: size
 *                 type: select
 *                 isVariant: true
 *                 values:
 *                   - name:
 *                       fa: کوچک
 *                       en: Small
 *                     slug:
 *                       fa: small
 *                       en: small
 *                   - name:
 *                       fa: بزرگ
 *                       en: Large
 *                     slug:
 *                       fa: large
 *                       en: large
 *             numberAttribute:
 *               summary: Number attribute
 *               value:
 *                 name:
 *                   fa: وزن
 *                   en: Weight
 *                 slug:
 *                   fa: weight
 *                   en: weight
 *                 type: number
 *                 unit: g
 *                 isVariant: false
 *     responses:
 *       201:
 *         description: Attribute created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Administrator access required
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /api/attributes/{id}:
 *   get:
 *     summary: Get an attribute by ID
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Attribute ID
 *     responses:
 *       200:
 *         description: Attribute retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Attribute'
 *       404:
 *         description: Attribute not found
 *       422:
 *         description: Invalid attribute ID
 *
 *   patch:
 *     summary: Update an attribute
 *     tags: [Attributes]
 *     description: Only administrators can update attributes. Send only the fields that need to change. When changing the type, values, isVariant, or unit, the final document must satisfy the model validation rules.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttributeUpdate'
 *     responses:
 *       200:
 *         description: Attribute updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Administrator access required
 *       404:
 *         description: Attribute not found
 *       422:
 *         description: Validation error
 *
 *   delete:
 *     summary: Delete an attribute
 *     tags: [Attributes]
 *     description: Only administrators can delete attributes.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Attribute deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Administrator access required
 *       404:
 *         description: Attribute not found
 */
