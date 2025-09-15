import { Loader2, Scale } from 'lucide-react';

const PageLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="relative mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto">
                        <Scale className="h-8 w-8 text-white" />
                    </div>
                    <Loader2 className="h-6 w-6 text-indigo-600 animate-spin absolute -bottom-1 -right-1" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <span className="text-indigo-600">न्याय</span>Sahay
                </h3>
                <p className="text-gray-500">Loading your secure connection...</p>
            </div>
        </div>
    );
};

export default PageLoader;