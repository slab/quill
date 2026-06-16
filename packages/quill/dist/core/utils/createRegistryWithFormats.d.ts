import { Registry } from 'parchment';
declare const createRegistryWithFormats: (formats: string[], sourceRegistry: Registry, debug: {
    error: (errorMessage: string) => void;
}) => Registry;
export default createRegistryWithFormats;
