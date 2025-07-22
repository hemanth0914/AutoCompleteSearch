import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [cache, setCache] = useState({});
  const fetchData = async (searchInput) => {
    if (cache[searchInput]) {
      console.log("Cache returned", searchInput);
      setProducts(cache[searchInput]);
      return;
    }
    console.log("API CALL", searchInput);
    const data = await fetch(
      `https://dummyjson.com/products/search?q=${searchInput}`
    );
    const json = await data.json();
    setProducts(json?.products);
    setCache((prev) => ({ ...prev, [searchInput]: json?.products }));
  };
  useEffect(() => {
    const timer = setTimeout(() => fetchData(searchInput), 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);
  return (
    <div className="App">
      <h1>Auto Complete Search Feature</h1>
      <div>
        <input
          type="text"
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setShowResults(false)}
        />
      </div>
      {showResults && (
        <div className="search-results-container">
          {products
            .filter((product) =>
              product.title.toLowerCase().startsWith(searchInput.toLowerCase())
            )
            .map((product) => (
              <span className="product" key={product.id}>
                {product.title}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
