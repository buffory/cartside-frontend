import { useState, useEffect } from 'react';

export function List({ list, remove }) {
    const [inputs, setInputs] = useState(list);

    function removeInput(i) {
        if (inputs.length === 1) {
            return;
        }

        setInputs(
            inputs.filter(j => j.index !== i.index)
        )
        return
    }

    function CustomInput({ i }) {
        const [hover, onHover] = useState(false);
        

        return (
            <div className="flex flex-row justify-center w-full items-center space-x-2"
             onMouseEnter ={() => onHover(true)} onMouseLeave={() => onHover(false)}>
                <h2>{i.name}</h2>
                {hover ? <button className="text-white"  onClick={() => remove(i)}>remove</button> : null}
            </div>
        );
    }


    return (
        <div className="flex flex-col space-y-4 w-full overflow-y-scroll  justify-center items-center w-full">
            { inputs.map(i => (<CustomInput i={i} />)) }
        </div>
    );
}
