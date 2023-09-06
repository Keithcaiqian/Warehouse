export default function downloadFile(content: string[], fileName: string) {
  const aTag = document.createElement('a');
  const blob = new Blob(content, { type: 'text/plain' });
  aTag.download = fileName;
  aTag.href = URL.createObjectURL(blob);
  aTag.click(); // 模拟点击
  URL.revokeObjectURL(blob as unknown as string);
  aTag.remove();
}
