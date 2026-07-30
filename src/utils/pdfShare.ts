const safeFileName = (name: string) => name.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_');

export async function sharePdfFromElement(elementId: string, title: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('منطقة التقرير غير موجودة');
    return;
  }

  try {
    const { default: html2pdf } = await import('html2pdf.js');

    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print, button').forEach((el) => el.remove());
    clone.style.width = '720px';
    clone.style.maxWidth = '720px';
    clone.style.background = '#ffffff';
    clone.style.color = '#111111';
    clone.style.padding = '12px';
    clone.style.direction = 'rtl';
    clone.style.fontFamily = 'Cairo, Tahoma, Arial, sans-serif';
    clone.style.boxSizing = 'border-box';

    clone.querySelectorAll<HTMLElement>('.card, .app-card').forEach((el) => {
      el.style.boxShadow = 'none';
      el.style.background = '#ffffff';
    });

    clone.querySelectorAll<HTMLElement>('table').forEach((el) => {
      el.style.width = '100%';
      el.style.borderCollapse = 'collapse';
    });

    clone.querySelectorAll<HTMLElement>('th, td').forEach((el) => {
      el.style.fontSize = '10px';
      el.style.padding = '6px 3px';
    });

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-99999px';
    wrapper.style.top = '0';
    wrapper.style.width = '720px';
    wrapper.style.background = '#ffffff';
    wrapper.style.zIndex = '-1';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const blob = await html2pdf()
      .set({
        margin: [5, 5, 5, 5],
        filename: `${safeFileName(title)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 740 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(clone)
      .outputPdf('blob');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFileName(title)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    document.body.removeChild(wrapper);
  } catch (error) {
    console.error(error);
    alert('تعذرت مشاركة ملف PDF');
  }
}

export function printElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('منطقة التقرير غير موجودة');
    return;
  }
  window.print();
}
