export const getCountryFromIso2Code = (country: string | undefined): string => {
    if (country) {
        const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
        return regionNames.of(country) ?? '';
    }
    return '';
}