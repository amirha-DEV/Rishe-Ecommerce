/**
 * @swagger
 * tags:
 *   name: Slider
 *   description: Slider management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LocalizedSliderTitle:
 *       type: object
 *       required:
 *         - fa
 *         - en
 *       properties:
 *         fa:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: تخفیف ویژه تابستان
 *         en:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: Summer Special Offer
 *
 *     Slider:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 671a12345678901234567890
 *         title:
 *           $ref: '#/components/schemas/LocalizedSliderTitle'
 *         image:
 *           type: string
 *           example: sliders/slider-1.jpg
 *         href:
 *           type: string
 *           example: /products
 *         path:
 *           type: string
 *           example: sliders/slider-1.jpg
 *         isPublished:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateSlider:
 *       type: object
 *       required:
 *         - title
 *         - image
 *         - path
 *       properties:
 *         title:
 *           $ref: '#/components/schemas/LocalizedSliderTitle'
 *         image:
 *           type: string
 *           example: sliders/slider-1.jpg
 *         href:
 *           type: string
 *           example: /products
 *         path:
 *           type: string
 *           example: sliders/slider-1.jpg
 *         isPublished:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *     UpdateSlider:
 *       type: object
 *       properties:
 *         title:
 *           $ref: '#/components/schemas/LocalizedSliderTitle'
 *         image:
 *           type: string
 *           example: sliders/slider-2.jpg
 *         href:
 *           type: string
 *           example: /categories
 *         path:
 *           type: string
 *           example: sliders/slider-2.jpg
 *         isPublished:
 *           type: boolean
 *           example: false
 *
 *     SliderResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Slider created successfully
 *         data:
 *           $ref: '#/components/schemas/Slider'
 *
 *     SliderListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           example: 2
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Slider'
 *
 *   parameters:
 *     SliderId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *       description: Slider MongoDB ID
 */

/**
 * @swagger
 * /api/sliders:
 *   get:
 *     summary: Get all sliders
 *     tags: [Slider]
 *     description: Admins can see all sliders. Public users can only see published sliders.
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in Persian and English titles
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -createdAt
 *     responses:
 *       200:
 *         description: Sliders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderListResponse'
 *
 *   post:
 *     summary: Create a slider
 *     tags: [Slider]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSlider'
 *     responses:
 *       201:
 *         description: Slider created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/sliders/{id}:
 *   get:
 *     summary: Get a single slider
 *     tags: [Slider]
 *     parameters:
 *       - $ref: '#/components/parameters/SliderId'
 *     responses:
 *       200:
 *         description: Slider retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderResponse'
 *       404:
 *         description: Slider not found
 *
 *   patch:
 *     summary: Update a slider
 *     tags: [Slider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SliderId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSlider'
 *     responses:
 *       200:
 *         description: Slider updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SliderResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Slider not found
 *
 *   delete:
 *     summary: Delete a slider
 *     tags: [Slider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SliderId'
 *     responses:
 *       200:
 *         description: Slider deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Slider not found
 */
