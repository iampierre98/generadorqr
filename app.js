document.addEventListener("DOMContentLoaded", function() {
  const codeInput = document.getElementById('codeInput');
  const formatSelect = document.getElementById('formatSelect');
 
  const generateButton = document.getElementById("generateButton");
  generateButton.addEventListener("click", generateQRCodes);

  const downloadAllButton = document.getElementById("downloadAllButton");
  downloadAllButton.addEventListener("click", () => downloadAllQRCodes(formatSelect.value));
});


function generateQRCodes() {
  const codesInput = document.getElementById('codeInput').value;
  const formatSelect = document.getElementById('formatSelect').value;
  const codesList = codesInput.split(',').map(code => code.trim());

  const qrCodesContainer = document.getElementById('qrCodeContainer');
  qrCodesContainer.innerHTML = '';

  for (const code of codesList) {
    if (code.length !== 8 || isNaN(code)) {
      console.log(`El código '${code}' no tiene 8 dígitos numéricos y será omitido.`);
      continue;
    }

    const qrCodeContainer = document.createElement('div');
    qrCodeContainer.style.marginBottom = '20px';
    qrCodesContainer.appendChild(qrCodeContainer);

    const qrCode = new QRCode(qrCodeContainer, {
      text: `https://www.ppol.io/u/${code}`,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });

    const qrImage = qrCodeContainer.querySelector('img');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = qrImage.src;
    downloadLink.download = `${code}.${formatSelect}`;
    qrCodeContainer.appendChild(downloadLink);
    
    downloadLink.addEventListener('click', () => {
      if (formatSelect === 'svg') {
        // Obtener el contenido SVG del código QR
        const svgContent = qrCodeContainer.querySelector('svg').outerHTML;

        // Crear un Blob con el contenido SVG
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });

        // Crear un objeto URL para el Blob SVG
        const svgUrl = window.URL.createObjectURL(svgBlob);

        // Crear un enlace temporal para la descarga del SVG
        const svgDownloadLink = document.createElement('a');
        svgDownloadLink.href = svgUrl;
        svgDownloadLink.download = `${code}.svg`;
        svgDownloadLink.click();

        // Liberar la URL del Blob SVG
        window.URL.revokeObjectURL(svgUrl);
      } else if (formatSelect === 'png') {
        const canvas = document.createElement('canvas');
        canvas.width = qrImage.width;
        canvas.height = qrImage.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(qrImage, 0, 0, qrImage.width, qrImage.height);

        canvas.toBlob(blob => {
          const url = window.URL.createObjectURL(blob);

          const pngDownloadLink = document.createElement('a');
          pngDownloadLink.href = url;
          pngDownloadLink.download = `${code}.png`;
          pngDownloadLink.click();

          window.URL.revokeObjectURL(url);
        }, 'image/png');
      }
    });
  }
}


function downloadAllQRCodes(format) {
  const qrCodeContainers = document.querySelectorAll('#qrCodeContainer > div');
  qrCodeContainers.forEach((container, index) => {
    const qrImage = container.querySelector('img');
    
    // Crear un lienzo temporal para convertir la imagen a PNG
    const canvas = document.createElement('canvas');
    canvas.width = qrImage.width;
    canvas.height = qrImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(qrImage, 0, 0, qrImage.width, qrImage.height);
    
    // Convertir el lienzo a un Blob en formato PNG
    canvas.toBlob(blob => {
      // Crear un objeto URL para el Blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear un enlace temporal para la descarga
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${index}.${format}`;
      downloadLink.click();
      
      // Liberar la URL del Blob
      window.URL.revokeObjectURL(url);
    }, 'image/png');
  });
}


