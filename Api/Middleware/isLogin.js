const isLogin=(req,res,next)=>{
    console.log(req.role)
    console.log(req.userId)
    if(!req?.userId || !req?.role){
        return res.status(401).json({
            success:false,
            message:"you don't have a permission to access this route"
        })
    }
    next()
}
export default isLogin