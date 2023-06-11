export const formatDate = (dateString: string | undefined): string => {
    // const options = { year: "numeric", month: "long", day: "numeric"}
    if (dateString) {
        return new Date(dateString).toLocaleDateString();
    }
    return '';
};