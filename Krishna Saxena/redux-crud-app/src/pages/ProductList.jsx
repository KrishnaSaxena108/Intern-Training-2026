import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ProductList() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    toast.success("Product deleted!");
  };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      
      <div className="header">
        <h1>🛍️ Products Dashboard</h1>

        <input
          className="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid">
          {[1,2,3,4].map((i) => (
            <div className="skeleton" key={i}></div>
          ))}
        </div>
      ) : (
        <div className="grid">
          {filtered.map((product) => (
            <div className="card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.title} />
              </Link>

              <h3>{product.title}</h3>
              <p className="price">${product.price}</p>

              <Link to={`/edit/${product.id}`}>
                <button className="btn-edit">Edit</button>
              </Link>

              <button
                className="btn-delete"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;