export function parseJSONFromString(string) {
    try {
        return JSON.parse(string);
    } catch (err) {
        console.error(`Error parsing JSON: ${err.message}`);
        return null;
    }
}
