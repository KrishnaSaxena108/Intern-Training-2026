import { useState } from "react";

function ProductForm({ initialData, onSubmit }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [price, setPrice] = useState(initialData?.price || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      price: Number(price),
      description: "Sample Description",
      image: "https://i.pravatar.cc",
      category: "electronics",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button type="submit">Save</button>
    </form>
  );
}

export default ProductForm;