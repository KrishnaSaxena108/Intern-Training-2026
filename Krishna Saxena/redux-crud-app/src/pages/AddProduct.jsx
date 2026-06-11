import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../features/products/productSlice";
import { toast } from "react-toastify";

function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await dispatch(createProduct(data));
    toast.success("Product added!");
    navigate("/");
  };

  return (
    <div className="container">
      <h1>➕ Add Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddProduct;