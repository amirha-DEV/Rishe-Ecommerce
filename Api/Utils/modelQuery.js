import { query } from "express-validator";
import { securityConfig } from "../security-config.js";

/**
 * Validates query filtering parameters against a Mongoose Model's schema.
 * Supports:
 *   - Direct field matching: field=value (e.g. role=admin)
 *   - Bracketed operator queries: field[operator]=value (e.g. price[gt]=10, birthDate[gte]=2020-01-01)
 *   - Nested object queries: field: { operator: value }
 *   - Allowed operators from securityConfig (eq, ne, gt, gte, lt, lte, in, nin, regex, exists, size, etc.)
 *   - Forbidden fields from securityConfig (e.g. password)
 *   - Type checking for Number, Date, Boolean, ObjectId, and Enum fields
 *
 * @param {import('mongoose').Model} Model - Mongoose Model to validate against
 * @returns {import('express-validator').ValidationChain}
 */
export const modelQuery = (Model) => {
  return query().custom((_, { req }) => {
    // Reserved query parameters handled by ApiFeatures
    const reservedKeys = new Set([
      "page",
      "limit",
      "sort",
      "fields",
      "populate",
      "q",
    ]);

    // Forbidden fields that cannot be filtered
    const forbiddenFields = new Set(
      securityConfig?.forbiddenFields || ["password"]
    );

    // Allowed operators from securityConfig
    const allowedOperators = new Set(
      securityConfig?.allowedOperators || [
        "eq",
        "ne",
        "gt",
        "gte",
        "lt",
        "lte",
        "in",
        "nin",
        "regex",
        "exists",
        "size",
        "or",
        "and",
      ]
    );

    const errors = [];

    const validateFilter = (field, operator, val) => {
      // 1. Check forbidden fields
      if (forbiddenFields.has(field)) {
        errors.push(`Filtering by forbidden field '${field}' is not allowed`);
        return;
      }

      // 2. Check if field exists on the Model schema
      const schemaPath = Model.schema.path(field);
      const isIdField = field === "_id" || field === "id";

      if (!schemaPath && !isIdField) {
        errors.push(
          `Field '${field}' is not a valid filter field for ${Model.modelName || "model"}`
        );
        return;
      }

      // 3. Check if operator is allowed
      if (operator && !allowedOperators.has(operator)) {
        errors.push(
          `Operator '$${operator}' is not allowed for field '${field}'`
        );
        return;
      }

      // 4. Operator-specific validations
      if (operator === "exists") {
        if (!["true", "false", "1", "0", true, false].includes(val)) {
          errors.push(
            `Value for '${field}[exists]' must be a boolean (true or false)`
          );
        }
        return;
      }

      if (operator === "regex") {
        try {
          new RegExp(val);
        } catch {
          errors.push(`Invalid regular expression pattern for field '${field}'`);
        }
        return;
      }

      // 5. Schema instance type validations
      const instance = schemaPath?.instance || (isIdField ? "ObjectId" : null);
      const isArrayOfObjectId =
        schemaPath?.instance === "Array" &&
        schemaPath?.embeddedSchemaType?.instance === "ObjectId";

      if (instance === "Number") {
        if (["in", "nin"].includes(operator)) {
          const parts = String(val).split(",").map((p) => p.trim());
          if (parts.some((p) => p === "" || isNaN(Number(p)))) {
            errors.push(`Values for '${field}' must be valid numbers`);
          }
        } else if (String(val).trim() === "" || isNaN(Number(val))) {
          errors.push(`Value for '${field}' must be a number`);
        }
      } else if (instance === "Date") {
        if (["in", "nin"].includes(operator)) {
          const parts = String(val).split(",").map((p) => p.trim());
          if (parts.some((p) => isNaN(Date.parse(p)))) {
            errors.push(`Values for '${field}' must be valid dates`);
          }
        } else if (isNaN(Date.parse(val))) {
          errors.push(`Value for '${field}' must be a valid date`);
        }
      } else if (instance === "Boolean") {
        if (!["true", "false", "1", "0", true, false].includes(val)) {
          errors.push(
            `Value for '${field}' must be a boolean (true or false)`
          );
        }
      } else if (instance === "ObjectId" || isArrayOfObjectId || isIdField) {
        const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id).trim());
        if (operator === "size") {
          if (isNaN(Number(val)) || Number(val) < 0) {
            errors.push(
              `Value for '${field}[size]' must be a non-negative integer`
            );
          }
        } else if (["in", "nin"].includes(operator)) {
          const parts = String(val).split(",").map((p) => p.trim());
          if (parts.some((p) => !isValidId(p))) {
            errors.push(
              `Values for '${field}' must be valid MongoDB ObjectIds (24 hex characters)`
            );
          }
        } else if (!isValidId(val)) {
          errors.push(
            `Value for '${field}' must be a valid MongoDB ObjectId (24 hex characters)`
          );
        }
      } else if (schemaPath?.enumValues && schemaPath.enumValues.length > 0) {
        if (["in", "nin"].includes(operator)) {
          const parts = String(val).split(",").map((p) => p.trim());
          if (parts.some((p) => !schemaPath.enumValues.includes(p))) {
            errors.push(
              `Value for '${field}' must be one of: ${schemaPath.enumValues.join(", ")}`
            );
          }
        } else if (!schemaPath.enumValues.includes(val)) {
          errors.push(
            `Value for '${field}' must be one of: ${schemaPath.enumValues.join(", ")}`
          );
        }
      }
    };

    // Parse each query parameter in req.query
    for (const [key, val] of Object.entries(req.query || {})) {
      if (reservedKeys.has(key)) continue;

      // Handle bracket notation: field[operator] (e.g. price[gt]=10)
      const openBracket = key.indexOf("[");
      const closeBracket = key.lastIndexOf("]");
      if (openBracket > 0 && closeBracket === key.length - 1) {
        const field = key.slice(0, openBracket);
        let rawOp = key.slice(openBracket + 1, closeBracket);
        const operator = rawOp.startsWith("$") ? rawOp.slice(1) : rawOp;
        validateFilter(field, operator, val);
        continue;
      }

      // Handle parsed nested object: field: { operator: value }
      if (val && typeof val === "object" && !Array.isArray(val)) {
        for (const [nestedOp, nestedVal] of Object.entries(val)) {
          const operator = nestedOp.startsWith("$")
            ? nestedOp.slice(1)
            : nestedOp;
          validateFilter(key, operator, nestedVal);
        }
        continue;
      }

      // Handle direct field: field=value (e.g. role=user)
      validateFilter(key, "eq", val);
    }

    if (errors.length > 0) {
      throw new Error(errors.join(" | "));
    }

    return true;
  });
};

export default modelQuery;
