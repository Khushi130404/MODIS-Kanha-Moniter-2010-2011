// Cloud masking using StateQA band
function maskMODISClouds(image) {
  var QA = image.select("StateQA");
  var cloudMask = QA.bitwiseAnd(3).eq(0); // 0 = clear
  return image.updateMask(cloudMask);
}
