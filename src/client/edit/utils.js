export const copyCongig = (config) => {
  const res = {};
  for(let id in config) {
    const item = config[id];
    const field = item.field;
    delete item.field;
    delete item.id;
    res[field] = item;
  }
  const configString = JSON.stringify(res);
  var textarea = document.createElement("textarea");
  textarea.textContent = configString;
  textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy"); // Security exception may be thrown by some browsers.
  } catch (ex) {
    console.warn("Copy to clipboard failed.", ex);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}