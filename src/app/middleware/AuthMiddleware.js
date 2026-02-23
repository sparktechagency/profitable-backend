import jwt from "jsonwebtoken";
import config from "../../config/index.js";
import ApiError from "../../error/ApiError.js";
import { verifyToken } from "../../utils/jwtHelpers.js";
import { ENUM_ADMIN_ROLE } from "../../helper/enum.js";


export function authorizeUser(req, res, next) {

    try {

      const authHeader = req.headers['authorization'];
    
      if (!authHeader) {
        // return res.status(401).json({ message: 'Authorization header missing' });
        throw new ApiError( 401, "You are not authorized to perform this action");
      }
    
      // Expecting format: "Bearer <token>"
      const token = authHeader.split(' ')[1];
    
      if (!token) {
        // return res.status(401).json({ message: 'Token missing' });
        throw new ApiError( 401,"Authorization token missing");
      }

      const verifyUser = verifyToken(token, config.jwt.secret);
      // console.log(verifyUser);
      

      req.user = verifyUser;

      next();

  } catch (error) {
    next(error);
  }

}

// const payload = {
//   id: user._id,
//   email: user.email,
//   role: user.role, // should be 'admin' for admins
// };

// const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

//admin authorization middleware
export const authorizeAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token presence
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user role is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // Attach user info to request for downstream use
    req.user = decoded;

    next(); // Authorized
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
    // next(err);
  }
};

// socketAuth.js
export const authorizeUserSocket = (socket, next) => {
  try {
    // token can come from query or headers
    const token =
      socket.handshake.auth?.token || socket.handshake.headers["authorization"];

    if (!token) {
      throw new ApiError( 401,"Authorization token missing");
    }

    const decoded = verifyToken(token, config.jwt.secret);

    // attach user to socket
    socket.user = decoded;

    return next();
  } catch (err) {
    return next(new Error("Unauthorized: Invalid token"));
  }
};

// Role-based access control middleware
export const auth =
  (roles, isAccessible = true) =>
  async (req, res, next) => {
    try {
      const tokenWithBearer = req.headers.authorization;

      if (!tokenWithBearer && !isAccessible) return next();

      if (!tokenWithBearer){

        throw new ApiError(401, "You are not authorized for this role.");
      }

      if (tokenWithBearer.startsWith("Bearer")) {
        const token = tokenWithBearer.split(" ")[1];

        const verifyUser = verifyToken(token, config.jwt.secret);

        req.user = verifyUser;
        // console.log(verifyUser);

        // const isExist = await Auth.findById(verifyUser?.authId);
        if ( !Object.values(ENUM_ADMIN_ROLE).includes(verifyUser.role) ) {
          throw new ApiError(401, "You are not authorized to perform this action.");
        }

        // console.log(roles.length);

        if (roles.length && !roles.includes(verifyUser.role)){

          throw new ApiError( 403, "Access Forbidden: You do not have permission to perform this action");
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };

// Permission-based access control middleware
export const requirePermission = ( route ) => {
  return ( req, res, next ) => {

    const admin = req.user;

    if (!admin) {
      return next(new ApiError(401, "Unauthorized. Please log in."));
    }

    // Super admin bypass
    if (admin.role === ENUM_ADMIN_ROLE.SUPER_ADMIN) {
      return next();
    }

    if (!admin.permissions.includes(route)) {
      return next(new ApiError(403, "Access Denied. You do not have the required permission."));
    }

    next();
  };
};


// router.get(
//   "/users",
//   authMiddleware,
//   requirePermission(ENUM_ADMIN_PERMISSION.USER),
//   UserController.getAllUsers
// );

// router.get(
//   "/listings",
//   authMiddleware,
//   requirePermission(ENUM_ADMIN_PERMISSION.LISTING),
//   ListingController.getAllListings
// );








