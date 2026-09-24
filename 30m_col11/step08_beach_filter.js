// Import MapBiomas color schema
var Palette = require('users/mapbiomas-global/LULC:LULC_palette.js');
var vis_LULC = Palette.get('vis_LULC');
var nativeScale = 30; 

var exportToAsset = true;

// Set out directory
var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft';
var description = 'Filter to remove 25 that touch 23 or 50';
// Set metadata
var inputVersion = '0-4-11-amz-4';
var outputVersion = '0-4-11-c25-5';

// 1. Carregamos a coleção original como um mosaico global limpo (sem clips aqui!)
var class_orig = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification-ft')
                     .filter(ee.Filter.eq('version', inputVersion))
                     .mosaic();

/**
 * Filtro espacial pos-integracao — preenchimento de "ilhas" (versao flood-fill)
 * ---------------------------------------------------------------------------
 * MapBiomas Brazil — Collection 11 (Landsat, 30 m)
 *
 * Objetivo:
 *   Identificar "ilhas" de uma classe (ex: 25 — area nao vegetada) que estejam
 *   TOTALMENTE cercadas por uma ou mais classes de entorno (ex: 23 — praia/duna
 *   e 50 — restinga) e reclassifica-las para uma classe alvo fixa.
 *
 *   Exemplo: ilha de 25 cercada por 23 e/ou 50  ->  vira 23.
 *
 * Diferenca para island_fill_filter.js:
 *   A versao original usa connectedComponents/reduceConnectedComponents, cujo
 *   parametro maxSize e limitado a (0, 1024] pelo GEE => ilhas com mais de 1024
 *   pixels nunca sao preenchidas. Esta versao substitui a rotulagem de componentes
 *   por FLOOD-FILL (reconstrucao morfologica via cumulativeCost), que NAO tem
 *   limite de tamanho, e remove o cap maxSize: o cerco total (+requireAll) e o
 *   discriminador. Resultados identicos a versao original para ilhas <= 1024 px.
 *
 * Caracteristicas:
 *   - Configuravel por REGRA: islandClass, neighborClasses[], requireEnclosed, requireAll, targetClass.
 *   - Aplicado a CADA ano (classification_1985 ... classification_2025).
 *   - Aplicado a CADA regra (em sequencia sobre a banda do ano).
 *   - requireEnclosed controla o criterio espacial:
 *       true (padrao)  -> ilha TOTALMENTE circundada pelas classes de entorno
 *                         (nenhum pixel do patch toca outra classe ou nodata).
 *       false          -> basta o patch TOCAR as classes de entorno (pode tambem
 *                         tocar outras classes); NAO exige cerco total.
 *     No modo enclosed, pixels mascarados (nodata) contam como "proibido" => ilha
 *     na borda dos dados NAO e preenchida. Preenche ilhas de QUALQUER tamanho.
 *   - requireAll controla a semantica das classes vizinhas:
 *       false / ausente (OR) -> basta a ilha ser cercada por QUALQUER combinacao
 *                               das classes de entorno (ex: so 23, ou so 50, ou ambas).
 *       true (AND)           -> a COMBINACAO e obrigatoria: TODAS as classes de
 *                               neighborClasses devem aparecer no entorno da ilha
 *                               (ex: precisa existir 23 E 50 ao redor).
 *
 * Este e um SCRIPT DE TESTE: visualiza antes/depois e deixa o Export comentado.
 * ---------------------------------------------------------------------------
 */

// ===========================================================================
// 1. Configuracao
// ===========================================================================


var YEAR_START  = 1985;
var YEAR_END    = 2025;
var BAND_PREFIX = 'classification_';

var VIS_YEAR    = 2020;          // ano usado nas camadas antes/depois

// Distancia maxima (em metros) de propagacao do flood-fill. Deve EXCEDER o maior
// diametro geodesico esperado de uma ilha; do contrario o interior distante de
// uma ilha grande nao seria marcado como contaminado.
//
// CUSTO: o cumulativeCost puxa um halo do tamanho de maxDistance em todas as
// bordas de cada tile do export => quanto maior, mais redundancia e mais lento.
// As ilhas-alvo (classe 25 cercada por praia/restinga) sao costeiras e pequenas,
// portanto 5 km (~167 px a 30 m) ja excede com folga o maior diametro esperado e
// reduz o custo ~6x frente aos 30 km originais.
var SPREAD_MAX_DISTANCE = 5000;

// Cada regra e independente; sao aplicadas EM SEQUENCIA sobre a banda do ano,
// portanto a ordem importa quando duas regras puderem afetar a mesma area.
var RULES = [
  // { islandClass: 25, neighborClasses: [23,50], requireEnclosed: false, requireAll: true, targetClass: 50 },
  { islandClass: 25, neighborClasses: [23], requireEnclosed: false, requireAll: true, targetClass: 23 },
];


// Lista de anos (client-side) para montar a imagem multibanda.
var YEARS = [];
for (var y = YEAR_START; y <= YEAR_END; y++) { YEARS.push(y); }

// ===========================================================================
// 3. Nucleo do algoritmo
// ===========================================================================

/**
 * Flood-fill geodesico: retorna 1 onde um pixel e alcancavel a partir de 'seed'
 * viajando SOMENTE por dentro de 'mask'. Usa cumulativeCost (custo 1 dentro da
 * mask, barreira fora) => sem limite de tamanho (ao contrario de connectedComponents).
 * @param {ee.Image} seed  mascara de origem (pixels semente)
 * @param {ee.Image} mask  mascara por onde a propagacao pode viajar
 * @return {ee.Image}      mascara 0/1 dos pixels de 'mask' alcancados a partir de 'seed'
 */
function spreadThroughMask(seed, mask) {
  var reachable = mask.selfMask().cumulativeCost({
    source: seed.selfMask(),
    maxDistance: SPREAD_MAX_DISTANCE,
    geodeticDistance: false
  }).mask();                          // mascara do cumulativeCost = 1 onde alcancado
  return reachable.and(mask);
}

/**
 * Aplica UMA regra de preenchimento de ilha a uma banda (um ano).
 * @param {ee.Image} bandImage  imagem de banda unica (classes do ano)
 * @param {Object}   rule       { islandClass, neighborClasses[], requireEnclosed, requireAll, targetClass }
 *                              requireEnclosed=true (padrao): ilha TOTALMENTE circundada;
 *                              false: basta o patch TOCAR as classes de entorno.
 *                              requireAll=true exige que TODAS as classes de neighborClasses
 *                              estejam presentes no entorno (AND); false/ausente = OR.
 * @return {ee.Image}           a banda corrigida (mesmo nome de banda)
 */
function applyRule(bandImage, rule) {
  // (a) Mascara da ilha e do entorno.
  var island = bandImage.eq(rule.islandClass);

  var neighborOnes = rule.neighborClasses.map(function () { return 1; });
  var neighbors = bandImage.remap(rule.neighborClasses, neighborOnes, 0);

  var requireEnclosed = (rule.requireEnclosed !== false);  // default true
  var selected = island;                                   // criterios abaixo restringem

  // (b) Cerco total (apenas no modo enclosed). "Proibido" = qualquer outra classe OU
  //     nodata (island/neighbor -> 0 ; outras classes -> 1 ; nodata -> 1). Propaga
  //     "contaminacao" a partir dos pixels-ilha que tocam proibido por toda a ilha
  //     conexa; pixel-ilha NAO alcancado pertence a patch totalmente cercado.
  if (requireEnclosed) {
    var forbidden = island.or(neighbors).unmask(0).not();
    var forbiddenAdj = forbidden.focal_max({radius: 1, kernelType: 'square', units: 'pixels'});
    var contaminated = spreadThroughMask(island.and(forbiddenAdj), island);
    selected = selected.and(contaminated.not());
  }

  // (c) Presenca das classes de entorno (propaga "o patch toca a classe X" pela ilha).
  if (rule.requireAll) {
    // AND: o patch deve tocar TODAS as classes de neighborClasses.
    rule.neighborClasses.forEach(function (cls) {
      var adjCls = bandImage.eq(cls)
        .focal_max({radius: 1, kernelType: 'square', units: 'pixels'});
      selected = selected.and(spreadThroughMask(island.and(adjCls), island));
    });
  } else if (!requireEnclosed) {
    // OR + modo "touch": o patch deve tocar AO MENOS UMA classe de entorno.
    // (No modo enclosed, o cerco ja garante contato com as classes de entorno.)
    var neighborAdj = neighbors.focal_max({radius: 1, kernelType: 'square', units: 'pixels'});
    selected = selected.and(spreadThroughMask(island.and(neighborAdj), island));
  }

  // (d) Reclassifica a ilha selecionada para a classe alvo fixa.
  return bandImage.where(selected, rule.targetClass);
}

/**
 * Aplica TODAS as regras (em sequencia) a banda de um ano.
 * @param {number} year
 * @return {ee.Image} banda unica renomeada classification_<year>
 */
function filterYear(year) {
  var bandName = BAND_PREFIX + year;
  var band = class_orig.select(bandName);
  RULES.forEach(function (rule) {
    band = applyRule(band, rule);
  });
  return band.rename(bandName).toUint8();
}

// ===========================================================================
// 4. Montagem da imagem multibanda filtrada
// ===========================================================================

var filtered = ee.Image.cat(YEARS.map(filterYear));

// ===========================================================================
// 5. Visualizacao antes/depois
// ===========================================================================

// Paleta MapBiomas (classes 0..69; classes sem cor especifica ficam cinza).
// Destaques relevantes a este filtro: 23 praia/duna, 25 area nao vegetada, 50 restinga.
var PALETTE = [
  '#ffffff','#32a65e','#32a65e','#1f8d49','#7dc975','#04381d','#026975','#000000',
  '#000000','#7a5900','#d6bc74','#519799','#d6bc74','#d6bc74','#ffefc3','#edde8e',
  '#000000','#000000','#e974ed','#c27ba0','#db7093','#ffefc3','#d4271e','#ffa07a',
  '#d4271e','#db4d4f','#0000ff','#000000','#000000','#ffaa5f','#9c0027','#091077',
  '#fc8114','#2532e4','#000000','#9065d0','#d082de','#000000','#000000','#f5b3c8',
  '#c71585','#f54ca9','#000000','#000000','#000000','#000000','#d68fe2','#9932cc',
  '#e6ccff','#02d659','#ad5100','#000000','#000000','#000000','#000000','#000000',
  '#000000','#000000','#000000','#000000','#000000','#000000','#ff69b4','#000000',
  '#000000','#000000','#000000','#000000','#000000','#000000'
];
var VIS = {min: 0, max: 69, palette: PALETTE};

var beforeBand = class_orig.select(BAND_PREFIX + VIS_YEAR);
var afterBand  = filtered.select(BAND_PREFIX + VIS_YEAR);
var changed    = afterBand.neq(beforeBand);

Map.addLayer(beforeBand, VIS, 'antes ' + VIS_YEAR);
Map.addLayer(afterBand,  VIS, 'depois ' + VIS_YEAR);
Map.addLayer(changed.selfMask(), {palette: ['#ff0000']}, 'pixels alterados ' + VIS_YEAR);

/**
  * Export to asset
  */
var assetGrids = 'projects/mapbiomas-workspace/AUXILIAR/cartas';

var grids = ee.FeatureCollection(assetGrids);
var grids_litora = grids.selectBounds
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
                'image': filtered
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

