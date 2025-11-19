const router   = require('express').Router();
const {getProperties, getProperty, createProperty, updateProperty, deleteProperty}
 = require('../controllers/propertyController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');


router.get('/', getProperties);
router.get('/:propertyId', getProperty);
router.post('/', verifyToken, authorizeRoles('admin'), createProperty);
router.patch('/:propertyId', verifyToken, authorizeRoles('admin'), updateProperty);
router.delete('/:propertyId', verifyToken, authorizeRoles('admin'), deleteProperty);

module.exports = router;



