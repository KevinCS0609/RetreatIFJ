export default function DashboardLayout({children}){
    return (
        <>
            <div className="p-5 border-b border-gray-300 bg-orange-500 flex justify-between">
                <h1>Dashboard Layout</h1>
                <div>
                    <button className="bg-white text-black px-3 py-1 rounded-lg font-semibold hover:bg-gray-200 duration-300">Logout</button>
                </div>
            </div>
            <div>
                {children}
            </div>
        </>
    )
}