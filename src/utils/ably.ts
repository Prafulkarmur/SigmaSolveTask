import Ably from 'ably';
import { useEffect, useState } from 'react';

const ably = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });

export const useChannel = (channelName: any, callbackOnMessage: any) => {
    const [channel, setChannel] = useState<any>(null);

    useEffect(() => {
        const newChannel = ably.channels.get(channelName);
        setChannel(newChannel);

        const handleMessage = (message: any) => {
            callbackOnMessage(message);
        };

        // Subscribe to the channel
        newChannel.subscribe('message', handleMessage);

        // Cleanup subscription when the component unmounts or when channelName changes
        return () => {
            newChannel.unsubscribe('message', handleMessage);
        };
    }, [channelName, callbackOnMessage]);  // Only re-run if channelName or callback changes

    const sendMessage = (message: any) => {
        if (channel) {
            channel.publish({ name: 'message', data: message });
        }
    };

    return { sendMessage };
};
