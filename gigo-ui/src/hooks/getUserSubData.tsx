'use client'
import config from "@/config";
import { Subscription } from "@/models/subscription";
import { debounce } from "lodash";
import { useCallback } from "react";

// Singleton instance of the debounced function
const debouncedGetUserSubData = debounce(async (): Promise<Subscription | null> => {
    let subscription = await fetch(
        `${config.rootPath}/api/user/subscription`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: '{}',
            credentials: "include",
        },
    ).then((res) => res.json());

    if (subscription === undefined || subscription["message"] !== undefined) {
        return null
    }

    return subscription
}, 1000 * 3, {
    leading: true,
});

// Custom hook to use the singleton debounced function
export const useGetUserSubData = () => {
    return useCallback(
        () => debouncedGetUserSubData(),
        []
    );
};
