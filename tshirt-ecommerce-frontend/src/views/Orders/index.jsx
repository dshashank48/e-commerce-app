import React, { Fragment, useEffect, useState } from "react";
import { isAuthenticated } from "../../auth/helper";
import Base from "../../core/Base";
import { getOrderByUser } from "../../core/helper/orderHelper";

const Orders = () => {
   const [orders, setOrders] = useState([]);

   useEffect(() => {
      _getOrderByUser();
   }, []);

   const _getOrderByUser = async () => {
      //    getting userId and Token from isAuthenticated
      const userId = isAuthenticated() && isAuthenticated().user._id;
      const token = isAuthenticated() && isAuthenticated().token;

      const res = await getOrderByUser(userId, token);

      if (res && res.length > 0) {
         setOrders(res);
      }

      console.log(res);
   };

   const getOrderNames = (products) => {
      if (!products || products.length === 0) return "";
      let names = "";
      products.forEach((item) => {
         if (item) names += item.name + ", ";
      });
      return names;
   };

   return (
      <Base
         title="Your Orders"
         description="Your order history..."
         className="container-fluid mb-4"
      >
         <div className="col-md-8 offset-md-2 rounded">
            <table class="table">
               <thead>
                  <tr>
                     <th scope="col">Id</th>
                     <th scope="col">Status</th>
                     <th scope="col">Total Amount</th>
                     <th scope="col">Products</th>
                     <th scope="col">No of products</th>
                  </tr>
               </thead>
               <tbody>
                  {orders.map((order, index) => (
                     <tr key={order._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{order.status}</td>
                        <td>{order.amount} Rs</td>
                        <td>{getOrderNames(order.products)}</td>
                        <td>{order.products.length}</td>
                     </tr>
                  ))}

                  {orders.length === 0 && <p>No order found!</p>}
               </tbody>
            </table>
         </div>
      </Base>
   );
};

export default Orders;
