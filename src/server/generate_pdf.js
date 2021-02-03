const puppeteer = require('puppeteer');

const generatePdf = async (pdfName, data, pdfFilePath) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  let width = undefined;
  let height = undefined;
  page.exposeFunction('updateSize', (w, h) => {
    width = w;
    height = h;
  });
  await page.goto(`http://localhost:3000/render?file=${pdfName}&data=${JSON.stringify(data)}`, {
    waitUntil: 'networkidle0'
  });
  await page.emulateMediaType('screen');
  await page.waitForSelector('.render-end');
  await page.pdf({path: pdfFilePath, width: `${width}px`, height: `${height}px`});
  await browser.close();
}

module.exports = generatePdf;
