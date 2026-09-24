// ---------------------------------------------------------------------------
// @author: kenia.mourao@remapgeo.com
// Refatorado para otimização de escopo (Bioma Pampa)
// ---------------------------------------------------------------------------

// Import MapBiomas color schema
var Palette = require('users/mapbiomas-global/LULC:LULC_palette.js');
var vis_LULC = Palette.get('vis_LULC');
var nativeScale = 30; 

var exportToAsset = true;

// Set out directory
var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft';
var description = 'Filter converte natural para 5 anos de 21 após agricultura - Pampa';
// Set metadata
var inputVersion = '0-4-2-c21_1';
var outputVersion = '0-4-3-c5a-2';

// Set input classification
var classificationInput = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft')
                 .filter(ee.Filter.eq('version', inputVersion)).mosaic();
                 
print('Input classification', classificationInput);

var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biome_2025_buf5k_30m');
var biome_pampa = biomes.remap([5],[1]); // 5 = Pampa

// Range de anos
var ANO_INICIO = 1985;
var ANO_FIM    = 2025;
var JANELA_MAX = 5;
var CLASSE_21  = 21;
var PROTEGIDAS_POS_AGRIC = [9, 15, 23, 24, 27, 30, 33];

var bandNames = [];
for (var y = ANO_INICIO; y <= ANO_FIM; y++) {
  bandNames.push('classification_' + y);
}

var ordered = classificationInput.select(bandNames);

// ──── OTIMIZAÇÃO: Mascarar a imagem ANTES do processamento pesado ────
// Isso restringe o processamento dos iterates apenas aos pixels do Pampa.
var orderedPampa = ordered.updateMask(biome_pampa.eq(1));

var anosServerList = ee.List.sequence(ANO_INICIO, ANO_FIM);

// ── Regra 1: 5 anos seguintes a QUALQUER agricultura (Apenas no Pampa)
var resultadoRegra1 = ee.Image(
  anosServerList.iterate(function(anoServerSide, imgAcc) {
    imgAcc = ee.Image(imgAcc);
    var ano = ee.Number(anoServerSide);
    var bandAtualName = ee.String('classification_').cat(ano.format('%d'));

    var isAgricAno = imgAcc.select(bandAtualName)
      .eq(39).or(imgAcc.select(bandAtualName).eq(40))
      .or(imgAcc.select(bandAtualName).eq(41));

    var resultadoOffsets = ee.List.sequence(1, JANELA_MAX).iterate(function(offsetSS, innerAcc) {
      innerAcc = ee.Image(innerAcc);
      var offset = ee.Number(offsetSS);
      var anoDestino = ano.add(offset);

      var bandDestinoName = ee.String('classification_').cat(anoDestino.format('%d'));
      var existeNoRange = anoDestino.lte(ANO_FIM);

      var bandDestino = ee.Algorithms.If(
        existeNoRange,
        innerAcc.select([bandDestinoName]),
        ee.Image(0)
      );
      bandDestino = ee.Image(bandDestino);

      var naoProtegida = PROTEGIDAS_POS_AGRIC.reduce(function(acc, val) {
        return acc.and(bandDestino.neq(val));
      }, ee.Image(1));

      var bandDestinoEhAgric = bandDestino.eq(39).or(bandDestino.eq(40)).or(bandDestino.eq(41));

      var condicao = isAgricAno
        .and(naoProtegida)
        .and(bandDestinoEhAgric.not())
        .and(ee.Image(existeNoRange));

      var novaBanda = bandDestino.where(condicao, CLASSE_21).rename(bandDestinoName);

      return ee.Algorithms.If(
        existeNoRange,
        innerAcc.addBands(novaBanda, null, true),
        innerAcc
      );
    }, imgAcc);

    return ee.Image(resultadoOffsets);
  }, orderedPampa) // Passando a imagem mascarada aqui
);

var filteredPampa = resultadoRegra1.select(bandNames);

// ── Recomposição: Unmask traz de volta o restante do Brasil original ──
var img_final = filteredPampa.unmask(ordered);

Map.addLayer(img_final.select('classification_2025'), vis_LULC, 'Pampa Alterado + Brasil Original');

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

// var gridNamesPampa = ["SH-21", "SH-22", "SI-22"];

// //  MINERAÇÃO
var gridNames = [
    "SA-21","SA-22","SB-21","SB-22","SC-21","SC-22",
];


if (exportToAsset) {
    gridNames.forEach(
        function (gridName) {
            var grid = grids.filter(ee.Filter.stringContains('grid_name', gridName));

            Export.image.toAsset({
                'image': img_final
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
