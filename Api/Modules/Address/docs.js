/**
 * @swagger
 * tags:
 *   name: Address
 *   description: User address management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LocalizedAddressTitle:
 *       type: object
 *       required:
 *         - fa
 *         - en
 *       properties:
 *         fa:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: خانه
 *         en:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: Home
 *
 *     LocalizedAddressDescription:
 *       type: object
 *       properties:
 *         fa:
 *           type: string
 *           minLength: 3
 *           maxLength: 5000
 *           example: خیابان ولیعصر، کوچه اول
 *         en:
 *           type: string
 *           minLength: 3
 *           maxLength: 5000
 *           example: Valiasr Street, First Alley
 *
 *     Address:
 *       type: object
 *       required:
 *         - title
 *         - city
 *         - province
 *         - postalCode
 *         - receiverFullName
 *         - receiverPhoneNumber
 *         - lat
 *         - lng
 *       properties:
 *         _id:
 *           type: string
 *           example: 671a12345678901234567890
 *         title:
 *           $ref: '#/components/schemas/LocalizedAddressTitle'
 *         description:
 *           $ref: '#/components/schemas/LocalizedAddressDescription'
 *         city:
 *           type: string
 *           example: Tehran
 *         province:
 *           type: string
 *           example: Tehran
 *         postalCode:
 *           type: string
 *           example: "1234567890"
 *         userId:
 *           type: string
 *           example: 671a12345678901234567890
 *         receiverFullName:
 *           type: string
 *           example: Ali Ahmadi
 *         receiverPhoneNumber:
 *           type: string
 *           example: "09123456789"
 *         isDefault:
 *           type: boolean
 *           example: true
 *         lat:
 *           type: number
 *           example: 35.6892
 *         lng:
 *           type: number
 *           example: 51.3890
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateAddress:
 *       type: object
 *       required:
 *         - title
 *         - city
 *         - province
 *         - postalCode
 *         - receiverFullName
 *         - receiverPhoneNumber
 *         - lat
 *         - lng
 *       properties:
 *         title:
 *           $ref: '#/components/schemas/LocalizedAddressTitle'
 *         description:
 *           $ref: '#/components/schemas/LocalizedAddressDescription'
 *         city:
 *           type: string
 *           example: Tehran
 *         province:
 *           type: string
 *           example: Tehran
 *         postalCode:
 *           type: string
 *           example: "1234567890"
 *         receiverFullName:
 *           type: string
 *           example: Ali Ahmadi
 *         receiverPhoneNumber:
 *           type: string
 *           example: "09123456789"
 *         isDefault:
 *           type: boolean
 *           default: false
 *         lat:
 *           type: number
 *           example: 35.6892
 *         lng:
 *           type: number
 *           example: 51.3890
 *
 *     UpdateAddress:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         title:
 *           $ref: '#/components/schemas/LocalizedAddressTitle'
 *         description:
 *           $ref: '#/components/schemas/LocalizedAddressDescription'
 *         city:
 *           type: string
 *           example: Tehran
 *         province:
 *           type: string
 *           example: Tehran
 *         postalCode:
 *           type: string
 *           example: "1234567890"
 *         receiverFullName:
 *           type: string
 *           example: Ali Ahmadi
 *         receiverPhoneNumber:
 *           type: string
 *           example: "09123456789"
 *         isDefault:
 *           type: boolean
 *         lat:
 *           type: number
 *           example: 35.6892
 *         lng:
 *           type: number
 *           example: 51.3890
 *
 *     AddressResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Address'
 */

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all addresses
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by Persian or English address title
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
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Create a new address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAddress'
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/addresses/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *
 *   get:
 *     summary: Get one address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *
 *   patch:
 *     summary: Update an address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAddress'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Address not found
 *
 *   delete:
 *     summary: Delete an address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Address not found
 */
