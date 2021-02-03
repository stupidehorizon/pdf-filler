pdfjsLib.GlobalWorkerOptions.workerSrc = '/static/js/pdf.worker.js';


class PdfFiller {
  constructor(pdfUrl, pdfData, pdfConfig) {
    this.pdfData = pdfData;
    this.pdfConfig = pdfConfig;
    this.totalPageNum = 1;
    this.currentRenderPageNum = 1;
    this.pdfDocument = null;
    this.scale = 1.5;
    this.pdfContainer = document.querySelector('#container');

    this.loadPdf(pdfUrl);
  }

  loadPdf(url) {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdfDocument) => {
      this.pdfDocument = pdfDocument;
      this.totalPageNum = pdfDocument.numPages;
      this.renderPage();
    });
  }

  renderPage() {
    this.pdfDocument.getPage(this.currentRenderPageNum).then((page) => {
      const viewport = page.getViewport({ scale: this.scale });
      const canvas = this.fillData();
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      window.updateSize && window.updateSize(viewport.width, viewport.height)
  
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      page.render(renderContext).promise.then(() => {
        if(this.currentRenderPageNum < this.totalPageNum) {
          this.currentRenderPageNum++;
          this.renderPage();
        } else {
          this.renderFinished();
        }
      });
    })
  }

  fillData() {
    const page = document.createElement('div');
    page.setAttribute('class', 'page')
    const canvas = document.createElement('canvas');
    page.appendChild(canvas);

    for(let field in this.pdfConfig) {
      if(this.pdfConfig[field].page === this.currentRenderPageNum) {
        // now just text supported
        const span = this.fillField(this.pdfData[field], this.pdfConfig[field]);
        page.appendChild(span);
      }
    }

    this.pdfContainer.appendChild(page);
    return canvas;
  }

  fillField(text, config) {
    const span = document.createElement('span');
    span.setAttribute('class', 'text-item');
    span.innerText = text;
    span.setAttribute('style', `top: ${config.top}px;left:${config.left}px; font-size: ${config.fontSize}px; color: ${config.fontColor}`)
    return span;
  }

  renderFinished() {
    const div = document.createElement('div');
    div.setAttribute('class', 'render-end');
    document.body.appendChild(div);
  }
}

export default PdfFiller;
