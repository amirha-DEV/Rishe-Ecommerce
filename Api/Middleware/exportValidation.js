import jwt from "jsonwebtoken";
export const exportValidation = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    const { id=null, role=null } = jwt.verify(token, process.env.SECRET_JWT);
    req.userId = id;
    req.role = role;
  } catch (error) {
    req.userId = null;
    req.role = null;
  }
  next()
};
