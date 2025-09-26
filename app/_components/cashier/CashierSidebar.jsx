import { FaTachometerAlt, FaBars, FaHistory, FaWallet, FaTag, FaCog, FaStar } from 'react-icons/fa';

export default function CashierSidebar() {
    const menuItems = [
        { name: 'Dashboard', icon: FaTachometerAlt, active: false },
        { name: 'Menus', icon: FaBars, active: true }, // Kita set 'Menus' aktif
        { name: 'History', icon: FaHistory, active: false },
        { name: 'Wallet', icon: FaWallet, active: false },
        { name: 'Promotion', icon: FaTag, active: false },
    ];
    
    const generalItems = [
        { name: 'Settings', icon: FaCog },
        { name: 'Give Rating', icon: FaStar },
    ]

    return (
        <aside className="w-64 bg-white flex flex-col border-r">
            <div className="h-20 flex items-center justify-center border-b">
                <h1 className="text-2xl font-bold text-red-500">Foodyoow</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Menu Dashboard</p>
                {menuItems.map(item => (
                    <a key={item.name} href="#" className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        item.active ? 'bg-red-50 text-red-500' : 'text-gray-600 hover:bg-gray-100'
                    }`}>
                        <item.icon className={`mr-3 h-5 w-5 ${item.active ? 'text-red-500' : 'text-gray-400'}`} />
                        {item.name}
                    </a>
                ))}
                
                <p className="px-4 pt-4 text-xs font-semibold text-gray-400 uppercase">General</p>
                {generalItems.map(item => (
                    <a key={item.name} href="#" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                        <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                        {item.name}
                    </a>
                ))}
            </nav>
            {/* Dark/Light mode switcher bisa ditambahkan di sini */}
        </aside>
    );
}