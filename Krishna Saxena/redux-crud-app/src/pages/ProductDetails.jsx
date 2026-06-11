import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <h2 className="container">Loading...</h2>;

  return (
    <div className="container">
      <Link to="/">← Back</Link>

      <div className="card">
        <img src={product.image} alt={product.title} />
        <h2>{product.title}</h2>
        <p className="price">${product.price}</p>
        <p>{product.description}</p>
      </div>
    </div>
  );
}

export default ProductDetails;