// ---------------------------------------------------------------------------
// 16_spatialShapeFilter
// post-processing filter: remove small and irregular class-21 patches
//
// @author: barbara.silva@ipam.org.br
// ---------------------------------------------------------------------------

// Import MapBiomas color schema
var Palette = require('users/mapbiomas-global/LULC:LULC_palette.js');
var vis_LULC = Palette.get('vis_LULC');
var nativeScale = 10; 

var exportToAsset = true

// Set out directory
var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/INTEGRATION/classification-ft';
var description = 'Filter to remove 21'
// Set metadata
var inputVersion = '0-04-01-spt-1'
var outputVersion = '0-04-02-c21-1'

// Set input classification
var classificationInput = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/INTEGRATION/classification-ft')
                 .filter(ee.Filter.eq('version', inputVersion)).mosaic()
                 
print('Input classification', classificationInput);
Map.addLayer(classificationInput.select('classification_2025'), vis_LULC, 'Input classification', false);

// Set years
var startYear = 2017;
var endYear = 2025;
var years = ee.List.sequence(startYear, endYear);

// Set target class
var targetClass = 21;

// Set patch-size threshold
var maxPatchHa = 1.0;

// Set the maximum connected-object size in pixels
var maxObjectPixels = 128;

// Set shape threshold
// Fill ratio is the object pixel count divided by the bounding-box pixel count
var minFillRatio = 0.65;

// Set thinness criterion
// Patches without any 3x3 core are interpreted as thin or fragmented
var useNoCoreCriterion = true;

// Set speckle criterion
// Set this to false to preserve very small but compact class-21 patches
var removeVerySmallSpeckles = true;
var maxSpecklePixels = 3;

// Set spatial replacement context
// The replacement class is calculated from surrounding non-21 and non-zero pixels
var contextRadiusMeters = 150;

// Set connectedness
// A square kernel with radius 1 defines 8-connected objects
var connectednessKernel = ee.Kernel.square(1);

// Function to get annual band names
var getBand = function(year) {
  return ee.String('classification_').cat(ee.Number(year).format('%d'));
};

// Set annual band names
var bands = years.map(function(year) {
  return getBand(year);
});

// Function to select one annual band
var sel = function(img, year) {
  return img.select(getBand(year));
};

// Function to rebuild a multiband image from annual outputs
var make = function(yearList, fn) {
  var imgs = yearList.map(function(year) {
    return ee.Image(fn(ee.Number(year))).rename('classification').toInt16();
  });

  var names = yearList.map(function(year) {
    return getBand(year);
  });

  return ee.ImageCollection.fromImages(imgs).toBands().rename(names);
};

// Select annual classification bands
var classification = classificationInput.select(bands);

// Function to calculate object metrics for class-21 patches
var getPatchMetrics = function(classificationYear) {
  var class21 = classificationYear.eq(targetClass).selfMask().rename('class21');

  // Label connected class-21 objects
  var labels = class21.connectedComponents({
    connectedness: connectednessKernel,
    maxSize: maxObjectPixels
  }).select('labels');

  var validObjects = labels.mask();

  // Count pixels per object
  var one = ee.Image(1).updateMask(validObjects).rename('one');

  var patchPixels = one.addBands(labels)
    .reduceConnectedComponents({
      reducer: ee.Reducer.sum(),
      labelBand: 'labels',
      maxSize: maxObjectPixels
    })
    .rename('patch_pixels');

  // Calculate area in hectares per object
  var patchAreaHa = ee.Image.pixelArea().divide(10000)
    .updateMask(validObjects)
    .rename('area_ha')
    .addBands(labels)
    .reduceConnectedComponents({
      reducer: ee.Reducer.sum(),
      labelBand: 'labels',
      maxSize: maxObjectPixels
    })
    .rename('patch_area_ha');

  // Calculate bounding-box fill ratio in pixel space
  var coords = ee.Image.pixelCoordinates(classificationYear.projection());

  var x = coords.select('x').updateMask(validObjects).rename('x');
  var y = coords.select('y').updateMask(validObjects).rename('y');

  var minX = x.addBands(labels).reduceConnectedComponents({
    reducer: ee.Reducer.min(),
    labelBand: 'labels',
    maxSize: maxObjectPixels
  });

  var maxX = x.addBands(labels).reduceConnectedComponents({
    reducer: ee.Reducer.max(),
    labelBand: 'labels',
    maxSize: maxObjectPixels
  });

  var minY = y.addBands(labels).reduceConnectedComponents({
    reducer: ee.Reducer.min(),
    labelBand: 'labels',
    maxSize: maxObjectPixels
  });

  var maxY = y.addBands(labels).reduceConnectedComponents({
    reducer: ee.Reducer.max(),
    labelBand: 'labels',
    maxSize: maxObjectPixels
  });

  var bboxPixels = maxX.subtract(minX).add(1).multiply(maxY.subtract(minY).add(1)).rename('bbox_pixels');
  var fillRatio = patchPixels.divide(bboxPixels).rename('fill_ratio');

  // Identify 3x3 class-21 cores
  var class21Binary = classificationYear.eq(targetClass).unmask(0).rename('class21_binary');

  var core = class21Binary
    .reduceNeighborhood({
      reducer: ee.Reducer.min(),
      kernel: ee.Kernel.square(1)
    })
    .eq(1)
    .updateMask(validObjects)
    .rename('core');

  var corePixels = core.addBands(labels)
    .reduceConnectedComponents({
      reducer: ee.Reducer.sum(),
      labelBand: 'labels',
      maxSize: maxObjectPixels
    })
    .rename('core_pixels');

  return ee.Image.cat([
    labels.rename('labels'),
    patchPixels,
    patchAreaHa,
    bboxPixels,
    fillRatio,
    corePixels
  ]);
};

// Function to create the removal mask for class-21 patches
var getRemovalMask = function(classificationYear, metrics) {
  var patchAreaHa = metrics.select('patch_area_ha');
  var patchPixels = metrics.select('patch_pixels');
  var fillRatio = metrics.select('fill_ratio');
  var corePixels = metrics.select('core_pixels');

  // Select class-21 patches within the area threshold
  var smallPatch = patchAreaHa.lte(maxPatchHa);

  // Identify irregular patches using bounding-box fill ratio
  var lowFill = fillRatio.lt(minFillRatio);
  var suspiciousShape = lowFill;

  // Add the no-core criterion when enabled
  if (useNoCoreCriterion) {
    var noCore = corePixels.eq(0).and(patchPixels.gt(maxSpecklePixels));
    suspiciousShape = suspiciousShape.or(noCore);
  }

  // Add the very-small-speckle criterion when enabled
  if (removeVerySmallSpeckles) {
    var tinySpeckle = patchPixels.lte(maxSpecklePixels);
    suspiciousShape = suspiciousShape.or(tinySpeckle);
  }

  return classificationYear.eq(targetClass).and(smallPatch).and(suspiciousShape);
};

// Function to apply the spatial shape filter to one annual band
var applySpatialShapeFilterOneYear = function(classificationYear) {
  var metrics = getPatchMetrics(classificationYear);
  var removalMask = getRemovalMask(classificationYear, metrics);

  // Calculate replacement class from surrounding non-21 and non-zero pixels
  var replacementContext = classificationYear.updateMask(classificationYear.neq(targetClass).and(classificationYear.neq(0)));

  var contextMode = replacementContext.focalMode(contextRadiusMeters, 'circle', 'meters');

  // Apply correction only where a valid replacement exists
  var validReplacement = contextMode.mask();
  var finalRemovalMask = removalMask.and(validReplacement);

  var corrected = classificationYear
    .where(finalRemovalMask, contextMode.unmask(classificationYear))
    .rename('classification')
    .toInt16();

  return corrected;
};

// Apply the spatial shape filter to the full time series
var outputClassification = make(years, function(year) {
  return applySpatialShapeFilterOneYear(sel(classification, year));
});

// Set diagnostic year
var diagnosticYear = 2024;

// Build diagnostic layers
var diagnosticClassification = sel(classification, diagnosticYear);
var diagnosticOutput = sel(outputClassification, diagnosticYear);
var diagnosticMetrics = getPatchMetrics(diagnosticClassification);
var diagnosticRemovalMask = getRemovalMask(diagnosticClassification, diagnosticMetrics);

var diagnosticCandidate = diagnosticClassification.eq(targetClass).and(diagnosticMetrics.select('patch_area_ha').lte(maxPatchHa));
var diagnosticRemoved = diagnosticClassification.eq(targetClass).and(diagnosticOutput.neq(targetClass));

Map.addLayer(diagnosticRemoved.selfMask(), {}, 'Diagnostic ' + diagnosticYear + ': removed class-21 pixels', false);
Map.addLayer(outputClassification.select('classification_2025'), vis_LULC, 'Output spatial shape filter 21');


/**
  * Export to asset
  */
var assetGrids = 'projects/mapbiomas-workspace/AUXILIAR/cartas';

var grids = ee.FeatureCollection(assetGrids);
Map.addLayer(grids)

// completo Brasil
var gridNames = [
    "NA-19", "NA-20", "NA-21", "NA-22", "NB-20", "NB-21", "NB-22", "SA-19",
    "SA-20", "SA-21", "SA-22", "SA-23", "SA-24", "SB-18", "SB-19", "SB-20",
    "SB-21", "SB-22", "SB-23", "SB-24", "SB-25", "SC-18", "SC-19", "SC-20",
    "SC-21", "SC-22", "SC-23", "SC-24", "SC-25", "SD-20", "SD-21", "SD-22",
    "SD-23", "SD-24", "SE-20", "SE-21", "SE-22", "SE-23", "SE-24", "SF-21",
    "SF-22", "SF-23", "SF-24", "SG-21", "SG-22", "SG-23", "SH-21", "SH-22",
    "SI-22"
];

var Noronha = ee.Geometry.Polygon(
        [[[-32.39813721783363, -3.7009040056259925],
          [-32.50250733502113, -3.7461269425935826],
          [-32.57391846783363, -3.8009394879897984],
          [-32.575291758849254, -3.9064437873957676],
          [-32.531346446349254, -3.9790559440135125],
          [-32.432469493224254, -3.9941255933979],
          [-32.322606211974254, -3.9502858486436696],
          [-32.26355469830238, -3.8817816195434087],
          [-32.253941661193004, -3.7502380032205873],
          [-32.289647227599254, -3.7104969437176587],
          [-32.347325450255504, -3.6926814045633525]]]);


if (exportToAsset) {
    gridNames.forEach(
        function (gridName) {
            if (gridName == "SB-25") {
              var grid = grids.filter(ee.Filter.stringContains('grid_name',gridName));
              grid = grid.merge(Noronha)
            } else {
              var grid = grids.filter(ee.Filter.stringContains('grid_name',gridName));
            }
            Export.image.toAsset({
                'image': outputClassification
                    .set('version', outputVersion)
                    .set('description', description)
                    .set('territory', 'BRAZIL')
                    .set('collection_id', 4),
                'description': gridName + '-' + outputVersion,
                'assetId': outputAsset + '/' + gridName + '-' + outputVersion,
                'pyramidingPolicy': {
                    ".default": "mode"
                },
                // 'overwrite': true,
                'region': grid.geometry().buffer(300).bounds(),
                'scale': nativeScale,
                'maxPixels': 1e13
            });
        }
    );
}
