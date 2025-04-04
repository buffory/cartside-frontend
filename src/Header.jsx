export function Header() {
    return (
        <div className="header text-lg w-screen absolute top-0 left-0 h-[100px] flex flex-row justify-around items-center">
            <div className='max-w-[1280px] w-full flex flex-row justify-around items-around'>
                <div className="flex flex-row">
                    <button className='menu-button'>Home</button>
                    <button className='menu-button'>Our mission</button>
                </div>
                <h1 className='title'>cartside.</h1>
                <button className='try-button'>Try cartside</button>
            </div>
        </div>
    );
}
