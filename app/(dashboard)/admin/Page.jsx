export default function AdminPage(){
    return (
        <>
            <div className="p-5 bg-gray-200 min-h-screen">
                <div className="flex justify-between grid grid-cols-5 gap-3">
                    <button className="rounded-md p-2 bg-white">Products</button>
                    <button className="rounded-md p-2 bg-white">Checkout</button>
                    <button className="rounded-md p-2 bg-white">Transaction</button>
                    <button className="rounded-md p-2 bg-white">User</button>
                    <button className="rounded-md p-2 bg-white">Halo</button>
                </div>
            </div>
        </>
    )
}