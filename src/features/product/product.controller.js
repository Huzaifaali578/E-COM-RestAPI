import ProductModel from './product.model.js';
import ProductRepository from './product.repository.js';

export default class ProductController {

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, sizes, stock, category } = req.body;
      
      // Corrected the ProductModel instantiation
      const createdRecord = new ProductModel(
        name,
        null,
        parseFloat(price), // Corrected typo from `arseFloat` to `parseFloat`
        category,
        sizes?.split(','), // Assuming sizes are comma-separated in the request body
        Number(stock),
        req?.file?.filename // Multer adds `file` to the request object
      );
      
      // Save the product to the repository
      await this.productRepository.add(createdRecord);

      res.status(201).send(createdRecord);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }



  async rateProduct(req, res, next) {
    try {
      console.log(req.query)
      const userID = req.userID;
      const productID = req.body.productID;
      const rating = req.body.rating;
      await this.productRepository.rateProduct(
        userID,
        productID,
        rating
      );
      return res
        .status(200)
        .send('Rating has been added');
    } catch (err) {
      next(err)
    }
  }


  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send('Product not found');
      } else {
        return res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      // console.log(`pcmaxPrice ${maxPrice}`)
      const category = req.query.category;
      const result = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      // console.log(`pcresult ${result}`)
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }

  async AveragePrice(req, res, next) {
    try {
      const result = await this.productRepository.AveragePricePerCategory();
      res.status(200).send(result)
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }
}
