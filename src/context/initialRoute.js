import React, { createContext, useState, useContext } from 'react';

const RouteModalContext = createContext();

export const RouteProvider = ({ children }) => {
    const [initialRoute, setInitialRoute] = useState('');
    const [isGettingInitialRoute, setIsGettingInitialRoute] = useState(false);

    return (
        <RouteModalContext.Provider value={{ initialRoute, setInitialRoute, setIsGettingInitialRoute, isGettingInitialRoute }}>
            {children}
        </RouteModalContext.Provider>
    );
};

export const useRoute = () => {
    const context = useContext(RouteModalContext);
    if (!context) {
        throw new Error('useRoute must be used within a RouteProvider');
    }
    return context;
};