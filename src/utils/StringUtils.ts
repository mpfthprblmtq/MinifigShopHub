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

export const truncateString = (s: string, truncateAfter: number): string => {
    if (s.length <= truncateAfter) {
        return s;
    } else {
        return s.substring(0, truncateAfter - 3).concat('...');
    }
}