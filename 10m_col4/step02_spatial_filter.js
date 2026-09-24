// Filtro Espacial para Coleção LULC 10m - Sentinel

var nativeScale = 10; 
var min_mapped_pixels = 25
var excessions_class = [23, 30,33,75,91]

var inputVersion = '0-04'
var outputVersion = '0-04-01-spt-1'


var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/INTEGRATION/classification-ft';
var exportToAsset = true
var description = 'spatial filter 25 pixels, com kernel 4'

// ==============================================================================
// 1. IMPORTAÇÃO DE MÓDULOS E PALETA DE CORES
// ==============================================================================
var Legend = require('users/joaovsiqueira1/packages:Legend.js');
var Palettes = require('users/mapbiomas/modules:Palettes.js');
var palette = Palettes.get('classification9');
// No MapBiomas, os valores das classes coincidem com os índices da paleta (0 a max)
var vis = {bands: 'classification_2024', min: 0, max: palette.length - 1, palette: palette };

// ==============================================================================
// 2. ASSETS DAS COLEÇÕES
// ==============================================================================
var s2_col3 = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/INTEGRATION/classification')
                 .filter(ee.Filter.eq('version', inputVersion)).mosaic()
print('s2_col3: ' + inputVersion, s2_col3)

Map.addLayer(s2_col3, vis, 'Col 3: ' + inputVersion, false);



// regra de integracao BAP
var bap = ee.FeatureCollection('projects/mapbiomas-territories/assets/TERRITORIES/BRAZIL/WORKSPACE/DHN250_LEVEL_1/DHN250_LEVEL_1_v2')
                                  .filter(ee.Filter.eq('LEVEL_2','PARAGUAI'))
Map.addLayer(bap)

var img = s2_col3

var years = ee.List.sequence(2017, 2025);

var bapImg = ee.Image.constant(1).clip(bap);

var imgreclass = ee.Image(
  years.iterate(function(year, acc){
    year = ee.Number(year);
    var bandName = ee.String('classification_').cat(year.format('%d'));
    var band = img.select(bandName);
    var reclassified = band.where(band.eq(6).and(bapImg), 3);
    return ee.Image(acc).addBands(reclassified);
  }, ee.Image([]))
);

var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis      = { min: 0, max: 68, palette: palettes.get('classification9') };


Map.addLayer(img.select('classification_2025'),vis,'orig')
Map.addLayer(imgreclass.select('classification_2025'),vis,'teste')



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

  // Filtro Específico (Classe 21): fragmentos com menos de 25 pixels (4-conn)
  var mode_21 = mode_img.mask(image.eq(21).and(connect_2.lte(min_mapped_pixels)));
  
  // 4. Composição final (Blending)
  var filtered = image
    .blend(mode_all) // Aplica a moda onde houver fragmentos pequenos gerais
    .blend(mode_21)  // Sobrepõe o tratamento para a classe 21
    .blend(image.remap(excessions_class,excessions_class))// Sobrepõe o tratamento de exceção (mais restrito)
  return filtered.rename(image.bandNames());
};


/**
 * Aplica filtro espacial para redução de ruído (Sieve Filter)
 * Substitui fragmentos pequenos pela moda da vizinhança de 9x9 pixels.
 */
var modeSpatialFilter3x3 = function (image) {
  // 2. Cria uma imagem de referência baseada na moda da vizinhança (kernel 9x9)
  // Esta imagem será usada para "preencher" os pixels isolados.
  var mode_img = image.focalMode(1, 'square', 'pixels');
  
  return mode_img;
};
//=============================================================================
// Script
//=============================================================================

// 1. Sua lista de anos (definida como um objeto do servidor para processamento paralelo)
var years = ee.List([2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]);
var multiBandMod = years.map(function(year) {
  // 1. Transformamos o ano em String (importante!)
  var yearString = ee.Number(year).format('%d');
  // 2. Criamos o nome exato da banda: 'classification_' + '2017'
  var bandName = ee.String('classification_').cat(yearString);
  var img_year = imgreclass.select([bandName])
  img_year = modeSpatialFilter(img_year,4)
  // img_year = modeSpatialFilter3x3(img_year)
  return img_year;
});

// 3. Converte a Lista de Imagens em uma única Imagem Multibanda
var finalImage = ee.ImageCollection.fromImages(multiBandMod).toBands();

// Limpar nomes das bandas (opcional, para remover o prefixo de indexação do toBands)
var newNames = years.map(function(y) { return ee.String('classification_').cat(ee.Number(y).format('%d')) });
finalImage = finalImage.rename(newNames);
print('finalImage', finalImage)


Map.addLayer(finalImage.select('classification_2025'), vis, 'Filtro Espacial Aplicado');

/**
  * Export to asset
  */
var assetGrids = 'projects/mapbiomas-workspace/AUXILIAR/cartas';

var grids = ee.FeatureCollection(assetGrids);

// cartas prioritárias
// var gridNames = [
//     "SF-23", "SD-23", "SC-24", "SH-22", "SE-21", "SA-23"
// ];

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
                'image': finalImage
                    .set('version', outputVersion)
                    .set('description', description)
                    .set('territory', 'BRAZIL')
                    .set('collection_id', 4.0),
                'description': gridName + '-' + outputVersion,
                'assetId': outputAsset + '/' + gridName + '-' + outputVersion,
                'pyramidingPolicy': {
                    ".default": "sample"
                },
                'region': grid.geometry().buffer(300).bounds(),
                'scale': nativeScale,
                'maxPixels': 1e13
            });
        }
    );
}
