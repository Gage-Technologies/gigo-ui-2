'use client'
import config from "@/config";
import { debounce } from "lodash";
import { useCallback } from "react";

// Singleton instance of the debounced function
const debouncedRetrieveProUrls = debounce(async (): Promise<{ basic: string, advanced: string, max: string } | null> => {
    let res = await fetch(
        `${config.rootPath}/api/stripe/premiumMembershipSession`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: '{}',
            credentials: 'include'
        }
    ).then(res => res.json())

    if (res !== undefined && res["basic"] !== undefined && res["advanced"] !== undefined && res["max"] !== undefined) {
        return {
            "basic": res["basic"],
            "advanced": res["advanced"],
            "max": res["max"],
        }
    }

    return null
}, 1000 * 60 * 5, {
    leading: true,
});

// Custom hook to use the singleton debounced function
export const useGetProUrls = () => {
    return useCallback(
        () => debouncedRetrieveProUrls(),
        []
    );
};
