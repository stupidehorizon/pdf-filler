const os = require("os");
const fs = require("fs");
const { promisify } = require("util");
const {exec} = require('child_process');
const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const path = require("path");
const { uuid } = require("uuidv4");

const bodyParser = require("koa-bodyparser");
const generatePdf = require("./generate_pdf");

const deleteFile = promisify(fs.unlink);

const app = new Koa();
const router = new Router();

app.use(bodyParser({ jsonLimit: "10mb" }));
// static file server
app.use(serve(path.join(__dirname, "..", "..", "dist")));

router.post("/pdf", async (ctx, next) => {
  const {
    template,
    filename = uuid(),
    data = {},
  } = ctx.request.body;

  const pdfFilePath = path.join(os.tmpdir(), `${filename}.pdf`);

  await generatePdf(template, data, pdfFilePath);
  
  ctx.body = pdfFilePath;
  return;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
