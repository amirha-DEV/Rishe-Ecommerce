const isAdmin=(req,res,next)=>{
    if(req.role!='admin'&& req.role!='superAdmin'){
        return res.status(401).json({
            success:false,
            message:"you don't have a permission to access this route"
        })
    }
    next()
}
export default isAdmin