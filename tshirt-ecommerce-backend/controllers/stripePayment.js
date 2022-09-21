const config = require("../config");
const stripe = require("stripe")(config.secretKey);
const uuid = require("uuid/v4");

exports.makePayment = (req, res) => {
   const { products, token, finalAmount } = req.body;
   console.log("Products: ", products);
   console.log("Final Amount: ", finalAmount);
   //    calculate final amount based on product
   let amount = 0;
   if (products !== undefined) {
      products.map((product) => {
         amount = amount + product.price;
      });
   }

   //    unique payment for user
   const idempotencyKey = uuid();

   return stripe.customers
      .create({
         email: token.email,
         source: token.id,
      })
      .then((customer) => {
         stripe.charges
            .create(
               {
                  amount: amount * 100,
                  currency: "usd",
                  customer: customer.id,
                  receipt_email: token.email,
                  description: "LCO T-shirt Store",
                  shipping: {
                     name: token.card.name,
                     address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.address_country,
                        postal_code: token.card.address_zip,
                     },
                  },
               },
               { idempotencyKey }
            )
            .then((result) => res.status(200).json(result))
            .catch((error) => console.log(error));
      });
};
