export default function deepMerge(target: any, source: any) {
    const result = { ...target, ...source };
    for (const key of Object.keys(result)) {
        result[key] = typeof target[key] == 'object' && typeof source[key] == 'object'
            ? deepMerge(target[key], source[key])
            : structuredClone(result[key]);
    }
    return result;
}