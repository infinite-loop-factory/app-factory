/**
 * Downloads a Blob as a file in the browser.
 * This function is web-only and should only be called when Platform.OS === "web".
 *
 * @param blob - The Blob to download
 * @param filename - The filename for the downloaded file
 */
export const downloadBlobAsFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
