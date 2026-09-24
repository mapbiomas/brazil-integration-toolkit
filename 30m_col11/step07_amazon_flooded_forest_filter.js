// Import MapBiomas color schema
var Palette = require('users/mapbiomas-global/LULC:LULC_palette.js');
var vis_LULC = Palette.get('vis_LULC');
var nativeScale = 30; 

var exportToAsset = true

// Set out directory
var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft';
var description = 'Filter to remove 21'
// Set metadata
var inputVersion = '0-4-10-agr-2'
var outputVersion = '0-4-11-amz-2'

// Set input classification
var col11_ft = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft')
                 .filter(ee.Filter.eq('version', inputVersion)).mosaic()
                 
print('Input classification', col11_ft);
Map.addLayer(col11_ft.select('classification_2025'), vis_LULC, 'Input classification', false);

var ano = 1995;

var Palette = require('users/mapbiomas-global/LULC:LULC_palette.js');
var vis_LULC = Palette.get('vis_LULC');

print(col11_ft);

Map.addLayer(col11_ft, {}, 'integracao historia do pixel', false);
//Map.addLayer(col11_ft.reduce(ee.Reducer.countDistinct()), imageVisParam, 'count integracao', false)
Map.addLayer(col11_ft.select("classification_" + ano), vis_LULC, 'integracao ' + ano);


// --------------------------------------------------------------------------------

/**
 * Regra de transição para classes mutuamente exclusivas.
 * Pixels cuja série temporal contém APENAS classes da lista alvo
 * têm todos os anos substituídos pela moda dessas classes.
 *
 * @param {ee.Image} image   - ex: col11_ft com bandas classification_1985..2025
 * @param {Array}    classes - ex: [3, 5, 6]
 * @returns {ee.Image}       - mesma estrutura de bandas, valores corrigidos
 */
function applyForestTransitionRule(image, classes) {
  var bandNames = image.bandNames();

  // 1. Máscara: todas as bandas do pixel pertencem às classes alvo?
  var isTargetClass = ee.ImageCollection(
    classes.map(function(c) { return image.eq(c); })
  ).sum().gt(0);  // 1 onde o pixel é ALGUMA das classes alvo, 0 caso contrário

  // allBandsAreTarget = verdadeiro somente se NENHUMA banda fugiu das classes alvo
  var allBandsAreTarget = isTargetClass.reduce(ee.Reducer.allNonZero());

  // 2. Moda: conta ocorrências de cada classe alvo ao longo das 41 bandas
  var counts = classes.map(function(c) {
    return image.eq(c).reduce(ee.Reducer.sum());
  });

  // Empilha as contagens e acha qual classe tem mais ocorrências
  var countStack = ee.ImageCollection(counts).toBands();  // shape: [pixels × n_classes]

  // Constrói a imagem de moda comparando contagens par a par
  var modeImage = ee.Image.constant(classes[0]);
  var maxCount  = counts[0];
  for (var i = 1; i < classes.length; i++) {
    modeImage = modeImage.where(ee.Image(counts[i]).gt(maxCount),
                                ee.Image.constant(classes[i]));
    maxCount  = maxCount.max(counts[i]);
  }

  // 3. Aplica: substitui só os pixels onde a série é "pura" (só classes alvo)
  //    Pixels com qualquer outra classe em qualquer ano ficam intactos
  return image.where(allBandsAreTarget, modeImage)
              .rename(bandNames)
              .copyProperties(image, image.propertyNames());
}

// ── Uso ──────────────────────────────────────────────────────────────────────
var resultado = ee.Image(applyForestTransitionRule(col11_ft, [3, 5, 6]));

// Inspeciona um ano específico para validar
Map.addLayer(resultado, {}, 'filtro aplicado historia do pixel', false);
Map.addLayer(resultado.select("classification_" + ano), vis_LULC, 'filtro [3,5,6] integracao ' + ano);

// =======================================================

// Pixels impactados: alguma banda mudou entre original e resultado
var impacted = col11_ft.neq(resultado)          // 1 onde mudou, por banda
                       .reduce(ee.Reducer.max()) // 1 se mudou em QUALQUER ano
                       .rename('impacted');

Map.addLayer(
  impacted.selfMask(),                           // oculta os 0s (não impactados)
  {min: 0, max: 1, palette: ['ff0000']},
  'pixels impactados [3,5,6] ' + ano
);


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
    "SC-21", "SC-22", "SC-23", "SC-24", "SC-25", "SD-20", "SD-22",
    "SD-23", "SD-24", "SE-20", "SE-21", "SE-22", "SE-23", "SE-24", "SF-21",
    "SF-22", "SF-23", "SF-24", "SG-21", "SG-22", "SG-23", "SH-21", "SH-22",
    "SI-22", "SD-21", 
];

if (exportToAsset) {
    gridNames.forEach(
        function (gridName) {
            var grid = grids.filter(ee.Filter.stringContains('grid_name', gridName));

            Export.image.toAsset({
                'image': resultado
                    .set('version', outputVersion)
                    .set('description', description)
                    .set('territory', 'BRAZIL')
                    .set('collection_id', 11),
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
