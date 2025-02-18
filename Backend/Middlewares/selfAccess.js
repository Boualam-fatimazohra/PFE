// profileAccessControl.js : Manager or Formateur can only get or update their own profile
const authorizeSelfGetUpdate = (req, res, next) => {
    const { id } = req.params;
    const { role, userId } = req.user;

    // Ensure the user is either a Manager or Formateur and can only access their own profile
    if (id && (role === "Manager" || role === "Formateur") && id !== String(userId)) {
        return res.status(403).json({ message: "Forbidden: You can only access or update your own profile" });
    }

    next();
};

module.exports = authorizeSelfGetUpdate;
