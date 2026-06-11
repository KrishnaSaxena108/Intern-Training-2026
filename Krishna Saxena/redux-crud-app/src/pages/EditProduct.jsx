import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductForm from "../components/ProductForm";
import { updateProduct } from "../features/products/productSlice";

function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector((state) =>
    state.products.products.find((p) => p.id === Number(id))
  );

  const handleSubmit = async (data) => {
    await dispatch(updateProduct({ id, product: data }));
    navigate("/");
  };

  if (!product) return <h2 className="container">Product Not Found</h2>;

  return (
    <div className="container">
      <h1>✏️ Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleSubmit} />
    </div>
  );
}

export default EditProduct;