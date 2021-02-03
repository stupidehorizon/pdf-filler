import PdfFiller from "./pdffiller";
import qs from "query-string";


const parsed = qs.parse(window.location.search);
const filePath = parsed.file;
const data = JSON.parse(parsed.data);

if (filePath) {
  fetch(`./${filePath}.config.json`)
    .then((res) => res.json())
    .then((config) => {
      const pdffiller = new PdfFiller(`./${filePath}.pdf`, data, config);
    });
}
