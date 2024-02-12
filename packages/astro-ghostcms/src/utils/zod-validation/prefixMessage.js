import { PREFIX } from './config';
export function prefixMessage(message, prefix, prefixSeparator) {
    if (prefix !== null) {
        if (message.length > 0) {
            return [prefix, message].join(prefixSeparator);
        }
        return prefix;
    }
    if (message.length > 0) {
        return message;
    }
    return PREFIX;
}
