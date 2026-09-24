// Filtro Espacial para Coleção LULC 10m - Sentinel

var nativeScale = 30; 
var min_mapped_pixels = 11
var min_forest_pixels = 5
var excessions_class = [23, 30,33,75,91]

var inputVersion = '0-4-11-c25-4'
var outputVersion = '0-4-12-spt-4'

var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft';
var exportToAsset = true
var description = 'spatial filter 11 pixels, com kernel 3'

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

Map.addLayer(col11.select('classification_2025'), vis_LULC, 'Col 11 : ' + inputVersion, false);



/**
 * Aplica filtro espacial para redução de ruído (Sieve Filter)
 * Substitui fragmentos pequenos pela moda da vizinhança de 9x9 pixels.
 */
var modeSpatialFilter = function (image, kernel_size) {

  var projection = image.projection();

  // Forçamos a análise de conectividade na escala correta
  // Isso garante que "50 pixels" sejam sempre 50 pixels de 10m
  var imgForConnect = image.reproject({crs: projection, scale: nativeScale});
  
  // 1. Calcula o tamanho dos fragmentos (clusters de pixels idênticos)
  // connect_1: considera conexões diagonais (8-connected)
  // connect_2: apenas conexões ortogonais (4-connected)
  var connect_1 = imgForConnect.connectedPixelCount(50, true);
  var connect_2 = imgForConnect.connectedPixelCount(50, false);
  
  // 2. Cria uma imagem de referência baseada na moda da vizinhança (kernel 9x9)
  // Esta imagem será usada para "preencher" os pixels isolados.
  var mode_img = image.focalMode(kernel_size, 'square', 'pixels');
  
  // 3. Define máscaras para diferentes categorias ou tamanhos de fragmentos
  // Filtro Geral: fragmentos com menos de 25 pixels (8-conn)
  var mode_all = mode_img.mask(connect_1.lte(min_mapped_pixels));
  var forest = image.mask(connect_1.gte(min_forest_pixels));
  var mode_21 = mode_img.mask(connect_2.lte(min_mapped_pixels));
  
  // 4. Composição final (Blending)
  var filtered = image
    .blend(mode_all) // Aplica a moda onde houver fragmentos pequenos gerais
    .blend(mode_21.remap([21],[21]))  // Sobrepõe o tratamento para a classe 21
    .blend(forest.remap([3],[3]))  // Sobrepõe o tratamento para a classe 3
    .blend(image.remap(excessions_class,excessions_class))// Sobrepõe o tratamento de exceção (mais restrito)
    
  return filtered.rename(image.bandNames());
};

var biome = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biome_2025_buf5k_30m')


//=============================================================================
// Script
//=============================================================================

// 1. Sua lista de anos (definida como um objeto do servidor para processamento paralelo)
var years = ee.List([
            1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992,
            1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
            2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,
            2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
            2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
        ]);

var multiBandMod = years.map(function(year) {
  // 1. Transformamos o ano em String (importante!)
  var yearString = ee.Number(year).format('%d');
  
  // 2. Criamos o nome exato da banda: 'classification_' + '2017'
  var bandName = ee.String('classification_').cat(yearString);
  
  var img_year = col11.select([bandName])
  
  var img_year_spt = modeSpatialFilter(img_year, 3)
  var img_year_final = img_year_spt.blend(img_year.mask(biome.remap([6],[1])))
  // img_year = modeSpatialFilter3x3(img_year)
  
  return img_year_final;
});

// 3. Converte a Lista de Imagens em uma única Imagem Multibanda
var finalImage = ee.ImageCollection.fromImages(multiBandMod).toBands();

// Limpar nomes das bandas (opcional, para remover o prefixo de indexação do toBands)
var newNames = years.map(function(y) { return ee.String('classification_').cat(ee.Number(y).format('%d')) });
finalImage = finalImage.rename(newNames);
print('finalImage', finalImage)


Map.addLayer(finalImage.select('classification_2025'), vis_LULC, 'Filtro Espacial Aplicado');

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
