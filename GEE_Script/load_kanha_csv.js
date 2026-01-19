// ============================
// MODIS NDVI Time Series Export
// ============================

// Define your polygon region
var polygon = geometry2;

// Date range
var startDate = "2010-02-01";
var endDate = "2011-06-30";

// Load MODIS Surface Reflectance
var modisSR = ee
  .ImageCollection("MODIS/061/MOD09A1")
  .filterDate(startDate, endDate)
  .filterBounds(polygon)
  .map(maskMODISClouds)
  .map(addNDVI)
  .select("NDVI");

// Convert each image to Feature with desired columns
var ndviTimeSeries = modisSR.map(function (image) {
  var meanNDVI = image
    .reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: polygon,
      scale: 500,
    })
    .get("NDVI");

  var date = image.date();

  return ee.Feature(null, {
    date: date.format("dd-MM-yyyy"),
    year: date.format("yyyy"),
    month: date.format("M"),
    day: date.format("d"),
    median_ndvi: meanNDVI,
    landsat: "MODIS", // Label as MODIS
  });
});

// Print to console to check
print("NDVI Time Series (formatted):", ndviTimeSeries);

// Export as CSV
Export.table.toDrive({
  collection: ndviTimeSeries,
  description: "MODIS_NDVI_2010_2011",
  folder: "GEE_Exports",
  fileFormat: "CSV",
});
