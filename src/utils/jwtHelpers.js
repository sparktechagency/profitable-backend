import jwt from "jsonwebtoken";


//create token
export const createToken = (payload,secret,expireTime) =>{
    return jwt.sign(payload,secret,{
        expiresIn: expireTime
    });
};

// create reset token
export const createResetToken = (payload,secret,expireTime) =>{
    return jwt.sign(payload,secret,{
        expiresIn: expireTime
    });
}

//token verify
export const verifyToken = (token,secret) => {
    return jwt.verify(token,secret);
}