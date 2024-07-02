import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next)=>{
    const token = req.headers['authorization'];
    if(!token){
        return res.
        status(401)
        .send("Unauthorized");
    }
    try{
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET);  
            req.userID = payload.userId; 
    }
    catch(err){
        res
        .status(401)
        .send("Unauthorized");
    }
    next();
}
export default jwtAuth;