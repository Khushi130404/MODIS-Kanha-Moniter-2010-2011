// ============================
// NDVI
// ============================
function addNDVI(image) {
  var ndvi = image
    .normalizedDifference(["sur_refl_b02", "sur_refl_b01"])
    .rename("NDVI");
  return image.addBands(ndvi);
}
