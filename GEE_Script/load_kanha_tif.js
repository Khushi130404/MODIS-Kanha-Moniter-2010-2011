// ============================
// REGION
// ============================
var polygon = ee.Geometry.Polygon([
  [80.53, 22.05],
  [81.2, 22.05],
  [81.2, 22.45],
  [80.53, 22.45],
  [80.53, 22.05],
]);

// ============================
// DATE RANGE
// ============================
var startDate = "2010-02-01";
var endDate = "2011-06-30";

// ============================
// LOAD MODIS
// ============================
var ndviCol = ee
  .ImageCollection("MODIS/006/MOD09A1")
  .filterDate(startDate, endDate)
  .filterBounds(polygon)
  .map(maskMODISClouds)
  .map(addNDVI)
  .select("NDVI");

print("NDVI collection:", ndviCol);

// Convert ImageCollection to List
var ndviList = ndviCol.toList(ndviCol.size());
var count = ndviList.size().getInfo();

print("Total images:", count);

// CLIENT-SIDE LOOP (IMPORTANT)
for (var i = 0; i < count; i++) {
  var image = ee.Image(ndviList.get(i));
  var date = image.date().format("yyyy_MM_dd").getInfo();

  Export.image.toDrive({
    image: image.clip(polygon),
    description: "MODIS_NDVI_" + date,
    folder: "MODIS_NDVI_TIFS",
    fileNamePrefix: "MODIS_NDVI_" + date,
    region: polygon,
    scale: 500,
    crs: "EPSG:4326",
    maxPixels: 1e13,
  });
}
