'use client'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/reducers/store'
import {Persistor} from "redux-persist/es/types";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";

export default function StoreProvider({
                                          children
                                      }: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore>()
    const persistorRef = useRef<Persistor>()
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        const s = makeStore();
        storeRef.current = s;
        // @ts-ignore
        persistorRef.current = persistStore(s);
    }

    return (
        <Provider store={storeRef.current}>
            {persistorRef.current ? (
                <PersistGate loading={null} persistor={persistorRef.current}>
                    {children}
                </PersistGate>
            ) : children}
        </Provider>
    )
}