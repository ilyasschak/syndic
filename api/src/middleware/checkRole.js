export default function checkRole(req, res, next){
    const role = req.params.role;
    const userRole = req.user.role.title;

    if(role === userRole){
        next();
    }else{
        res.status(401).json({
            error : "You're unauthorized to perform this operation !"
        })
    }
}