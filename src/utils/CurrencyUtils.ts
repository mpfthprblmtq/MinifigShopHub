export const formatCurrency = (s: string | number | undefined) => {
    // create the formatter for en-US
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    // do some cleanup to make sure we get the right thing
    // if s is 0, then let's change it to a string, so we get $0.00 instead of a blank string
    s = s === 0 ? '0.00' : s;

    // format it
    const formatted = s ? formatter.format(+s) : '';

    // if it's still blank somehow, return 0.00 explicitly
    return formatted ? formatted : formatter.format(+'0.00');
};

export const launderMoney = (s: string): number => {
    return +s.trim()
        .replace(",", "")
        .replace(" ", "")
        .replace("$", "");
};

export const roundToNearestFive = (n: number): number => {
    return Math.round(n / 5) * 5;
}