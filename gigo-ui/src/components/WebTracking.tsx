'use client'
import React, { useEffect, useRef, ReactNode } from 'react';
import { useTracking } from 'react-tracking';
import { RecordWebUsage, WebTrackingEvent } from '../models/web_usage';
import config from '../config';
import { usePathname, useSearchParams } from 'next/navigation';

interface WebTrackingProps {
    children?: ReactNode; // Adding children to props
}

const WebTracking: React.FC<WebTrackingProps> = ({ children }) => {
    const { trackEvent } = useTracking({}, {
        dispatch: (data: any) => {
            fetch(
                `${config.rootPath}/api/recordUsage`,
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            )
        }
    });
    const enterTimeRef = useRef<number>(Date.now());
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isMobile = searchParams.get('viewport') === 'mobile';

    useEffect(() => {
        // Store the current time when the component mounts
        enterTimeRef.current = Date.now();

        const payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.PageVisit,
            timespent: 0,
            path: pathname,
            latitude: null,
            longitude: null,
            metadata: {
                mobile: isMobile,
                width: window.innerWidth,
                height: window.innerHeight,
                user_agent: navigator.userAgent,
                referrer: document.referrer,
            },
        }
        trackEvent(payload);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this effect is only run on mount and unmount

    // Add window event listeners to catch when the user navigates away or closes the page
    useEffect(() => {
        const handleBeforeUnload = () => {
            const timeSpent = (Date.now() - enterTimeRef.current); // Time in millis
            const payload: RecordWebUsage = {
                host: window.location.host,
                event: WebTrackingEvent.PageExit,
                timespent: timeSpent,
                path: pathname,
                latitude: null,
                longitude: null,
                metadata: {
                    mobile: isMobile,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    user_agent: navigator.userAgent,
                    referrer: document.referrer,
                }
            }

            // Convert payload to a string
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

            // Use navigator.sendBeacon to send the data to the server
            navigator.sendBeacon(config.rootPath + '/api/recordUsage', blob);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{children}</>; // Return children to render them
};

export default WebTracking;
