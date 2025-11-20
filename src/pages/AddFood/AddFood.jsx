import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { addFood } from "../../services/foodService";
import { toast } from "react-toastify";



const AddFood = () => {

  
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Biryani",
  });

  // handle input field changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // handle form submit
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
     toast.error('please select an image')
      return;
    }

   try {
   await  addFood(data,image);
   toast.success('food added successfully.')
   setData({name:'', description:'',category:'Biryani', price:''});
   setImage(null);

   } catch (error) {
    
   }
  };

  return (
    <div className="mx-2 mt-2">
      <div className="row">
        <div className="card col-md-4">
          <div className="card-body">
            <h2 className="mb-4">Add Food</h2>

            <form onSubmit={onSubmitHandler}>
              {/* Image Upload Section */}
              <div className="mb-3 text-center">
                <label htmlFor="image" className="form-label">
                  <img
                    src={image ? URL.createObjectURL(image) : assets.upload}
                    alt="Upload Preview"
                    width={100}
                    className="border rounded"
                  />
                </label>
                <input
                  type="file"
                  id="image"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  required
                  value={data.name}
                  onChange={onChangeHandler}
                  placeholder="Enter food Name..."
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="5"
                  required
                  value={data.description}
                  onChange={onChangeHandler}
                  placeholder="More About Food...."
                ></textarea>
              </div>

              {/* Category */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="form-control"
                  required
                  value={data.category}
                  onChange={onChangeHandler}
                >
                  <option value="">Select Category</option>
                  <option value="biryani">Biryani</option>
                  <option value="cake">Cake</option>
                  <option value="burger">Burger</option>
                  <option value="pizza">Pizza</option>
                  <option value="roll">Rolls</option>
                  <option value="salad">Salad</option>
                  <option value="icecream">Ice Cream</option>
                </select>
              </div>

              {/* Price */}
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  required
                  value={data.price}
                  onChange={onChangeHandler}
                  placeholder="Enter Price...."
                />

              </div>

              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
