export const determineEnvironment = (): string => {
  const url = document.URL;
  if (url.startsWith('http://localhost')) {
    return 'Local';
  } else if (url.includes("-staging")) {
    return 'Staging';
  } else {
    return '';
  }
}