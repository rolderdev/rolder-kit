const combineStyles = (main: any, override: any) => {
    let result = { ...main };
    let ov = { ...override };
    if (typeof override == "object") {
        Object.assign(result, ov);
    }
    return result;
}

const calculateWidth = (total: number = 0, totalElements: number) => {
    let width = (100 - total) / totalElements;
    return width + "%";
}

const sumOfArray = (array?: number[]) => {
    if (Array.isArray(array)) {
        return array.reduce((a, b) => a + b, 0);
    }
    return 0;
}

export default {
    combineStyles,
    calculateWidth,
    sumOfArray,
}