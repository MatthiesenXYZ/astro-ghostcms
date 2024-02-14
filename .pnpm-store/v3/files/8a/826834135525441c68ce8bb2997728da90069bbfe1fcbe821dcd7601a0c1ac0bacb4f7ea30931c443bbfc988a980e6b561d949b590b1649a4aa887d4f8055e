export interface Settings {
    disableAppNotification: boolean;
    verbose: boolean;
}
export declare const defaultSettings: {
    disableAppNotification: false;
    verbose: false;
};
export declare const settings: {
    readonly config: Settings;
    updateSetting: (key: keyof Settings, value: boolean) => void;
    logger: {
        log: (message: string) => void;
        verboseLog: (message: string) => void;
    };
};
