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
    qrCodesContainer.appendChild(qrCodeContainer);

    const qrCode = new QRCode(qrCodeContainer, {
      text: `https://www.ppol.io/u/${code}`, // URL generada para el código
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });

    // Obtiene la imagen del código QR y la usa para el enlace de descarga
    const qrImage = qrCodeContainer.querySelector('img');
    
    // Crear un elemento de enlace de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = qrImage.src;
    downloadLink.download = `${code}.${formatSelect}`;
    downloadLink.textContent = `Descargar QR`;
    qrCodeContainer.appendChild(downloadLink);
    
    // Agregar un manejador de clic para la descarga
    downloadLink.addEventListener('click', () => {
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
        
        // Crear un enlace temporal para la descarga de la imagen PNG
        const pngDownloadLink = document.createElement('a');
        pngDownloadLink.href = url;
        pngDownloadLink.download = `${code}.png`;
        pngDownloadLink.click();
        
        // Liberar la URL del Blob
        window.URL.revokeObjectURL(url);
      }, 'image/png');
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

