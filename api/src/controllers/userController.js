export default class UserController{
    static getMe(req, res){
        res.send(`Bonjour ${req.user.name}`);
        // , votre rôle est : ${req.user.role.title}`);
    }
}