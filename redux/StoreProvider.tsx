// redux/StoreProvider.tsx
'use client';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import AuthBootstrap from './AuthBootstrap';

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Correctly instantiate the store once per request lifecycle
    const [store] = useState<AppStore>(() => makeStore());

    return (
        <Provider store={store}>
            <AuthBootstrap />
            {children}
        </Provider>
    );
}
