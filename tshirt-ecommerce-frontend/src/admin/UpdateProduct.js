import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import {
   getCategory,
   updateProduct,
   getProductById,
} from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const UpdateProduct = ({ match }) => {
   const { user, token } = isAuthenticated();
   const [values, setValues] = useState({
      name: "",
      description: "",
      price: "",
      stock: "",
      photo: "",
      categories: [],
      category: "",
      loading: false,
      error: "",
      createdProduct: "",
      getRedirect: false,
      formData: "",
   });

   //    Destrucure all values
   const {
      name,
      description,
      price,
      stock,
      categories,
      category,
      loading,
      error,
      createdProduct,
      getRedirect,
      formData,
   } = values;

   const preload = (productId) => {
      console.log("prodcutID: ", productId);
      getProductById(productId).then((data) => {
         console.log(data);
         if (data.error) {
            setValues({ ...values, error: data.error });
         } else {
            preloadCategories();
            setValues({
               ...values,
               name: data.name,
               description: data.description,
               price: data.price,
               category: data.category._id,
               stock: data.stock,
               formData: new FormData(),
            });
         }
      });
   };
   //    loading All Categories
   const preloadCategories = () => {
      getCategory().then((data) => {
         console.log(data);
         if (data.error) {
            setValues({ ...values, error: data.error });
         } else {
            setValues({
               categories: data,
               formData: new FormData(),
            });
         }
      });
   };

   //    Hooks API:
   useEffect(() => {
      preload(match.params.productId);
   }, []);

   //    TODO: Work on this
   const onSubmit = (event) => {
      event.preventDefault();
      setValues({ ...values, error: "", loading: true });

      updateProduct(match.params.productId, user._id, token, formData)
         .then((data) => {
            if (data.error) {
               setValues({ ...values, error: data.error });
            } else {
               setValues({
                  ...values,
                  name: "",
                  description: "",
                  price: "",
                  photo: "",
                  stock: "",
                  loading: false,
                  createdProduct: data.name,
                  formData: "",
               });
            }
         })
         .catch((err) => console.log(err));
   };

   const handleChange = (name) => (event) => {
      const value =
         name === "photo" ? event.target.files[0] : event.target.value;
      formData.set(name, value);
      setValues({ ...values, [name]: value });
   };

   // Success Message
   const successMessage = () => {
      return (
         <div
            className="alert alert-success mt-3"
            style={{ display: createdProduct ? "" : "none" }}
         >
            <h5>{createdProduct} updated successfully!</h5>
         </div>
      );
   };
   //Error Message
   const errorMessage = () => {
      return (
         <div
            className="alert alert-danger mt-3"
            style={{ display: error ? "" : "none" }}
         >
            <h5>{error}</h5>
         </div>
      );
   };
   // Form Goes here
   const createProductForm = () => (
      <form>
         <div className="form-group">
            <input
               onChange={handleChange("name")}
               name="photo"
               className="form-control"
               placeholder="Name"
               value={name}
            />
         </div>

         <div className="form-group">
            <textarea
               onChange={handleChange("description")}
               name="photo"
               className="form-control"
               placeholder="Description"
               value={description}
            />
         </div>

         <div className="form-group">
            <input
               onChange={handleChange("price")}
               type="number"
               className="form-control"
               placeholder="Price"
               value={price}
            />
         </div>

         <div className="form-group">
            <select
               onChange={handleChange("category")}
               className="form-control"
               placeholder="Category"
            >
               <option>Select</option>
               {categories &&
                  categories.map((category, index) => (
                     <option key={index} value={category._id}>
                        {category.name}
                     </option>
                  ))}
            </select>
         </div>

         <div className="form-group">
            <input
               onChange={handleChange("stock")}
               type="number"
               className="form-control"
               placeholder="Quantity"
               value={stock}
            />
         </div>

         <div className="form-group">
            <div class="custom-file">
               <input
                  class="custom-file-input"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                  onChange={handleChange("photo")}
                  type="file"
                  name="photo"
                  accept="image"
                  placeholder="choose a file"
               />
               <label class="custom-file-label" for="inputGroupFile01">
                  Choose new picture for T-shirt
               </label>
            </div>
         </div>

         <button
            type="submit"
            onClick={onSubmit}
            className="btn btn-outline-info"
         >
            Update Product
         </button>
      </form>
   );

   return (
      <Base
         title="Update Product here"
         description="Update you existing products details here.."
         className="container-fluid mb-4"
      >
         <div className="col-md-8 offset-md-2  rounded">
            <div className="card py-4 px-5">
               <div class="row ml-1 mb-3">
                  <div className="col-4 p-0">
                     <Link
                        to="/admin/dashboard"
                        className="btn btn-md btn-info mb-3"
                     >
                        Admin Home
                     </Link>
                  </div>
                  <div className="col-8">
                     <h4>Update Product Details</h4>
                  </div>
               </div>

               {successMessage()}
               {errorMessage()}
               {createProductForm()}
            </div>
         </div>
      </Base>
   );
};
export default UpdateProduct;
