import { useState } from 'react';
import { List } from './List.jsx';
import { Products } from './Products.jsx';
import { Route } from './Route.jsx';
import { Header } from './Header';

export function Demo() {
  const [shoppingList, setShoppingList] = useState([])
    
  function addToShoppingList(product) {
      setShoppingList([...shoppingList, {...product, uuid: crypto.randomUUID()}]);
  }

  function removeFromShoppingList(product) {
      setShoppingList(shoppingList.filter(p => p.uuid !== product.uuid));
  }
    return (
        <div className="w-full flex flex-col items-center justify-center space-y-5">
            <h2 className='text-3xl'>Try it out</h2>
            <div className="w-full flex flex-row space-x-6">
                {shoppingList ? <List list={shoppingList} remove={removeFromShoppingList} /> : null }
                <Products list={shoppingList} add={addToShoppingList} />
            </div>
            {shoppingList ? <Route list={shoppingList} /> : null }
        </div>
    )
}
