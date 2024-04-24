export function saveToFile(content: string, fileName: string, mimeType: string = 'text/plain'): HTMLAnchorElement {
    const data = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(data);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    return link;
}