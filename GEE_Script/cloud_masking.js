// ============================
// CLOUD MASK (MOD09A1 v6)
// ============================
function maskMODISClouds(image) {
  var qa = image.select("StateQA");
  var cloudFree = qa.bitwiseAnd(3).eq(0); // bits 0–1
  return image.updateMask(cloudFree);
}
