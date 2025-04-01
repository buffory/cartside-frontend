import { useState, useEffect } from 'react';

export function List({ list, remove }) {
    const [total, setTotal] = useState(parseFloat(0.00));

    useEffect(() => {
        updateTotal();
    }, [list]);

    function updateTotal() {
        for (const item of list) {
            let t = parseFloat(total) + parseFloat(item.price.replace('$',''));
            setTotal(t.toFixed(2));
        }
    }

    function Total() {
        return <div className="w-full justify-end"><h2>total: {total}</h2></div>;
    }

    function CustomInput({ i }) {
        const [hover, onHover] = useState(false);
        
        return (
            <div className="flex flex-row rounded-md justify-between border p-2 max-w-[500px] w-full items-center space-x-2"
             onMouseEnter ={() => onHover(true)} onMouseLeave={() => onHover(false)}>
                { hover ? null : <h2>{i.retailer}</h2>}
                <h2>{i.name}</h2>
                {hover ? null : <h2>{i.price}</h2> }
                {hover ? <button onClick={() => remove(i)}>remove</button> : null}
            </div>
        );
    }


    return (
        <div className="flex flex-col space-y-4 w-full p-5 justify-center items-center">
            <div className="flex flex-col space-y-4 p-2 justify-center overflow-y-scroll max-h-[400px]">
                { list.map(i => (<CustomInput i={i} />)) }
            </div>
            <Total />
        </div>
    );
}
