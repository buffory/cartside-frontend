import { useState } from 'react';
import './App.css';
import { List } from './List.jsx';
import { Products } from './Products.jsx';
import RetailerMap from './RetailerMap.jsx'

function App() {
  const [shoppingList, setShoppingList] = useState([])

  function addToShoppingList(product) {
      setShoppingList([...shoppingList, {...product, uuid: crypto.randomUUID()}]);
  }

  function removeFromShoppingList(product) {
      setShoppingList(shoppingList.filter(p => p.uuid !== product.uuid));
  }

  return (
    <>
        <div className="w-full flex flex-col p-5">
            <div className="w-full flex flex-col space-y-5">
                <h1>cartside</h1>
                <div className="w-full flex flex-row space-x-6">
                    {shoppingList ? <List list={shoppingList} remove={removeFromShoppingList} /> : null }
                    <Products list={shoppingList} add={addToShoppingList} />
                </div>
                {shoppingList ? <RetailerMap list={shoppingList} /> : null }
            </div>
        </div>
    </>
  )
}

export default App
