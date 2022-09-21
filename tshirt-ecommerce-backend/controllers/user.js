const User = require('../models/user');
const Order = require('../models/order');

// GET:Single User by ID
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = user;
        next();
    });
}

// Middleware for USER
exports.getUser = (req, res) => {
    // TODO: get back here fo password
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}

// UPDATE: USER
exports.updateUser = (req, res) =>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "Your are not autherized to update this user"
                })
            }
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            user.salt = undefined;
            return res.json(user)
        }
    )
}

// PURCHASE-LIST: USER
exports.userPurchaseList = (req, res) =>{
    Order.find({user: req.profile._id})
    .populate('user', '_id name')
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No Order in this account"
            })
        }
        return res.json(order);
    })
}

// PUSH-ORDER-IN-PURCHASE LIST
exports.pushOrderInPurchaseList = (req, res, next) =>{
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
        // store this in DB
        // new: true gives the updated value from the DB in return
        User.findOneAndUpdate(
            {_id: req.profile._id},
            {$push: {purchases: purchases}},
            {new: true},
            (err, purchases) => {
                if(err){
                    return res.status(400).json({
                        error: "Unable to save purchase list"
                    })
                }
                next();
            }
        )
    })
}