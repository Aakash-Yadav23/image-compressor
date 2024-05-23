// components/Loader.tsx
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="loader border-t-4 border-b-4 border-white w-12 h-12 rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;
