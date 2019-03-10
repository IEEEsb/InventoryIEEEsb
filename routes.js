const express = require('express');
const authController = require('./controllers/authController');
const inventoryController = require('./controllers/inventoryController');
const paypalController = require('./controllers/paypalController');

const {
	validators, validate,
} = require('./controllers/validators');

function selfUser(req, res, next) {
	req.params.userId = req.session.userId;
	next();
}

const authRouter = express.Router();

authRouter.get('/', authController.getServiceData);

const userRouter = express.Router();

userRouter.post('/login', validate(validators.login), authController.login);

// Endpoints that require authentication
userRouter.use(authController.authRequired);

userRouter.get('/self', selfUser, authController.getUser);
userRouter.post('/logout', authController.logout);

userRouter.get('/self/purchase/all', selfUser, inventoryController.getUserPurchases);
userRouter.get('/:userId/purchase/all/', inventoryController.getUserPurchases);
userRouter.post('/self/purchase/:purchaseId/cancel', selfUser, inventoryController.cancelUserPurchase);
userRouter.post('/:userId/purchase/:purchaseId/cancel', inventoryController.cancelUserPurchase);

// Endpoints limited to administrators
userRouter.use(authController.adminRequired);

userRouter.get('/all', authController.getAllUsers);
userRouter.get('/:userId', authController.getUser);
userRouter.post('/:userId/addRole', validate(validators.addRole), authController.addRole);
userRouter.post('/:userId/addMoney', validate(validators.addMoney), authController.addMoney);

const inventoryRouter = express.Router();


inventoryRouter.get('/item/tags', inventoryController.getTags);

// Endpoints that require authentication
inventoryRouter.use(authController.authRequired);

inventoryRouter.get('/item/all/consumable', validate(validators.getItems), inventoryController.getConsumableItems);
inventoryRouter.get('/item/code/:code', inventoryController.getItemByCode);
inventoryRouter.get('/item/:itemId', inventoryController.getItem);

inventoryRouter.post('/item/:itemId/buy', validate(validators.buyItem), inventoryController.buyItem);

// Endpoints limited to administrators
inventoryRouter.use(authController.adminRequired);

inventoryRouter.post('/item', validate(validators.item), inventoryController.addItem);
inventoryRouter.patch('/item/:itemId', validate(validators.item), inventoryController.updateItem);
inventoryRouter.delete('/item/:itemId', inventoryController.removeItem);

inventoryRouter.get('/purchase/all', inventoryController.getAllPurchases);
inventoryRouter.get('/purchase/:purchaseId', inventoryController.getPurchase);

inventoryRouter.post('/purchase', validate(validators.startPurchase), inventoryController.startPurchase);
inventoryRouter.patch('/purchase/:purchaseId', validate(validators.startPurchase), inventoryController.updatePurchase);
inventoryRouter.delete('/purchase/:purchaseId', inventoryController.removePurchase);
inventoryRouter.post('/purchase/:purchaseId/end', inventoryController.endPurchase);

inventoryRouter.post('/purchase/:purchaseId/item/:itemId', validate(validators.purchaseItem), inventoryController.addPurchaseItem);
inventoryRouter.patch('/purchase/:purchaseId/item/:itemId', validate(validators.purchaseItem), inventoryController.updatePurchaseItem);

const paypalRouter = express.Router();

paypalRouter.use(authController.authRequired);

paypalRouter.post('/createPayment', validate(validators.createPayment), paypalController.createPayment);
paypalRouter.post('/executePayment/:paymentId', validate(validators.executePayment), paypalController.executePayment);

const router = express.Router();

router.use('/api/auth', authRouter);
router.use('/api/user', userRouter);
router.use('/api/inventory', inventoryRouter);
router.use('/api/paypal', paypalRouter);

module.exports = router;
