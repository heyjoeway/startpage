export function download(text: string, filename: string, type: string) {
    const blob = new Blob([text], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export async function upload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.click();
    const file = await new Promise<File | null>(resolve => {
        input.onchange = () => {
            resolve(input.files?.[0] || null);
        };
    });
    if (!file) return;
    const text = await file.text();
    return text;
}