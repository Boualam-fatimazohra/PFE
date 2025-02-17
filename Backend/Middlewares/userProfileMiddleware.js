// profileAccessControl.js : Manager Or Formateur can only get or update his own profile
const authorizeSelfGetUpdate = (req, res, next) => {
    if (req.params.id) {
        if ((req.user.role === "Manager" || req.user.role === "Formateur") && req.params.id !== req.user.userId.toString()) {
            return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
        }
    }
    next();
};

module.exports = authorizeSelfGetUpdate;
