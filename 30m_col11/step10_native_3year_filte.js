// Filtro Espacial para Coleção LULC 10m - Sentinel

var nativeScale = 30; 
var min_mapped_pixels = 11
var min_forest_pixels = 5
var excessions_class = [23, 30,33,75,91]

var inputVersion = '0-4-12-spt-4'
var outputVersion = '0-4-13-w3y-4'

var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft';
var exportToAsset = true
var description = 'temporal filter com kernel 3 years'

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

Map.addLayer(col11.select('classification_2000'), vis_LULC, 'Col 11 : ' + inputVersion, false);
Map.addLayer(col11, {}, 'Col 11 : ' + inputVersion, false);

var anos = [
        2024,2023,2022,2021,2020,2019,2018,2017,2016,
   2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,
   2005,2004,2003,2002,2001,2000,1999,1998,1997,1996,
   1995,1994,1993,1992,1991,1990,1989,1988,1987,1986
            ];

var window3years = function(imagem, classe){
   var class_final = imagem.select('classification_2025')
   
   for (var i_ano=0;i_ano<anos.length; i_ano++){
     var ano = anos[i_ano];
     var class_ano = imagem.select('classification_'+ano)
     var mask_3 = imagem.select('classification_'+ (ano + 1)).neq(classe)
                .and(imagem.select('classification_'+ (ano)).eq(classe))
                .and(imagem.select('classification_'+ (ano - 1)).neq(classe))
     mask_3 = imagem.select('classification_'+ (ano - 1)).remap([3,22,13,12,11, 4,29,19, 9,21],[3,22,13,12,11, 4,29,19, 9,21]).updateMask(mask_3)
     var class_corr = class_ano.blend(mask_3.rename('classification_'+ (ano)))
     class_final = class_final.addBands(class_corr)
   }
   class_final = class_final.addBands(imagem.select('classification_1985'))
   return class_final
}

var filtered = window3years(col11, 3)
filtered = window3years(filtered, 4)
filtered = window3years(filtered, 11)
filtered = window3years(filtered, 12)
filtered = window3years(filtered, 29)

// Gera a lista de nomes de banda em ordem crescente: 1985 -> 2025
var anosOrdenados = ee.List.sequence(1985, 2025).map(function(y) {
  return ee.String('classification_').cat(ee.Number(y).int().format());
});

// Reordena as bandas do resultado final
var filtered_ordenado = filtered.select(anosOrdenados);

var biome = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biome_2025_buf5k_30m')
var filtered_ordenado_semPant = filtered_ordenado.blend(col11.mask(biome.remap([6],[1])))

Map.addLayer(filtered_ordenado_semPant.select('classification_2000'), vis_LULC, 'Filtro Espacial Aplicado');
Map.addLayer(filtered_ordenado_semPant, {}, 'Filtro Espacial Aplicado');

var ano_teste = 2000;

var banda_original = col11.select('classification_' + ano_teste);
var banda_filtrada = filtered_ordenado_semPant.select('classification_' + ano_teste);

// Máscara: 1 onde o pixel mudou, 0 onde é igual
var diff_2000 = banda_original.neq(banda_filtrada).selfMask();

Map.addLayer(diff_2000, {palette: ['red']}, 'Pixels alterados - ' + ano_teste);

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
                'image': filtered_ordenado_semPant
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
