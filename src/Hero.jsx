export function Hero() {
    return (
        <div className="page-container w-full flex flex-col items-center justify-around p-12 shadow h-[90vh] mt-24 space-y-12 p-12">
            <div className='flex flex-row'>
                <div className="w-1/2 flex flex-col">
                    <h1 className="hero-heading">Never overpay for groceries again.</h1>
                    <ul className="feature-list">

                        <li>Add your grocery list</li>

                        <li>Automatically compare prices</li>

                        <li>Save up to 25% on every trip</li>

                        <li>100% free to use</li>

                    </ul>
                </div>
                <div className='w-1/2 flex justify-end'>
                    <img height={"100"} width={"200"} src={"phone.webp"} alt={'phone'} />
                </div>
            </div>
            <div class="how-you-save flex flex-col text-black text-3xl">
                How You Save
                <span class="arrow-down">↓</span>
            </div>
        </div>
    );
}
