import express from 'express';
import upload from '../../middlewares/fileupload.middleware.js';
import ProductsController from './product.controller.js';
const ProductRouter = express.Router();
const productsController = new ProductsController();

ProductRouter.get('/filter', (req, res)=>{
    productsController.filterProducts(req, res);
});
ProductRouter.get('/', (req, res)=>{
    productsController.getAllProducts(req, res);
});
ProductRouter.post('/', upload.single('imageUrl'), (req, res)=>{
    productsController.addProduct(req, res);
});
ProductRouter.get('/averagePrice', (req, res, next)=>{
    productsController.averagePrice(req, res);
});
ProductRouter.get('/:id', (req, res)=>{
    productsController.getOneProduct(req, res);
});
ProductRouter.post('/rate', (req, res, next)=>{
    productsController.rateProduct(req, res, next);
});

export default ProductRouter;