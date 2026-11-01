/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Global search for products, categories and brands
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             brands:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Brand documents matching the search
 *             categories:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Category documents matching the search
 *             products:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Product documents matching the search
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search across products, categories and brands
 *     description: Searches products, categories and brands using one search query. Public users only receive published products and active categories and brands. Admin users can access all records.
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         required: false
 *         description: Search term
 *         example: phone
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of results per model
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting field and order supported by ApiFeatures
 *         example: "-createdAt"
 *
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *
 *       400:
 *         description: Invalid query parameters
 *
 *       404:
 *         description: No search results found
 */
