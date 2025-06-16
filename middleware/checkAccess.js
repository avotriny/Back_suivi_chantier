const checkAccess = (permission) => {
    return async (req, res, next) => {
      if (!permission) {
        return res.status(500).json({ success: false, message: 'Permission configuration error' });
      }
  
      if (permission.roles.includes(req.user.role)) {
        return next();
      }
  
      if (!permission.owner) {
        return res.status(401).json({ success: false, message: 'Access interdit' });
      }
  
      const isOwner = await permission.owner(req);
      if (isOwner === true) {
        return next();
      }
  
      if (isOwner === false) {
        return res.status(401).json({ success: false, message: 'Access interdit' });
      }
  
      res.status(500).json({ success: false, message: 'Quelque chose va mal ! Essayez plus tard' });
    };
  };
  
  export default checkAccess;
  