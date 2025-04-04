import { useState, useRef } from 'react';
import { List } from './List.jsx';
import { Products } from './Products.jsx';
import { Route } from './Route.jsx';
import { Header } from './Header';

export function Demo() {
    const zip = useRef('');
    const [ready, setReady] = useState(false);

    function ProductsDemo() {
        const [shoppingList, setShoppingList] = useState([])

        function addToShoppingList(product) {
            setShoppingList([...shoppingList, {...product, uuid: crypto.randomUUID()}]);
        }

        function removeFromShoppingList(product) {
            setShoppingList(shoppingList.filter(p => p.uuid !== product.uuid));
        }

        return <div className="w-full h-screen flex flex-col items-center justify-center space-y-5">
            <h1 className='title'>Build your cart</h1>
            <div className="w-full flex flex-row space-x-6">
                {shoppingList ? <List list={shoppingList} remove={removeFromShoppingList} /> : null }
                <Products list={shoppingList} add={addToShoppingList} />
            </div>
            {shoppingList ? <Route list={shoppingList} zipcode={zip.current} /> : null }
        </div>
    }

    function Zipcode() {
        return (
            <div className='zip-div space-y-4 w-full h-screen flex flex-col justify-center items-center'>
                <input className='zipInput' type='number' placeholder="Enter your zipcode" onChange={(e) => zip.current = e.target.value} />
                <hr/>
                <button className='try-button' onClick={() => setReady(true)}>Get Started</button>
            </div>
        );
    }


    return ready ? (<ProductsDemo />) : (<Zipcode />)
}
