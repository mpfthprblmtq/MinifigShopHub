export const htmlDecode = (input: string): string => {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent ?? '';
}

export const cleanTextAreaList = (s: string): string => {
    return s?.replace(/(\r\n|\r|\n)/g, ',')
        .replace(/\s/g, ',')
        .replace(/,,/g, ',')
        .replace(/,,/g, ',')
        .replace(/,,/g, ',')
        .replace(/,,/g, ',');
}

export const getNumberFromResponseUrl = (url: string): string => {
    if (url.endsWith("-1")) {
        url = url.substring(0, url.length - 2);
    }
    const arr: string[] = url.split("/");
    return arr.at(arr.length - 1) ?? '';
}