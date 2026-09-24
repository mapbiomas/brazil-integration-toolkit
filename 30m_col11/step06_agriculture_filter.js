// Import MapBiomas color schema
var Palette = require('users/mapbiomas-global/LULC:LULC_palette.js');
var vis_LULC = Palette.get('vis_LULC');
var nativeScale = 30; 

var exportToAsset = true

// Set out directory
var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft';
var description = 'Filter to remove 21'
// Set metadata
var inputVersion = '0-4-9-tra-3'
var outputVersion = '0-4-10-agr-3'

// Set input classification
var image = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft')
                 .filter(ee.Filter.eq('version', inputVersion)).mosaic()
                 
print('Input classification', image);
Map.addLayer(image.select('classification_2025'), vis_LULC, 'Input classification', false);

var ANO_INICIO = 1985;
var ANO_FIM    = 2025;
var ALVO       = 21;
var DESTINO    = [46, 47, 48];

var bandNames = [];
for (var y = ANO_INICIO; y <= ANO_FIM; y++) {
  bandNames.push('classification_' + y);
}

var ordered = image.select(bandNames);
var nAnos   = bandNames.length;

// ── Passo 1: Identificar, por pixel, o id da classe perene
//    que aparece primeiro ao longo da série ─────────────────────
var destinoMask = ordered.eq(46).or(ordered.eq(47)).or(ordered.eq(48));
var destinoValues = ordered.updateMask(destinoMask);
var firstPerene = destinoValues.reduce(ee.Reducer.firstNonNull())
  .rename('first_perene');

// ── Passo 2: Identificar o índice (posição) do primeiro ano
//    de classe perene, por pixel ──────────────────────────────────
var firstPereneIndex = ee.Image(9999).rename('index');

for (var i = 0; i < nAnos; i++) {
  var band = ordered.select(bandNames[i]);
  var isPerene = band.eq(46).or(band.eq(47)).or(band.eq(48));

  firstPereneIndex = firstPereneIndex.where(
    isPerene.and(firstPereneIndex.eq(9999)),
    ee.Image(i)
  );
}

// ── Passo 3: Construir o bloco contíguo de 21 (de trás para frente)
//    igual à lógica original ──────────────────────────────────────
var blocoContiguo = [];
for (var k = 0; k < nAnos; k++) {
  blocoContiguo.push(ee.Image(0));
}

for (var i = nAnos - 2; i >= 0; i--) {
  var band_i = ordered.select(bandNames[i]);
  var is21   = band_i.eq(ALVO);
  var idx    = ee.Image(i);

  var nextIsFirstPerene = firstPereneIndex.eq(i + 1);
  var nextIsBloco        = blocoContiguo[i + 1];

  var isBloco = is21.and(nextIsFirstPerene.or(nextIsBloco))
                    .and(idx.lt(firstPereneIndex));

  blocoContiguo[i] = isBloco;
}

// ── Passo 4: Identificar o PRIMEIRO ano do bloco contíguo ─────────
// Um ano k é "primeiro do bloco" se blocoContiguo[k] é true E
// blocoContiguo[k-1] é false (ou k é o primeiro ano da série)
var primeiroDoBloco = [];

for (var k = 0; k < nAnos; k++) {
  if (k === 0) {
    // Não há ano anterior — se k=0 está no bloco, é automaticamente o primeiro
    primeiroDoBloco.push(blocoContiguo[k]);
  } else {
    var anteriorNaoEhBloco = blocoContiguo[k - 1].not();
    primeiroDoBloco.push(blocoContiguo[k].and(anteriorNaoEhBloco));
  }
}

// ── Passo 5: Aplicar remap — manter 21 apenas no primeiro ano
//    do bloco; os demais anos do bloco viram a classe perene ──────
var remappedBands = [];

for (var i = 0; i < nAnos; i++) {
  var imgAtual = ordered.select(bandNames[i]);

  // Substituir por perene apenas se: está no bloco E NÃO é o primeiro ano
  var deveRemapearParaPerene = blocoContiguo[i].and(primeiroDoBloco[i].not());

  var remapped = imgAtual
    .where(deveRemapearParaPerene, firstPerene)
    .rename(bandNames[i]);

  remappedBands.push(remapped);
}

var remapped = ee.Image.cat(remappedBands);

// ── Visualização ─────────────────────────────────────────────────

var Palettes = require('users/mapbiomas/modules:Palettes.js');
var paletteC8 = Palettes.get('classification8');

var year = 2010

Map.addLayer(image, {palette: paletteC8, min:0, max: 62, bands: ['classification_' + year]}, 'MapBiomas C10v2', false)



Map.addLayer(
  remapped.selfMask(), {palette: paletteC8, min:0, max: 62, bands: ['classification_' + year]}, 'MapBiomas filtrado', false
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

// var gridNames = [
// "SC-21",
// ];

// //  MINERAÇÃO
// var gridNames = [
//     "SA-21","SA-22","SB-21","SB-22","SC-21","SC-22",
// ];



if (exportToAsset) {
    gridNames.forEach(
        function (gridName) {
            var grid = grids.filter(ee.Filter.stringContains('grid_name', gridName));

            Export.image.toAsset({
                'image': remapped
                    .set('version', outputVersion)
                    .set('description', description)
                    .set('territory', 'BRAZIL')
                    .set('collection_id', 11),
                'description': gridName + '-' + outputVersion,
                'assetId': outputAsset + '/' + gridName + '-' + outputVersion,
                'pyramidingPolicy': {
                    ".default": "mode"
                },
                'overwrite': true,
                'region': grid.geometry().buffer(300).bounds(),
                'scale': nativeScale,
                'maxPixels': 1e13
            });
        }
    );
}
