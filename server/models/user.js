const mongoose = require("mongoose");
const { STRING } = require("sequelize");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cartprod) => {
    return cartprod.productId.toString() === product._id.toString();
  });

  let newQuant = 1;
  const updatedCart = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuant = this.cart.items[cartProductIndex].quantity + 1;
    updatedCart[cartProductIndex].quantity = newQuant;
  } else {
    updatedCart.push({
      productId: product._id,
      quantity: newQuant,
    });
  }

  const updatedCarts = {
    items: updatedCart,
  };

  this.cart = updatedCarts;
  return this.save();
};

userSchema.methods.deleteCartItem = function (id) {
  const productIds = this.cart.items.filter(
    (prod) => prod._id.toString() !== id
  );
  

  const updatedCarts = {
    items: productIds,
  };
  this.cart = updatedCarts;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

/*const Db = require("mongodb/lib/db");
const { get } = require("../routes/admin");
const { mongoConnect } = require("../util/database");
const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class User {
  constructor(name, email, id, cart) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("user")
      .insertOne({
        name: this.name,
        email: this.email,
        cart: this.cart,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchById = (id) => {
    const db = getDb();
    return db
      .collection("user")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cartprod) => {
      return cartprod.productId.toString() === product._id.toString();
    });

    let newQuant = 1;
    const updatedCart = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuant = this.cart.items[cartProductIndex].quantity + 1;
      updatedCart[cartProductIndex].quantity = newQuant;
    } else {
      updatedCart.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuant,
      });
    }

    const updatedCarts = {
      items: updatedCart,
    };

    const db = getDb();

    return db
      .collection("user")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCarts } }
      );
  }

  deleteCartItem(id) {
    const db = getDb();

    const productIds = this.cart.items.filter(
      (prod) => prod.productId.toString() !== id
    );

    const updatedCarts = {
      items: productIds,
    };
    return db
      .collection("user")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCarts } }
      );
  }

  removeAllItemsFromCart() {
    const db = getDb();
    return db
      .collection("user")
      .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
  }

  getCartItems() {
    const db = getDb();
    const productIds = this.cart.items.map((prod) => {
      return prod.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }
}

module.exports = User;
*/
