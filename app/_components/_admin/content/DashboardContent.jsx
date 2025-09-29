export default function DashboardContent() {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                {/* Card Contoh */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Total Sales</p>
                        <p className="text-2xl font-bold text-gray-800">$ 24,382</p>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">New Orders</p>
                        <p className="text-2xl font-bold text-gray-800">1,205</p>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-800">350</p>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold text-gray-800">76</p>
                    </div>
                </div>
            </div>
        </div>
    );
}