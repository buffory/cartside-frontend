import { useState, useEffect, useRef } from 'react';

export function Products({ list, add }) {
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0.00);
    const query = useRef('');

   
    async function getProducts() {
        try {
            const res = await fetch(`http://localhost:3000/products?product=${query.current}`);
            if (!res.ok) {
                throw new Error(`error`);
            }
            const data = await res.json();
            setResults(data);
        } catch (e) {
            console.log(e);
        }
    }

    function ProductTab({ product }) {
        return (
            <div className="flex flex-col justify-center items-center border-[#808080] p-4 border rounded-xl"
            onClick={() => add(product)}>
                <img src={product.image_url} alt={product.name} />
                <h2 className="text-md">{product.retailer}</h2>
                <h2 className="text-md"><a href={product.product_url} target="_blank">{product.name}</a></h2>
                <h2 className="text-md">{product.price}</h2>
            </div>
        );
    }

    function ProductsGrid() {
        return (
            <div className="grid grid-cols-3 space-x-2 space-y-2 overflow-y-scroll max-h-[400px]">
                {results.map(product => {
                    return <ProductTab product={product} />;
                })}

            </div>
        );
    }

    function SearchBar() {
        return (
            <div className="flex space-x-4 flex-row w-full max-h-[50px] justify-between">
                <div>
                    <input type="text" placeholder="milk..?" onChange={(e) => query.current = e.target.value} />
                    <button onClick={async () => await getProducts()}>search</button>
                </div>
                <div className="flex flex-row space-x-2">
                    <select className="border p-2" name="products" id="product-select">
                       <option value="cheapest">cheapest</option>
                       <option value="expensivest">expensivest</option>
                    </select>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col w-full space-y-2 justify-center items-center">
            <SearchBar />
            <ProductsGrid />
        </div>
    );
}

