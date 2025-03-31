import { useState } from 'react';
import './App.css';
import { List } from './List.jsx';
import { Products } from './Products.jsx';

function App() {
  const [shoppingList, setShoppingList] = useState([])

  function addToShoppingList(product) {
      shoppingList.push(product);
      setShoppingList(shoppingList);
  }

  function removeFromShoppingList(product) {
      setShoppingList(shoppingList.filter(p => p !== product.product_id));
  }

  return (
    <>
        <div className="w-full flex flex-col p-5">
            <div className="w-full flex flex-col space-y-5">
                <h1>cartside</h1>
                <div className="w-full flex flex-row">
                    {shoppingList ? <List list={shoppingList} remove={removeFromShoppingList} /> : null }
                    <Products list={shoppingList} add={addToShoppingList} />
                </div>
            </div>
        </div>
    </>
  )
}

export default App
