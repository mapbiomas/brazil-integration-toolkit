// Filtro Espacial para Coleção LULC 10m - Sentinel

var nativeScale = 30

var inputVersion = '0-4-13-w3y-5'
var outputVersion = '0-4-14-c84-5'

var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft';
var exportToAsset = true
var description = 'ajuste de marisma e '

// ==============================================================================
// 1. IMPORTAÇÃO DE MÓDULOS E PALETA DE CORES
// ==============================================================================
var Palette = require('users/mapbiomas-global/LULC:LULC_palette.js');
var vis_LULC = Palette.get('vis_LULC');
// ==============================================================================
// 2. ASSETS DAS COLEÇÕES
// ==============================================================================
var col11 = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft')
                 .filter(ee.Filter.eq('version', inputVersion)).mosaic()
print('col11: ' + inputVersion, col11)

Map.addLayer(col11.select('classification_2025'), vis_LULC, 'Col 11 : ' + inputVersion);
Map.addLayer(col11, {}, 'Col 11 : ' + inputVersion, false);

var class_in = [1,3,4,7,5,6,49,10,11,12,32,29,50,84,13,14,15,18,19,39,20,40,62,41,36,46,47,35,48,9,21,22,23,24,30,75,91,25,26,33,31]
var class_out = [1,3,4,7,5,6,49,10,11,12,32,29,50,84,77,14,15,18,19,39,20,40,62,41,36,46,47,35,48,9,21,22,23,24,30,75,91,25,26,33,31]


var pampa = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/GENERAL/classification-pam-ft')
pampa = pampa.filter(ee.Filter.eq('version','8'))
print('pampa',pampa)
// marisma = 84

var eolica = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/RENEWABLE-ENERGY/solar-panels')
eolica = eolica.filter(ee.Filter.eq('version',3.0))
print(eolica)
var eolica_2025 = eolica.filter(ee.Filter.eq('year',2025)).mosaic()
Map.addLayer(eolica_2025, {}, 'eolica_2025');


// 1. Lista de anos
var years = ee.List([
  1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992,
  1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
  2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,
  2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
  2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 
  2025
]);

var multiBandMod = years.map(function(year) {
  year = ee.Number(year);
  var yearString = year.format('%d');
  var bandName = ee.String('classification_').cat(yearString);
  
  var img_year = col11.select([bandName]);
  var img_year_remap = img_year.remap(class_in, class_in);
  
  var pampa_year = pampa.filter(ee.Filter.eq('year', year)).mosaic();
  var pampa_marisma_year = pampa_year.remap([84], [84]).rename(bandName);
  
  // Definição do fluxo para anos >= 2016
  var eolica_year = eolica.filter(ee.Filter.eq('year', year)).mosaic();
  var eolica_75_year = eolica_year.remap([75], [75]).rename(bandName);
  
  // Imagem caso a condição seja VERDADEIRA (>= 2016)
  // Descomente os blends caso precise aplicar na imagem final
  // var img_ge_2016 = img_year_remap.remap([21], [21], 0); 
  var img_ge_2016 = img_year_remap.blend(pampa_marisma_year).blend(eolica_75_year);

  // Imagem caso a condição seja FALSA (< 2016)
  var img_lt_2016 = img_year_remap.blend(pampa_marisma_year);
  
  // Condicional Server-Side com Cast explícito para ee.Image
  var img_year_final = ee.Image(
    ee.Algorithms.If({
      condition: year.gte(2016),
      trueCase: img_ge_2016,
      falseCase: img_lt_2016
    })
  );

  return img_year_final.rename(bandName);
});

// 2. Conversão otimizada da lista para multibanda
// ee.ImageCollection(multiBandMod) é mais eficiente que ee.ImageCollection.fromImages()
var finalImage = ee.ImageCollection(multiBandMod).toBands();

// Limpar nomes das bandas
var newNames = years.map(function(y) { 
  return ee.String('classification_').cat(ee.Number(y).format('%d'));
});

finalImage = finalImage.rename(newNames);

print('finalImage', finalImage);

Map.addLayer(finalImage.select('classification_2025'), vis_LULC, 'Ajuste 2025');



/**
  * Export to asset
  */
var assetGrids = 'projects/mapbiomas-workspace/AUXILIAR/cartas';
var grids = ee.FeatureCollection(assetGrids);


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

// //  PANTANAL
// var gridNames = [
//     "SD-21", "SE-21", "SF-21",
// ];

if (exportToAsset) {
    gridNames.forEach(
        function (gridName) {
            var grid = grids.filter(ee.Filter.stringContains('grid_name', gridName));

            Export.image.toAsset({
                'image': finalImage
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
