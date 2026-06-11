import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div>
        <Link to="/">🏠 Home</Link>
        <Link to="/add">➕ Add Product</Link>
      </div>

      <div>Redux Store App</div>
    </nav>
  );
}

export default Navbar;