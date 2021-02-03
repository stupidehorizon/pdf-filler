pdfjsLib.GlobalWorkerOptions.workerSrc = "/static/js/pdf.worker.js";

class Pdf {
  constructor() {
    this.totalPageNum = 1;
    this.currentRenderPageNum = 1;
    this.pdfDocument = null;
    this.scale = 1.5;

    this.init = this.init.bind(this);
    this.showPrevPage = this.showPrevPage.bind(this);
    this.showNextPage = this.showNextPage.bind(this);
  }

  init(url, container, setTotalPageCallBack) {
    this.pdfContainer = container;
    const canvas = document.createElement("canvas");
    this.renderCanvas = canvas;
    this.pdfContainer.appendChild(canvas);
    this.loadPdf(url, setTotalPageCallBack);
  }

  loadPdf(url, setTotalPageCallBack) {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdfDocument) => {
      this.pdfDocument = pdfDocument;
      this.totalPageNum = pdfDocument.numPages;
      setTotalPageCallBack(this.totalPageNum);
      this.renderPage();
    });
  }

  renderPage() {
    this.pdfDocument.getPage(this.currentRenderPageNum).then((page) => {
      const viewport = page.getViewport({ scale: this.scale });
      const canvas = this.renderCanvas;
      const context = canvas.getContext("2d");

      this.pdfContainer.style.height = viewport.height + "px";
      this.pdfContainer.style.width = viewport.width + "px";
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      page.render(renderContext).promise.then(() => {});
    });
  }

  showPrevPage(callback) {
    if (this.currentRenderPageNum <= 1) {
      return;
    }
    this.currentRenderPageNum--;
    callback && callback(this.currentRenderPageNum);
    this.renderPage();
  }

  showNextPage(callback) {
    if (this.currentRenderPageNum >= this.totalPageNum) {
      return;
    }
    this.currentRenderPageNum++;
    callback && callback(this.currentRenderPageNum);
    this.renderPage();
  }
}

export default Pdf;
