# ============================================================
# MODIS → ETM+ NDVI CORRECTION (Batch CSV Processing)
# ============================================================

# Load required library
library(dplyr)

# -----------------------------
# INPUT / OUTPUT FOLDERS
# -----------------------------
input_dir  <- "D:/MODIS_Kanha_Moniter_2010_2011/Data_Table_2/data_raw"              # folder with MODIS CSVs
output_dir <- "D:/MODIS_Kanha_Moniter_2010_2011/Data_Table/data_raw"     # folder to save corrected CSVs

# Create output folder if not exists
if (!dir.exists(output_dir)) {
  dir.create(output_dir, recursive = TRUE)
}

# -----------------------------
# CORRECTION FACTORS
# -----------------------------
a <- 0.013
b <- 0.976

# -----------------------------
# LIST ALL CSV FILES
# -----------------------------
csv_files <- list.files(
  path = input_dir,
  pattern = "\\.csv$",
  full.names = TRUE
)

# -----------------------------
# PROCESS EACH CSV
# -----------------------------
for (file in csv_files) {
  
  # Read CSV
  df <- read.csv(file, stringsAsFactors = FALSE)
  
  # Safety check
  if (!"median_ndvi" %in% names(df)) {
    warning(paste("Skipping file (median_ndvi not found):", file))
    next
  }
  
  # Apply MODIS → ETM+ correction
  df$median_ndvi <- a + b * df$median_ndvi
  
  # OPTIONAL: keep NDVI bounds safe
  df$median_ndvi[df$median_ndvi < -1] <- NA
  df$median_ndvi[df$median_ndvi > 1]  <- NA
  
  # Update sensor label (recommended)
  df$landsat <- "MODIS→ETM+"
  
  # Output filename (same name)
  out_file <- file.path(output_dir, basename(file))
  
  # Write CSV (same format)
  write.csv(df, out_file, row.names = FALSE)
  
  cat("✔ Corrected:", basename(file), "\n")
}

cat("✅ All MODIS CSVs converted to ETM+ scale successfully\n")
