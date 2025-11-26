interface TimeoutToken {
    cancelled: boolean;
}
interface IntervalToken {
    cancelled: boolean;
    delayedEvent: DelayedCallbackEvent | null;
}
export declare function setTimeout(callback: () => void, timeMs: number): TimeoutToken;
export declare function clearTimeout(timerId: TimeoutToken | undefined | null): void;
export declare function setInterval(callback: () => void, timeMs: number): IntervalToken;
export declare function clearInterval(intervalId: IntervalToken | undefined | null): void;
export {};
