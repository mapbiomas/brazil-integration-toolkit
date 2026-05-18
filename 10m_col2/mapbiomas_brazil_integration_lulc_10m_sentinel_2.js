
/**
 * @name
 *      MapBiomas Integration Toolkit 
 * 
 * @description
 *  
 * @author
 *      João Siqueira
 *      joaovsiqueira1@gmail.com
 *
 * @version
 *  1.0.0
 *  1.1.0 - Atualização dos dados da coleção 2
 *  1.2.0 - Atualização dos dados da coleção 3
 */
var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/INTEGRATION/classification';
var outputVersion = '0-1';
var description = '# Sentinel-2 Collection 3.0 (Collection 10.0)\n' +
    "### Output Version:" + outputVersion + " \n" +
    "| Layer             | Version | Uptade date           | User              |\n" +
    "|:------------------|--------:|:----------------------|:------------------|\n" +
    "| Amazônia          | 1       | November 15           |                   |\n" +
    "| Caatinga          | 6       | November 15           |                   |\n" +
    "| Cerrado           | 6       | November 12           |                   |\n" +
    "| Mata Atlântica    | 23a     | November 12           |                   |\n" +
    "| Pampa             | 5       | November 15           |                   |\n" +
    "| Pantanal          | 1       | November 12           |                   |\n" +
    "| Mineração         | 5       | November 17           |                   |\n" +
    "| Aquicultura       | 1       | November 12           |                   |\n" +
    "| Zona Costeira     | 1       | November 14           |                   |\n" +
    "| Agricultura       | 1       | November 12           |                   |\n" +
    "| Floresta Plantada | 1       | November 12           |                   |\n" +
    "| Pastagem          | 1a      | November 12           |                   |\n" +
    "| Urbano            | 1       | November 12           |                   |\n";
"| Fotovoltaica      | 1       | November 15           |                   |\n";

var exportToAsset = true;

// import modules
var Legend = require('users/joaovsiqueira1/packages:Legend.js');
var Palettes = require('users/mapbiomas/modules:Palettes.js');

var palette = Palettes.get('classification9');

var App = {

    options: {
        // app version
        version: '1.11.0',

        logo: {
            uri: 'gs://mapbiomas-public/mapbiomas-logos/mapbiomas-logo-horizontal.b64',
            base64: null
        },

        assets: [
            // biomes data
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-amz-ft',
                'territory': 'AMAZONIA',
                'type': 'classification_singleband_collection',
                'version': '1',
                'theme': 'AMAZONIA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-caa-ft',
                'territory': 'CAATINGA',
                'type': 'classification_singleband_collection',
                'version': '6',
                'theme': 'CAATINGA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-cer-ft',
                'territory': 'CERRADO',
                'type': 'classification_singleband_collection',
                'version': '6',
                'theme': 'CERRADO'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-mat-ft',
                'territory': 'MATAATLANTICA',
                'type': 'classification_multiband_collection',
                'version': '23a',
                'theme': 'MATAATLANTICA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-pam-ft',
                'territory': 'PAMPA',
                'type': 'classification_singleband_collection',
                'version': '5',
                'theme': 'PAMPA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/GENERAL/classification-pan-ft',
                'territory': 'PANTANAL',
                'type': 'classification_multiband_collection',
                'version': '1',
                'theme': 'PANTANAL'
            },
            // transversal data
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/AGRICULTURE/classification-ft',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '1',
                'theme': 'AGRICULTURA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/AGRICULTURE/classification-ft',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '1',
                'theme': 'FLORESTAPLANTADA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/PASTURE/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '1a', //28.10.2024
                'theme': 'PECUARIA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/COASTAL-ZONE/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '1',
                'theme': 'ZONACOSTEIRA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/AQUACULTURE/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '2',
                'theme': 'AQUICULTURA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/MINING/classification-ft',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': 7,
                'theme': 'MINERACAO'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/URBAN/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': 1,
                'theme': 'INFRAURBANA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-3/SOLAR-PANELS/classification/raster-solar-panel-br-10m',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_image',
                'version': 1,
                'theme': 'PHOTOVOLTAIC'
            },
            // mosaic data
            {
                'asset_id': 'projects/mapbiomas-mosaics/assets/SENTINEL/BRAZIL/mosaics-3',
                'territory': 'BRAZIL',
                'type': 'mosaic',
                'version': '3',
                'theme': 'MOSAIC'
            },
            // other
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': '1',
                'theme': 'COLLECTION101'
            },
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc_10m/collection2/mapbiomas_10m_collection2_integration_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': '1',
                'theme': 'SENTINEL20'
            },
            // {
            //     'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO9/biomes-coastal-zone-raster',
            //     'territory': 'BRAZIL',
            //     'type': 'classification_singleband_image',
            //     'version': null,
            //     'theme': 'BIOMES'
            // },
            {
                'asset_id': 'projects/mapbiomas-territories/assets/TERRITORIES-OLD/LULC/BRAZIL/COLLLECTION2/WORKSPACE/dashbaord_sentinel',
                'territory': 'BRAZIL',
                'type': 'territory_singleband_collection',
                'version': 1,
                'categ_id': 4,
                'theme': 'BIOMES'
            },
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO7/state-raster',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'STATES'
            },
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/areas-protegidas-cerrado-itg',
                'territory': 'CERRADO',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'CER_AP'
            },
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/caatinga-irece-raster', //camada revisa para a coleção 9.0
                'territory': 'CAATINGA',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'CAATINGA_IRECE'
            },
            // {
            //     'asset_id': 'projects/mapbiomas-workspace/TRANSVERSAIS/COLECAO8/agricultura-irrigada',
            //     'territory': 'BRAZIL',
            //     'type': 'classification_singleband_collection',
            //     'version': '1',
            //     'theme': 'AGRICULTURAIRRIGADA'
            // },
            // {
            //     'asset_id': 'projects/mapbiomas-workspace/COLECAO9/agua',
            //     'territory': 'BRAZIL',
            //     'type': 'classification_singleband_collection',
            //     'version': '4',
            //     'theme': 'AGUA'
            // },
            // {
            //     'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/pampa-regions-raster',
            //     'territory': 'PAMPA',
            //     'type': 'classification_singleband_image',
            //     'version': null,
            //     'theme': 'PAMPAREGIONS'
            // },
            // {
            //     'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO6/level_2_drainage_basin_pnrh_per_biome-raster',
            //     'territory': 'CAATINGA',
            //     'type': 'classification_singleband_image',
            //     'version': null,
            //     'theme': 'BACIAS_L2'
            // },

            // {
            //     'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/bLPeixe_col8-raster',
            //     'territory': 'PAMPA',
            //     'type': 'classification_singleband_image',
            //     'version': null,
            //     'theme': 'PAMPA_LAGOA_PEIXES'
            // },

            // {
            //     'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/pantanal-agriculture-regions',
            //     'territory': 'PANTANAL',
            //     'type': 'classification_singleband_image',
            //     'version': null,
            //     'theme': 'PANTANAL_AGRICULTURA'
            // },
            // {
            //     'asset_id': 'projects/mapbiomas-workspace/COLECAO9/agricultura-soja-acumulada',
            //     'territory': 'BRAZIL',
            //     'type': 'classification_multiband_image',
            //     'version': null,
            //     'theme': 'SOJA_ACUMULADA'
            // },
        ],

        'territory_id': {
            amz: 1,
            caa: 2,
            cer: 3,
            mat: 4,
            pam: 5,
            pan: 6,
        },

        year: '2023',

        layers: [],
        checkboxs: [],

        data: {
            'classification': null,
            'integration': null,
            'mosaics': null,
            'biomes': null,
            'collection31': null,
            'collection41': null,
            'collection50': null,
            'collection60': null,
            'collection70': null,
            'collection71': null,
            'collection80': null,
            'COLLECTION101': null,
            'states': null,
            'incidentes': null,
            'difference': null,
        },


        vis: {
            'integration': {
                'min': 0,
                'max': 69,
                'palette': palette,
                'format': 'png'
            },

            'mosaic': {
                'bands': ['swir1_median', 'nir_median', 'red_median'],
                'gain': [0.08, 0.06, 0.2],
                'gamma': 0.65
            },

            'vectors': {
                'color': 'ff0000',
                'fillColor': '00000000',
                'width': 2
            },

            'esri': {
                'min': 1,
                'max': 10,
                'palette': [
                    "#1A5BAB", // Water
                    "#358221", // Trees
                    "#A7D282", // Grass
                    "#87D19E", // Flooded Vegetation
                    "#FFDB5C", // Crops
                    "#EECFA8", // Scrub/Shrub
                    "#ED022A", // Built Area
                    "#EDE9E4", // Bare Ground
                    "#F2FAFF", // Snow/Ice
                    "#C8C8C8", // Cloud
                ],
                'format': 'png'
            },
            'incidents': {
                'min': 0,
                'max': 8,
                'palette': [
                    "#C8C8C8",
                    "#FED266",
                    "#FBA713",
                    "#cb701b",
                    "#cb701b",
                    "#a95512",
                    "#a95512",
                    "#662000",
                    "#662000",
                    "#cb181d"
                ],
                'format': 'png'
            },
            'states': {
                'min': 1,
                'max': 5,
                'palette': [
                    "#C8C8C8",
                    "#AE78B2",
                    "#772D8F",
                    "#4C226A",
                    "#22053A"
                ],
                'format': 'png'
            },
            'difference': {
                'min': 0,
                'max': 1,
                'palette': [
                    '#ffffff',
                    '#000000'
                ],
                'format': 'png',
                'opacity': 0.8
            },

        },

        'prevalenceList': [],

        'legend': { //TODO: revisar a legenda para a coleção 8.0
            'params': {
                "title": null,
                "layers": [
                    [palette[0], 0, 'Ausência de dados'],
                    [palette[3], 3, 'Formação Florestal'],
                    [palette[4], 4, 'Formação Savânica'],
                    [palette[5], 5, 'Mangue'],
                    [palette[49], 49, 'Restinga Florestal'],
                    [palette[11], 11, 'Área Úmida Natural não Florestal'],
                    [palette[12], 12, 'Formação Campestre'],
                    [palette[32], 32, 'Apicum'],
                    [palette[29], 29, 'Afloramento Rochoso'],
                    [palette[50], 50, 'Restinga Herbácea/Arbustiva'],
                    [palette[13], 13, 'Outra Formação não Florestal'],
                    [palette[18], 18, 'Agricultura'],
                    [palette[39], 39, 'Soja'],
                    [palette[20], 20, 'Cana'],
                    [palette[40], 40, 'Arroz'],
                    [palette[62], 62, 'Algodão'],
                    [palette[41], 41, 'Outras Lavouras Temporárias'],
                    [palette[46], 46, 'Café'],
                    [palette[47], 47, 'Citrus'],
                    [palette[35], 35, 'Plantio de Palma'],
                    [palette[48], 48, 'Outras Lavaouras Perenes'],
                    [palette[9], 9, 'Silvicultura'],
                    [palette[15], 15, 'Pastagem'],
                    [palette[21], 21, 'Mosaico de Usos, Áreas abandonadas'],
                    [palette[22], 22, 'Área não Vegetada'],
                    [palette[23], 23, 'Praia e Duna'],
                    [palette[24], 24, 'Infraestrutura Urbana'],
                    [palette[30], 30, 'Mineração'],
                    [palette[25], 25, 'Outra Área não Vegetada'],
                    [palette[33], 33, 'Rio, Lago e Oceano'],
                    [palette[31], 31, 'Aquicultura'],
                    [palette[69], 69, 'Corais'],
                ],
                "style": {
                    "backgroundColor": "#ffffff",
                    "color": "#212121",
                    "fontSize": '10px',
                    "iconSize": '12px',
                },
                "orientation": "vertical"
            }
        }

    },

    init: function () {

        App.loadData();
        App.ui.init();

    },

    setVersion: function () {

        App.ui.form.labelTitle.setValue('MapBiomas Integration Toolkit ' + App.options.version);

    },

    getPrevalenceList: function () {

        var prevalenceList = [
            {
                'prevalence_id': 1,
                'label': 'Usinas Fotovotaicas',
                'rule': {
                    'class_input': 75,
                    'class_output': 75,
                    'source': App.getAssetData('PHOTOVOLTAIC')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 2,
                'label': 'Mineração',
                'rule': {
                    'class_input': 30,
                    'class_output': 30,
                    'source': App.getAssetData('MINERACAO')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [24],
                            'source': App.getAssetData('INFRAURBANA')[0].image.select(['classification', App.options.year].join('_'))
                        }, {
                            'class_input': [/* 24,  */27, 32], // MG, SP, MT
                            'source': App.getAssetData('STATES')[0].image,
                        }],
                    'class_output': 24
                }
            },
            {
                'prevalence_id': 3,
                'label': 'Praias e Dunas',
                'rule': {
                    'class_input': 23,
                    'class_output': 23,
                    'source': App.getAssetData('ZONACOSTEIRA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 4,
                'label': 'Praias e Dunas',
                'rule': {
                    'class_input': 23,
                    'class_output': 23,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 5,
                'label': 'Mangue',
                'rule': {
                    'class_input': 5,
                    'class_output': 5,
                    'source': App.getAssetData('ZONACOSTEIRA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 6,
                'label': 'Aquicultura',
                'rule': {
                    'class_input': 31,
                    'class_output': 31,
                    'source': App.getAssetData('AQUICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 7,
                'label': 'Aquicultura',
                'rule': {
                    'class_input': 31,
                    'class_output': 31,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 8,
                'label': 'Apicum',
                'rule': {
                    'class_input': 32,
                    'class_output': 32,
                    'source': App.getAssetData('ZONACOSTEIRA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 9,
                'label': 'Infraestrutura Urbana',
                'rule': {
                    'class_input': 24,
                    'class_output': 24,
                    'source': App.getAssetData('INFRAURBANA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
                // 'exception': {
                //     'rule': [
                //         {
                //             'class_input': [33],
                //             'source': App.options.classification.select(['classification', App.options.year].join('_'))
                //         }, /* {
                //             'class_input': [33],
                //             'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                //         } */],
                //     'class_output': 33
                // }
            },
            {
                'prevalence_id': 10,
                'label': 'Infraestrutura Urbana',
                'rule': {
                    'class_input': 24,
                    'class_output': 24,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
                // 'exception': {
                //     'rule': [
                //         {
                //             'class_input': [33],
                //             'source': App.options.classification.select(['classification', App.options.year].join('_'))
                //         }, /* {
                //             'class_input': [33],
                //             'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                //         } */],
                //     'class_output': 33
                // }
            },
            {
                'prevalence_id': 11,
                'label': 'floresta plantada',
                'rule': {
                    'class_input': 9,
                    'class_output': 9,
                    'source': App.getAssetData('FLORESTAPLANTADA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                            App.options.territory_id.pan,
                            App.options.territory_id.pam,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    },
                },
                'exception': null,
            },
            {
                'prevalence_id': 12,
                'label': 'Silvicultura (biomas)',
                'rule': {
                    'class_input': 9,
                    'class_output': 9,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 13,
                'label': 'Afloramento Rochoso',
                'rule': {
                    'class_input': 29,
                    'class_output': 29,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 14,
                'label': 'Lavoura temporária',
                'rule': {
                    'class_input': 19,
                    'class_output': 19,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }, /* {
                            'class_input': [33],
                            'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                        } */],
                    'class_output': 33
                }
            },
            {
                'prevalence_id': 15,
                'label': 'Lavoura perene',
                'rule': {
                    'class_input': 36,
                    'class_output': 36,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.unmask() //TODO: revisar após integração
                    },
                    {
                        'class_input': [3, 4, 11, 12], //EDITED
                        'source': App.options.classification.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': App.options.classification.select(['classification', App.options.year].join('_'))// TODO: melhorar na proxima versao
                },
            },
            {
                'prevalence_id': 16,
                'label': 'Lavoura perene',
                'rule': {
                    'class_input': 36,
                    'class_output': 36,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    // 'type': 'multiclass', // multiclass or multilayer (default is multilayer)
                    'rule': [{
                        'class_input': [12], //EDITED
                        'source': App.options.classification.select(['classification', App.options.year].join('_'))
                    }],
                    'class_output': 12
                },
            },
            {
                'prevalence_id': 17,
                'label': 'Lavoura temporaria',
                'rule': {
                    'class_input': 19,
                    'class_output': 19,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    // 'type': 'multiclass', // multiclass or multilayer (default is multilayer)
                    'rule': [{
                        'class_input': [12], //EDITED
                        'source': App.options.classification.select(['classification', App.options.year].join('_'))
                    }],
                    'class_output': 12
                },
            },
            {
                'prevalence_id': 18,
                'label': 'Lavoura perene',
                'rule': {
                    'class_input': 36,
                    'class_output': 36,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }, /* {
                            'class_input': [33],
                            'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                        } */],
                    'class_output': 33
                }
            },
            {
                'prevalence_id': 19,
                'label': 'Lavoura temporaria (biomas)',
                'rule': {
                    'class_input': 18, // TODO: revisar com a equipe da Amazônia
                    'class_output': 19,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.mat
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                }
            },
            {
                'prevalence_id': 20,
                'label': 'Restinga Herbácea/Arbustiva',
                'rule': {
                    'class_input': 50,
                    'class_output': 50,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            // {
            //     'prevalence_id': 38,
            //     'label': 'Rios, Lagos e Oceanos (GT)',
            //     'rule': {
            //         'class_input': 33,
            //         'class_output': 33,
            //         'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
            //         'source_mask': {
            //             'class_input': [
            //                 App.options.territory_id.amz,
            //                 App.options.territory_id.caa,
            //                 App.options.territory_id.cer,
            //                 App.options.territory_id.mat,
            //                 App.options.territory_id.pam,
            //             ],
            //             'source': App.getAssetData('BIOMES')[0].image
            //         }
            //     },
            //     'exception': null
            // },
            {
                'prevalence_id': 21,
                'label': 'Rios, Lagos e Oceanos (biomes)',
                'rule': {
                    'class_input': 33,
                    'class_output': 33, // edited
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 22,
                'label': 'Rios, Lagos e Oceanos (biomes)',
                'rule': {
                    'class_input': 33,
                    'class_output': 33,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 23,
                'label': 'Outras Áreas não Vegetadas',
                'rule': {
                    'class_input': 25,
                    'class_output': 25,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 24,
                'label': 'Formação Florestal',
                'rule': {
                    'class_input': 3,
                    'class_output': 3,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null/* {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.amz
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    },
                    // Pastagem sobre floresta na Amazônia e Cerrado
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                } */
            },
            {
                'prevalence_id': 25, //
                'label': 'Formação Savânica',
                'rule': {
                    'class_input': 4,
                    'class_output': 4,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.mat, // novo
                            App.options.territory_id.pam,
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null,
            },
            {
                'prevalence_id': 26, // CERRADO EXCEPTION
                'label': 'Formação Savânica',
                'rule': {
                    'class_input': 4,
                    'class_output': 4,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [0],
                        'source': App.getAssetData('CER_AP')[0].image.unmask()
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                },
            },
            {
                'prevalence_id': 27,
                'label': 'Restinga Arborizada',
                'rule': {
                    'class_input': 49,
                    'class_output': 49,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null,
            },
            {
                'prevalence_id': 28,
                'label': 'Floresta Inundável',
                // Dado classificado pelos biomas
                'rule': {
                    'class_input': 6,
                    'class_output': 6,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 29,
                'label': '  Área Úmida Natural não Florestal',
                // Dado classificado pelos biomas
                'rule': {
                    'class_input': 11,
                    'class_output': 11,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 30,
                'label': '  Área Úmida Natural não Florestal',
                // Dado classificado pelos biomas
                'rule': {
                    'class_input': 11,
                    'class_output': 11,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.unmask() //TODO: revisar após integração
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 11
                },
            },
            {
                'prevalence_id': 31, // CERRADO EXCEPTION
                'label': 'Área Úmida Natural não Florestal',
                'rule': {
                    'class_input': 11,
                    'class_output': 11,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [0],
                        'source': App.getAssetData('CER_AP')[0].image.unmask()
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                },
            },
            {
                'prevalence_id': 32,
                'label': 'Formação Campestre',
                'rule': {
                    'class_input': 12,
                    'class_output': 12,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 33,
                'label': 'Formação Campestre',
                'rule': {
                    'class_input': 12,
                    'class_output': 12,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.unmask() //TODO: revisar após integração
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 12
                },
            },
            {
                'prevalence_id': 34, // CERRADO EXCEPTION
                'label': 'Formação Campestre',
                'rule': {
                    'class_input': 12,
                    'class_output': 12,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [0],
                        'source': App.getAssetData('CER_AP')[0].image.unmask()
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                },
            },
            {
                'prevalence_id': 35,
                'label': 'Formação Natural não Florestal',
                'rule': {
                    'class_input': 13,
                    'class_output': 13,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.mat
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                }
            },
            {
                'prevalence_id': 36,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.caa,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CAATINGA_IRECE')[0].image //revisado com a equipe da caatinga
                    }],
                    'class_output': 21
                }
            },
            {
                'prevalence_id': 37,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }],
                    'class_output': 21
                }
            },
            {
                'prevalence_id': 38,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [41, 19],
                        'source': App.options.classification.select(['classification', App.options.year].join('_'))
                    }],
                    'class_output': 19
                }
            },
            {
                'prevalence_id': 39,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.mat,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 40,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.unmask()
                    },
                    {
                        'class_input': [3, 4, 11, 12], //EDITED
                        'source': App.options.classification.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': App.options.classification.select(['classification', App.options.year].join('_'))
                },
            },
            {
                'prevalence_id': 41,
                'label': 'Pastagem', // biomas
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                            App.options.territory_id.pan,

                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 42, // especifica para a exceção em ucs no cerrado
                'label': 'Mosaico de Agricultura e Pastagem',
                'rule': {
                    'class_input': 21,
                    'class_output': 21,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 43,
                'label': 'Mosaico de Agricultura e Pastagem',
                'rule': {
                    'class_input': 21,
                    'class_output': 21,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pan,
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.pan
                        ],
                        'source': App.getAssetData('BIOMES')[0].image
                    },
                    ],
                    'class_output': 15
                }
            },
            {
                'prevalence_id': 44,
                'label': 'Lavoura perene (biomas)',
                'rule': {
                    'class_input': 19,
                    'class_output': 19,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 45,
                'label': 'Lavoura perene (biomas)',
                'rule': {
                    'class_input': 41,
                    'class_output': 19,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 46,
                'label': '4. Área não Vegetada',
                'rule': {
                    'class_input': 22,
                    'class_output': 25,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 47,
                'label': '4. Área não Vegetada',
                'rule': {
                    'class_input': 25,
                    'class_output': 25,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
        ];

        return prevalenceList;
    },

    getAssetData: function (theme) {

        var filteredTheme = App.options.assets
            .filter(
                function (asset) {
                    return asset.theme == theme;
                }
            );

        return filteredTheme;
    },

    getClassificationMultibandCollection: function (obj) {

        var data = ee.ImageCollection(obj.asset_id)
            .filter(
                ee.Filter.or(
                    ee.Filter.eq('territory', obj.territory),
                    ee.Filter.eq('biome', obj.territory)
                )
            );


        if (obj.version !== null) {
            data = data.filter(
                ee.Filter.eq('version', obj.version)
            );
        }

        // print(obj.theme, obj.type, data, data.mosaic());

        return ee.Image(data.mosaic()).unmask(0, false);
    },

    getClassificationSinglebandCollection: function (obj) {

        // print(obj);

        var data = ee.ImageCollection(obj.asset_id)
            .filter(
                ee.Filter.and(
                    ee.Filter.or(
                        ee.Filter.eq('biome', obj.territory),
                        ee.Filter.eq('territory', obj.territory)
                    )//,
                    // ee.Filter.eq('system:band_names', ['classification'])
                )
            );

        if (obj.version !== null) {
            data = data.filter(
                ee.Filter.eq('version', obj.version)
            )
        }

        // rename bands
        data = data.map(
            function (image) {
                return image.rename("classification");
            }
        );

        data = data.map(
            function (image) {
                return ee.Image(image)
                    .set({
                        'year': ee.Number
                            .parse(ee.Image(image).get('year'))
                            .toInt()
                    })
            }
        );

        data = data.map(
            function (image) {
                return ee.Image(image)
                    .rename(ee.String("classification_").cat(ee.Image(image).get('year')))
            });


        // Apply the join.
        var joined = ee.Join.saveAll('images').apply(
            data.distinct('year'),
            data,
            ee.Filter.equals({
                leftField: 'year',
                rightField: 'year'
            })
        );

        data = joined.iterate(
            function (imageBase, imageResult) {
                var imageList = ee.List(imageBase.get('images'));

                var imageYear = ee.ImageCollection.fromImages(imageList).mosaic()

                imageResult = ee.Image(imageResult).addBands(imageYear);

                return imageResult;
            }, ee.Image().select()
        )

        // print(obj.theme, obj.type, data);

        data = ee.Image(data);
        // print(data)
        return data.unmask(0, false);
    },

    getClassificationSinglebandImage: function (obj) {

        var data = ee.Image(obj.asset_id);

        // print(obj.theme, obj.type, data);

        return data.unmask(0, false);
    },

    getTerritorySinglebandCollection: function (obj) {

        var data = ee.ImageCollection(obj.asset_id)
            .filter(
                ee.Filter.eq('CATEG_ID', obj.categ_id)
            );

        if (obj.version !== null) {
            data = data.filter(
                ee.Filter.eq('version', obj.version)
            )
        }

        print(obj.theme, obj.type, data);

        return ee.Image(data.mosaic()).unmask(0, false);
    },

    getClassificationMultibandImage: function (obj) {

        var data = ee.Image(obj.asset_id);

        // print(obj.theme, obj.type, data);

        return data.unmask(0, false);
    },

    // getMosaicMultibandCollection: function (obj) {

    //     var data = ee.ImageCollection(obj.asset_id);

    //     // print(obj.theme, obj.type, data);

    //     return data;
    // },

    getClassifications: function () {

        var band = ['classification', App.options.year].join('_');

        var amz = App.getAssetData('AMAZONIA')[0].image.select(band);
        var caa = App.getAssetData('CAATINGA')[0].image.select(band);
        var cer = App.getAssetData('CERRADO')[0].image.select(band);
        var mat = App.getAssetData('MATAATLANTICA')[0].image.select(band);
        var pam = App.getAssetData('PAMPA')[0].image.select(band);
        var pan = App.getAssetData('PANTANAL')[0].image.select(band);

        var image = ee.ImageCollection.fromImages([
            amz.mask(App.options.biomes.eq(App.options.territory_id.amz)).byte(),
            caa.mask(App.options.biomes.eq(App.options.territory_id.caa)).byte(),
            cer.mask(App.options.biomes.eq(App.options.territory_id.cer)).byte(),
            mat.mask(App.options.biomes.eq(App.options.territory_id.mat)).byte(),
            pam.mask(App.options.biomes.eq(App.options.territory_id.pam)).byte(),
            pan.mask(App.options.biomes.eq(App.options.territory_id.pan)).byte(),
        ]).min();

        return image;
    },

    getMosaics: function () {

        var filterByYear = ee.Filter.eq('year', parseInt(App.options.year, 10));

        var collection = ee.ImageCollection(App.getAssetData('MOSAIC')[0].asset_id)
            .filter(filterByYear);

        var amz = collection
            .filterMetadata('biome', 'equals', 'AMAZONIA')
            .filterMetadata('version', 'equals', '3')
            .mosaic();

        var caa = collection
            .filterMetadata('biome', 'equals', 'CAATINGA')
            .filterMetadata('version', 'equals', '3')
            .mosaic();

        var cer = collection
            .filterMetadata('biome', 'equals', 'CERRADO')
            .filterMetadata('version', 'equals', '3')
            .mosaic();

        var mat = collection
            .filterMetadata('biome', 'equals', 'MATAATLANTICA')
            .filterMetadata('version', 'equals', '3')
            .mosaic();

        var pam = collection
            .filterMetadata('biome', 'equals', 'PAMPA')
            .filterMetadata('version', 'equals', '3')
            .mosaic();

        var pan = collection
            .filterMetadata('biome', 'equals', 'PANTANAL')
            .filterMetadata('version', 'equals', '3')
            .mosaic();

        var image = ee.ImageCollection.fromImages([
            amz.mask(App.options.biomes.eq(App.options.territory_id.amz)),
            caa.mask(App.options.biomes.eq(App.options.territory_id.caa)),
            cer.mask(App.options.biomes.eq(App.options.territory_id.cer)),
            mat.mask(App.options.biomes.eq(App.options.territory_id.mat)),
            pam.mask(App.options.biomes.eq(App.options.territory_id.pam)),
            pan.mask(App.options.biomes.eq(App.options.territory_id.pan)),
        ]).mosaic();

        return image;
    },

    getRegions: function () {

        var regions = App.getAssetData('BIOMES')[0].image;
        return regions;
    },

    getCollections: function () {

        // App.options.data.collection31 = App.getAssetData('COLLECTION31')[0].image
        //     .select(['classification', App.options.year].join('_'));

        // App.options.data.collection41 = App.getAssetData('COLLECTION41')[0].image
        //     .select(['classification', App.options.year].join('_'));

        // App.options.data.collection50 = App.getAssetData('COLLECTION50')[0].image
        //     .select(['classification', App.options.year].join('_'));

        // App.options.data.collection60 = App.getAssetData('COLLECTION60')[0].image
        //     .select(['classification', App.options.year].join('_'));

        // App.options.data.collection70 = App.getAssetData('COLLECTION70')[0].image
        //     .select(['classification', App.options.year].join('_'));

        // App.options.data.collection71 = App.getAssetData('COLLECTION71')[0].image
        //     .select(['classification', App.options.year].join('_'));

        // App.options.data.collection80 = App.getAssetData('COLLECTION80')[0].image
        //     .select(['classification', App.options.year].join('_'));

        App.options.data.COLLECTION101 = App.getAssetData('COLLECTION101')[0].image
            .select(['classification', App.options.year].join('_'));

    },

    calculateStates: function () {

        // var states = ee.ImageCollection(App.options.assets.collection70)
        //     .filter(ee.Filter.eq('version', '0-17'))
        //     .min()
        //     .reduce(ee.Reducer.countDistinctNonNull());

        // return states;
    },

    calculateIncidents: function () {

        // var incidentes = ee.ImageCollection(App.options.assets.collection70)
        //     .filter(ee.Filter.eq('version', '0-17'))
        //     .min()
        //     .reduce(ee.Reducer.countRuns()).subtract(1);

        // return incidentes;
    },

    calculateFilterDiff: function () {

        // var integrated = App.options.collection70;
        // var filtered = App.options.collection70f;

        // return integrated.eq(filtered).selfMask();
    },

    loadLayers: function () {
        App.options.layers = [
            {
                'name': 'Mosaic',
                'data': App.options.mosaics,
                'shown': false,
                'vis': App.options.vis.mosaic,
                'legend': null
            },
            {
                'name': 'AMAZÔNIA (version ' + App.getAssetData('AMAZONIA')[0].version + ')',
                'data': App.getAssetData('AMAZONIA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': null
            },
            {
                'name': 'CAATINGA (version ' + App.getAssetData('CAATINGA')[0].version + ')',
                'data': App.getAssetData('CAATINGA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': null
            },
            {
                'name': 'CERRADO (version ' + App.getAssetData('CERRADO')[0].version + ')',
                'data': App.getAssetData('CERRADO')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': null
            },
            {
                'name': 'MATAATLANTICA (version ' + App.getAssetData('MATAATLANTICA')[0].version + ')',
                'data': App.getAssetData('MATAATLANTICA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': null
            },
            {
                'name': 'PAMPA (version ' + App.getAssetData('PAMPA')[0].version + ')',
                'data': App.getAssetData('PAMPA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': null
            },
            {
                'name': 'PANTANAL (version ' + App.getAssetData('PANTANAL')[0].version + ')',
                'data': App.getAssetData('PANTANAL')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': null
            },
            {
                'name': 'Classification',
                'data': App.options.classification,
                'shown': true,
                'vis': App.options.vis.integration,
                'legend': App.options.legend
            },
            {
                'name': 'Integration (version ' + outputVersion + ')',
                'data': App.options.integrated,
                'shown': true,
                'vis': App.options.vis.integration,
                'legend': App.options.legend
            },
            {
                'name': 'Agriculture (version ' + App.getAssetData('AGRICULTURA')[0].version + ')',
                'data': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [39, 20, 40, 41, 46, 47, 48].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            // {
            //     'name': 'Soja Acumulada',
            //     'data': App.getAssetData('SOJA_ACUMULADA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
            //     'shown': false,
            //     'vis': { 'format': 'png', 'min': 0, 'max': 1, 'opacity': 0.8, 'palette': ['#000000', '#00ffff'] },
            //     'legend': null
            // },
            // {
            //     'name': 'Agriculture (irrigated)',
            //     'data': ee.Image(App.options.assets.agi + '/' + App.options.year + '-' + App.options.versions.agi).selfMask(),
            //     'shown': false,
            //     'vis': App.options.vis.integration,
            //     'legend': null
            // },
            {
                'name': 'Aquaculture (version ' + App.getAssetData('AQUICULTURA')[0].version + ')',
                'data': App.getAssetData('AQUICULTURA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [31].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            {
                'name': 'Coastal Zone (version ' + App.getAssetData('ZONACOSTEIRA')[0].version + ')',
                'data': App.getAssetData('ZONACOSTEIRA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [5, 33, 23, 32].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            // {
            //     'name': 'Corais (version ' + App.getAssetData('CORAIS')[0].version + ')',
            //     'data': App.getAssetData('CORAIS')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
            //     'shown': false,
            //     'vis': App.options.vis.integration,
            //     'legend': {
            //         'params': {
            //             "title": null,
            //             "layers": [69].map(App.ui.filterLegend),
            //             "style": App.options.legend.params.style,
            //             "orientation": App.options.legend.params.orientation
            //         }
            //     }
            // },
            {
                'name': 'Mining (version ' + App.getAssetData('MINERACAO')[0].version + ')',
                'data': App.getAssetData('MINERACAO')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [30].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            {
                'name': 'Pasture (version ' + App.getAssetData('PECUARIA')[0].version + ')',
                'data': App.getAssetData('PECUARIA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [15].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            {
                'name': 'Planted Forest (version ' + App.getAssetData('FLORESTAPLANTADA')[0].version + ')',
                'data': App.getAssetData('FLORESTAPLANTADA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [9].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            {
                'name': 'Urban (version ' + App.getAssetData('INFRAURBANA')[0].version + ')',
                'data': App.getAssetData('INFRAURBANA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [24].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            // {
            //     'name': 'Water (version ' + App.getAssetData('AGUA')[0].version + ')',
            //     'data': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
            //     'shown': false,
            //     'vis': App.options.vis.integration,
            //     'legend': {
            //         'params': {
            //             "title": null,
            //             "layers": [33].map(App.ui.filterLegend),
            //             "style": App.options.legend.params.style,
            //             "orientation": App.options.legend.params.orientation
            //         }
            //     }
            // },
            // {
            //     'name': 'Collection 7.1',
            //     'data': App.options.data.collection71,
            //     'shown': false,
            //     'vis': App.options.vis.integration,
            //     'legend': App.options.legend
            // },
            // {
            //     'name': 'Collection 8.0 (version ' + App.getAssetData('COLLECTION80')[0].version + ')',
            //     'data': App.options.data.collection80,
            //     'shown': false,
            //     'vis': App.options.vis.integration,
            //     'legend': App.options.legend
            // },
            {
                'name': 'Collection 9.0 (version ' + App.getAssetData('COLLECTION101')[0].version + ')',
                'data': App.options.data.COLLECTION101,
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': App.options.legend
            },
            {
                'name': 'Collection 2.0 Sentinel (version ' + App.getAssetData('SENTINEL20')[0].version + ')',
                'data': App.getAssetData('SENTINEL20')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': App.options.legend
            },
            {
                'name': 'Protected Areas',
                'data': App.getAssetData('CER_AP')[0].image.eq(0).selfMask(),
                'shown': false,
                'vis': { 'format': 'png', 'min': 0, 'max': 1, 'opacity': 0.8, 'palette': ['#ffffff', '#000000'] },
                'legend': null
            },
            // {
            //     'name': 'Lagoa dos Peixes',
            //     'data': App.getAssetData('PAMPA_LAGOA_PEIXES')[0].image.eq(0).selfMask(),
            //     'shown': false,
            //     'vis': { 'format': 'png', 'min': 0, 'max': 1, 'opacity': 0.8, 'palette': ['#ffffff', '#000000'] },
            //     'legend': null
            // },
            {
                'name': 'Irecê',
                'data': App.getAssetData('CAATINGA_IRECE')[0].image,
                'shown': false,
                'vis': { 'format': 'png', 'min': 0, 'max': 1, 'opacity': 0.5 },
                'legend': null
            },
            // {
            //     'name': 'Pantanal Agriculture Mask',
            //     'data': App.getAssetData('PANTANAL_AGRICULTURA')[0].image,
            //     'shown': false,
            //     'vis': { 'format': 'png', 'min': 0, 'max': 2, 'opacity': 0.5 },
            //     'legend': null
            // },
            {
                'name': 'Biomes',
                'data': App.getAssetData('BIOMES')[0].image,
                'shown': false,
                'vis': { 'format': 'png', 'min': 0, 'max': 17, 'opacity': 1.0 },
                'legend': null
            },
        ];
    },

    loadAssets: function () {

        App.options.assets = App.options.assets.map(
            function (obj) {

                switch (obj.type) {
                    case 'classification_singleband_collection':
                        obj.image = App.getClassificationSinglebandCollection(obj);
                        break;

                    case 'classification_singleband_image':
                        obj.image = App.getClassificationSinglebandImage(obj);
                        break;

                    case 'classification_multiband_collection':
                        obj.image = App.getClassificationMultibandCollection(obj);
                        break;

                    case 'classification_multiband_image':
                        obj.image = App.getClassificationMultibandImage(obj);
                        break;

                    case 'territory_singleband_collection':
                        obj.image = App.getTerritorySinglebandCollection(obj);
                        break;

                    default:
                        obj.image = null
                        break;
                }

                return obj;
            }
        );

        print(App.options.assets);
    },

    loadData: function () {

        App.loadAssets();

        App.options.biomes = App.getRegions();

        App.options.classification = App.getClassifications();

        App.getCollections();

        App.options.mosaics = App.getMosaics();

        App.options.prevalenceList = App.getPrevalenceList();

        App.options.integrated = App.integrate(App.options.year);

        // App.options.states = App.calculateStates();

        // App.options.incidents = App.calculateIncidents();

        // App.options.difference = App.calculateFilterDiff();

        App.loadLayers();
    },

    filterByPrevalence: function (obj) {

        return obj.prevalence_id == this.id;

    },

    integrate: function (year) {

        App.options.year = String(year);

        App.options.classification = App.getClassifications();

        App.options.prevalenceList = App.getPrevalenceList();

        App.options.integrated = App.recursion(
            ee.Image(0),
            App.options.prevalenceList,
            App.options.prevalenceList.filter(App.filterByPrevalence, {
                'id': App.options.prevalenceList.length
            })
        );

        // App.options.integrated = App.options.integrated.where(
        //     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2).and(App.options.integrated.eq(39)), 15);
        // App.options.integrated = App.options.integrated.where(
        //     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2).and(App.options.integrated.eq(20)), 15);
        // App.options.integrated = App.options.integrated.where(
        //     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2).and(App.options.integrated.eq(40)), 15);
        // App.options.integrated = App.options.integrated.where(
        //     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2).and(App.options.integrated.eq(41)), 15);
        // App.options.integrated = App.options.integrated.where(
        //     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2).and(App.options.integrated.eq(47)), 15);
        // App.options.integrated = App.options.integrated.where(
        //     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2).and(App.options.integrated.eq(48)), 15);

        return App.options.integrated.mask(App.options.biomes.neq(0))
            .rename('classification_' + App.options.year);

    },

    recursion: function (image, prevalenceList, obj) {

        var integrated;

        obj = obj[0];

        integrated = App.applyRule(image, obj);

        if (obj.prevalence_id > 1) {

            integrated = App.recursion(
                integrated,
                prevalenceList,
                prevalenceList.filter(App.filterByPrevalence, {
                    'id': obj.prevalence_id - 1
                })
            );

        }

        return integrated;
    },

    applyRule: function (image, obj) {

        var mask = ee.Image(obj.rule.source)
            .unmask()
            .eq(obj.rule.class_input);

        if (obj.rule.source_mask !== null) {
            var sourceMask = ee.Image(obj.rule.source_mask.source)
                .unmask()
                .remap(
                    obj.rule.source_mask.class_input,
                    ee.List.repeat(1, obj.rule.source_mask.class_input.length),
                    0
                );

            mask = mask.multiply(sourceMask);
        }

        var integrated = image
            .where(mask, obj.rule.class_output);

        if (obj.exception !== null) {

            if (typeof (obj.exception.type) !== "undefined") {

                if (obj.exception.type === "multiclass") {
                    var remaped = ee.Image(obj.exception.rule[0].source)
                        .unmask()
                        .remap(obj.exception.rule[0].class_input, obj.exception.class_output, 0)

                    if (typeof (obj.exception.source_mask) !== "undefined") {
                        if (obj.exception.source_mask !== null) {
                            // print('Exception', obj.exception)
                            var sourceExceptionMask = ee.Image(obj.exception.source_mask.source)
                                .unmask()
                                .remap(
                                    obj.exception.source_mask.class_input,
                                    ee.List.repeat(1, obj.exception.source_mask.class_input.length),
                                    0
                                );

                            remaped = remaped.multiply(sourceExceptionMask).multiply(mask);
                        }
                    } else {
                        if (obj.rule.source_mask !== null) {
                            remaped = remaped.multiply(sourceMask).multiply(mask);
                        }
                    }

                    integrated = integrated.where(remaped.gt(0), remaped);
                } else {
                    var maskExceptionList = obj.exception.rule.map(
                        function (item) {

                            return ee.Image(item.source)
                                .unmask()
                                .remap(item.class_input, ee.List.repeat(1, item.class_input.length), 0)
                                .rename(['mask']);
                        }
                    );

                    var maskException = ee.ImageCollection.fromImages(maskExceptionList)
                        .reduce(ee.Reducer.product())
                        .multiply(mask);

                    integrated = integrated
                        .where(maskException.eq(1), obj.exception.class_output);
                }
            } else {
                var maskExceptionList = obj.exception.rule.map(
                    function (item) {

                        return ee.Image(item.source)
                            .unmask()
                            .remap(item.class_input, ee.List.repeat(1, item.class_input.length), 0)
                            .rename(['mask']);
                    }
                );

                var maskException = ee.ImageCollection.fromImages(maskExceptionList)
                    .reduce(ee.Reducer.product())
                    .multiply(mask);

                integrated = integrated
                    .where(maskException.eq(1), obj.exception.class_output);
            }
        }

        return integrated;
    },

    ui: {

        init: function () {

            App.ui.form.init();
            // Map.centerObject(App.options.biomes, 5);
            Map.setControlVisibility({ 'layerList': false });
        },

        clear: function () {

            Map.layers().reset([]);

        },

        update: function () {

            var layersState = App.options.layers;

            App.loadData();

            App.options.layers.reverse().forEach(
                function (layer, index) {

                    App.options.layers[index].shown = layersState[index].shown;

                    var mapLayer = App.ui.addLayer(0, layer);

                    App.ui.showLayer(layer, mapLayer);

                    App.options.checkboxs[index].onChange(
                        function (checked) {

                            App.options.layers = App.options.layers.map(
                                function (obj) {
                                    if (obj.name === layer.name) {
                                        obj.shown = checked;
                                    }

                                    return obj;
                                }
                            );

                            App.ui.showLayer(layer, mapLayer);
                            // print(layer, mapLayer)

                        }
                    );

                    // App.ui.manageLayers(
                    //     App.options.layers[index]
                    // );

                }
            );
        },

        filterLegend: function (classid) {
            var layer = App.options.legend.params.layers.filter(
                function (layer) {
                    return layer[1] === classid;
                }
            );
            return layer[0];
        },

        addLayer: function (index, layer) {
            var mapLayer = ui.Map.Layer({
                'eeObject': layer.data,
                'visParams': layer.vis,
                'name': layer.name,
                'shown': layer.shown,
                'opacity': 1.0
            });

            Map.layers().insert(index, mapLayer);

            return mapLayer;

        },

        removeLayer: function (layer) {

            for (var i = 0; i < Map.layers().length(); i++) {

                var mapItem = Map.layers().get(i);

                if (layer.name === mapItem.get('name')) {
                    Map.remove(mapItem);
                }
            }

        },

        showLayer: function (layer, mapLayer) {

            mapLayer.setShown(layer.shown)

        },

        manageLayers: function (layer) {

            // if (layer.shown) {
            //     App.ui.addImageLayer(layer);
            // } else {
            //     App.ui.removeImageLayer(layer);
            // }

        },

        setLayerOpacity: function (index, value) {

            Map.layers().get(index).set('opacity', value)
        },

        buildLayerList: function () {

            App.options.layers.reverse().forEach(
                function (layer, layerIndex) {

                    var mapLayer = App.ui.addLayer(0, layer);

                    if (layer.legend !== null) {
                        var legend = Legend.getLegend(layer.legend.params);
                    } else {
                        var legend = ui.Label({
                            'value': 'No legend.',
                            'style': {
                                'margin': '0px 0px 0px 100px',
                                'fontSize': '10px'
                            }
                        })
                    }

                    var panelBase = ui.Panel();
                    var panelCheckbox = ui.Panel({
                        'layout': ui.Panel.Layout.flow('horizontal')
                    });

                    var foldableLabels = ['➕', '➖'];

                    var foldable = ui.Checkbox({
                        "label": foldableLabels[+false],
                        "value": false,
                        "onChange": function (checked) {

                            foldable.set("label", foldableLabels[+checked]);

                            if (checked) {
                                legend.style().set("margin", "0px 4px 2px 15px");
                                panelBase.add(legend);
                            } else {
                                panelBase.remove(legend);
                            }
                        },
                        "disabled": false,
                        "style": {
                            'margin': '10px 0px 0px -15px',
                            'fontSize': '8px',
                            'backgroundColor': '#dddddd00',
                        }
                    });

                    var checkbox = ui.Checkbox({
                        "label": layer.name,
                        "value": false,
                        "onChange": function (checked) {

                            App.options.layers = App.options.layers.map(
                                function (obj) {
                                    if (obj.name === layer.name) {
                                        obj.shown = checked;
                                    }

                                    return obj;
                                }
                            );

                            App.ui.showLayer(layer, mapLayer);

                        },
                        "disabled": false,
                        "style": {
                            'padding': '2px',
                            'stretch': 'horizontal',
                            'backgroundColor': '#dddddd',
                            'fontSize': '12px'
                        }
                    });

                    App.options.checkboxs.push(checkbox);

                    var slider = ui.Slider({
                        'min': 0,
                        'max': 1,
                        'value': 1,
                        'step': 0.1,
                        'onChange': function (value) {
                            App.ui.setLayerOpacity((App.options.layers.length - 1) - layerIndex, value);
                        },
                        'style': {
                            'width': '50px',
                            'stretch': 'horizontal',
                            'backgroundColor': '#DDDDDD',
                            'color': '#21242E',
                            'margin': '8px 8px 0px 0px',
                        }
                    });

                    slider.onSlide(function (value) {
                        App.ui.setLayerOpacity((App.options.layers.length - 1) - layerIndex, value);
                    });

                    panelBase.add(panelCheckbox);
                    panelCheckbox.add(foldable);
                    panelCheckbox.add(checkbox);
                    panelCheckbox.add(slider);

                    App.ui.form.panelLayersList.add(panelBase);

                    checkbox.setValue(layer.shown, true);
                }
            );
        },

        form: {

            init: function () {

                var blob = ee.Blob(App.options.logo.uri);

                blob.string().evaluate(
                    function (str) {
                        str = str.replace(/\n/g, '');
                        App.options.logo.base64 = ui.Label({
                            imageUrl: str,
                        });
                        App.ui.form.panelLogo.add(App.options.logo.base64);
                    }
                );

                App.ui.form.panelMain.add(App.ui.form.panelLogo);

                App.ui.buildLayerList();

                App.ui.form.panelMain.add(App.ui.form.labelTitle);
                App.ui.form.panelMain.add(App.ui.form.selectYear0);
                App.ui.form.panelMain.add(App.ui.form.labelLayers);
                App.ui.form.panelMain.add(App.ui.form.panelLayersList);

                App.ui.form.panelLegend.add(Legend.getLegend(App.options.legend.params));
                App.ui.form.panelLegend.add(App.ui.form.buttonHideLegend);

                // Map.add(App.ui.form.panelLegend);

                // Map.add(App.ui.form.panelMain);
                ui.root.add(App.ui.form.panelMain);

            },

            panelMain: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'width': '360px',
                    'position': 'bottom-right',
                    'margin': '0px 0px 0px 0px',
                },
            }),

            panelLogo: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal',
                    'margin': '10px 0px 5px 15px',
                },
            }),

            panelLayersList: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    // 'height': '660px',
                    'stretch': 'vertical',
                    'backgroundColor': '#cccccc',
                    'margin': '0px 0px 0px 15px',
                },
            }),

            panelLegend: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'height': '650px',
                    'stretch': 'vertical',
                    'position': 'bottom-right'
                },
            }),

            labelTitle: ui.Label('MapBiomas Integration Toolkit', {
                'fontWeight': 'bold',
                // 'padding': '1px',
                'fontSize': '14px'
            }),

            labelLayers: ui.Label('Layers:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            selectYear0: ui.Select({
                'items': [
                    '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'
                ].reverse(),
                'placeholder': 'select year',
                'value': '2024',
                'onChange': function (year) {

                    App.ui.clear();

                    App.options.year = year;

                    App.ui.update();

                },
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            buttonHideLegend: ui.Button({
                'label': '➖️',
                'onClick': function () {
                    Map.remove(App.ui.form.panelLegend);
                    Map.add(App.ui.form.buttonShowLegend);
                },
                'style': {
                    'position': 'bottom-right',
                    'padding': '0px',
                }
            }),

            buttonShowLegend: ui.Button({
                'label': '➕️',
                'onClick': function () {
                    Map.remove(App.ui.form.buttonShowLegend);
                    Map.add(App.ui.form.panelLegend);
                },
                'style': {
                    'position': 'bottom-right',
                    'padding': '0px',
                }
            }),

        },
    }
};

/**
 * 
 */
var Chart = {

    options: {
        'title': 'Inspector',
        'legend': 'none',
        'chartArea': {
            left: 30,
            right: 2,
        },
        'titleTextStyle': {
            color: '#ffffff',
            fontSize: 10,
            bold: true,
            italic: false
        },
        'tooltip': {
            textStyle: {
                fontSize: 10,
            },
            // isHtml: true
        },
        'backgroundColor': '#21242E',
        'pointSize': 6,
        'crosshair': {
            trigger: 'both',
            orientation: 'vertical',
            focused: {
                color: '#dddddd'
            }
        },
        'hAxis': {
            // title: 'Date', //muda isso aqui
            slantedTextAngle: 90,
            slantedText: true,
            textStyle: {
                color: '#ffffff',
                fontSize: 8,
                fontName: 'Arial',
                bold: false,
                italic: false
            },
            titleTextStyle: {
                color: '#ffffff',
                fontSize: 10,
                fontName: 'Arial',
                bold: true,
                italic: false
            },
            viewWindow: {
                max: 37,
                min: 0
            },
            gridlines: {
                color: '#21242E',
                interval: 1
            },
            minorGridlines: {
                color: '#21242E'
            }
        },
        'vAxis': {
            title: 'Class', // muda isso aqui
            textStyle: {
                color: '#ffffff',
                fontSize: 10,
                bold: false,
                italic: false
            },
            titleTextStyle: {
                color: '#ffffff',
                fontSize: 10,
                bold: false,
                italic: false
            },
            viewWindow: {
                max: 50,
                min: 0
            },
            gridlines: {
                color: '#21242E',
                interval: 2
            },
            minorGridlines: {
                color: '#21242E'
            }
        },
        'lineWidth': 0,
        // 'width': '300px',
        'height': '150px',
        'margin': '0px 0px 0px 0px',
        'series': {
            0: { color: '#21242E' }
        },

    },

    assets: {
        image: App.options.assets.collection70,
        imagef: App.options.assets.collection70
    },

    data: {
        imagef: null,
        point: null
    },

    legend: {
        0: { 'color': palette[0], 'name': 'Ausência de dados' },
        3: { 'color': palette[3], 'name': 'Formação Florestal' },
        4: { 'color': palette[4], 'name': 'Formação Savânica' },
        5: { 'color': palette[5], 'name': 'Mangue' },
        49: { 'color': palette[49], 'name': 'Restinga Florestal' },
        11: { 'color': palette[11], 'name': 'Área Úmida Natural não Florestal' },
        12: { 'color': palette[12], 'name': 'Formação Campestre' },
        32: { 'color': palette[32], 'name': 'Apicum' },
        29: { 'color': palette[29], 'name': 'Afloramento Rochoso' },
        13: { 'color': palette[13], 'name': 'Outra Formação não Florestal' },
        18: { 'color': palette[18], 'name': 'Agricultura' },
        39: { 'color': palette[39], 'name': 'Soja' },
        20: { 'color': palette[20], 'name': 'Cana' },
        40: { 'color': palette[40], 'name': 'Arroz' },
        41: { 'color': palette[41], 'name': 'Outras Lavouras Temporárias' },
        46: { 'color': palette[46], 'name': 'Café' },
        47: { 'color': palette[47], 'name': 'Citrus' },
        48: { 'color': palette[48], 'name': 'Outras Lavaouras Perenes' },
        9: { 'color': palette[9], 'name': 'Silvicultura' },
        15: { 'color': palette[15], 'name': 'Pastagem' },
        21: { 'color': palette[21], 'name': 'Mosaico de Agricultura ou Pastagem' },
        22: { 'color': palette[22], 'name': 'Área não Vegetada' },
        23: { 'color': palette[23], 'name': 'Praia e Duna' },
        24: { 'color': palette[24], 'name': 'Infraestrutura Urbana' },
        30: { 'color': palette[30], 'name': 'Mineração' },
        25: { 'color': palette[25], 'name': 'Outra Área não Vegetada' },
        33: { 'color': palette[33], 'name': 'Rio, Lago e Oceano' },
        31: { 'color': palette[31], 'name': 'Aquicultura' },
    },

    loadData: function () {
        Chart.data.image = ee.ImageCollection(Chart.assets.image)
            .filter(ee.Filter.eq('version', '0-6'))
            .min();
        Chart.data.imagef = ee.ImageCollection(Chart.assets.imagef)
            .filter(ee.Filter.eq('version', '0-8'))
            .min();
    },

    init: function () {
        Chart.loadData();
        Chart.ui.init();
    },

    getSamplePoint: function (image, points) {

        var sample = image.sampleRegions({
            'collection': points,
            'scale': 30,
            'geometries': true
        });

        return sample;
    },

    ui: {

        init: function () {

            Chart.ui.form.init();
            Chart.ui.activateMapOnClick();

        },

        activateMapOnClick: function () {

            Map.onClick(
                function (coords) {
                    var point = ee.Geometry.Point(coords.lon, coords.lat);

                    var bandNames = Chart.data.image.bandNames();

                    var newBandNames = bandNames.map(
                        function (bandName) {
                            var name = ee.String(ee.List(ee.String(bandName).split('_')).get(1));

                            return name;
                        }
                    );

                    var image = Chart.data.image.select(bandNames, newBandNames);
                    var imagef = Chart.data.imagef.select(bandNames, newBandNames);

                    Chart.ui.inspect(Chart.ui.form.chartInspectorf, imagef, point, 1.0);
                    Chart.ui.inspect(Chart.ui.form.chartInspector, image, point, 1.0);
                }
            );
        },

        refreshGraph: function (chart, sample, opacity) {

            sample.evaluate(
                function (featureCollection) {

                    if (featureCollection !== null) {
                        // print(featureCollection.features);

                        var pixels = featureCollection.features.map(
                            function (features) {
                                return features.properties;
                            }
                        );

                        var bands = Object.getOwnPropertyNames(pixels[0]);

                        // Add class value
                        var dataTable = bands.map(
                            function (band) {
                                var value = pixels.map(
                                    function (pixel) {
                                        return pixel[band];
                                    }
                                );

                                return [band].concat(value);
                            }
                        );

                        // Add point style and tooltip
                        dataTable = dataTable.map(
                            function (point) {
                                var color = Chart.legend[point[1]].color;
                                var name = Chart.legend[point[1]].name;
                                var value = String(point[1]);

                                var style = 'point {size: 4; fill-color: ' + color + '; opacity: ' + opacity + '}';
                                var tooltip = 'year: ' + point[0] + ', class: [' + value + '] ' + name;

                                return point.concat(style).concat(tooltip);
                            }
                        );

                        var headers = [
                            'serie',
                            'id',
                            { 'type': 'string', 'role': 'style' },
                            { 'type': 'string', 'role': 'tooltip' }
                        ];

                        dataTable = [headers].concat(dataTable);

                        chart.setDataTable(dataTable);

                    }
                }
            );
        },

        refreshMap: function () {

            var pointLayer = Map.layers().filter(
                function (layer) {
                    return layer.get('name') === 'Point';
                }
            );

            if (pointLayer.length > 0) {
                Map.remove(pointLayer[0]);
                Map.addLayer(Chart.data.point, {}, 'Point');
            } else {
                Map.addLayer(Chart.data.point, {}, 'Point');
            }

        },

        inspect: function (chart, image, point, opacity) {

            // aqui pode fazer outras coisas além de atualizar o gráfico
            Chart.data.point = Chart.getSamplePoint(image, ee.FeatureCollection(point));

            Chart.ui.refreshMap(Chart.data.point);
            Chart.ui.refreshGraph(chart, Chart.data.point, opacity);

        },

        form: {

            init: function () {

                Chart.ui.form.panelChart.add(Chart.ui.form.chartInspector);
                Chart.ui.form.panelChart.add(Chart.ui.form.chartInspectorf);

                Chart.options.title = 'Integrated';
                Chart.ui.form.chartInspector.setOptions(Chart.options);

                Chart.options.title = 'Integrated - ft';
                Chart.ui.form.chartInspectorf.setOptions(Chart.options);

                // Chart.ui.form.chartInspector.onClick(
                //     function (xValue, yValue, seriesName) {
                //         print(xValue, yValue, seriesName);
                //     }
                // );

                Map.add(Chart.ui.form.panelChart);
            },

            panelChart: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'width': '450px',
                    // 'height': '200px',
                    'position': 'bottom-right',
                    'margin': '0px 0px 0px 0px',
                    'padding': '0px',
                    'backgroundColor': '#21242E'
                },
            }),

            chartInspector: ui.Chart([
                ['Serie', ''],
                ['', -1000], // número menor que o mínimo para não aparecer no gráfico na inicialização
            ]),

            chartInspectorf: ui.Chart([
                ['Serie', ''],
                ['', -1000], // número menor que o mínimo para não aparecer no gráfico na inicialização
            ])
        }
    }
};

App.init();
// Chart.init();
/**
* 
*/
var filterParams = [
    {
        'classValue': 3,
        'maxSize': 5
    },
    {
        'classValue': 4,
        'maxSize': 5
    },
    {
        'classValue': 5,
        'maxSize': 5
    },
    {
        'classValue': 9,
        'maxSize': 5
    },
    {
        'classValue': 11,
        'maxSize': 5
    },
    {
        'classValue': 12,
        'maxSize': 5
    },
    {
        'classValue': 13,
        'maxSize': 5
    },
    {
        'classValue': 15,
        'maxSize': 5
    },
    {
        'classValue': 18,
        'maxSize': 5
    },
    {
        'classValue': 19,
        'maxSize': 5
    },
    {
        'classValue': 20,
        'maxSize': 5
    },
    {
        'classValue': 21,
        'maxSize': 5
    },
    {
        'classValue': 22,
        'maxSize': 5
    },
    {
        'classValue': 24,
        'maxSize': 5
    },
    {
        'classValue': 25,
        'maxSize': 5
    },
    {
        'classValue': 27,
        'maxSize': 5
    },
    {
        'classValue': 29,
        'maxSize': 5
    },
    {
        'classValue': 30,
        'maxSize': 5
    },
    {
        'classValue': 31,
        'maxSize': 5
    },
    {
        'classValue': 32,
        'maxSize': 5
    },
    {
        'classValue': 33,
        'maxSize': 5
    },
    {
        'classValue': 36,
        'maxSize': 5
    },
    {
        'classValue': 37,
        'maxSize': 5
    },
    {
        'classValue': 39,
        'maxSize': 5
    },
    {
        'classValue': 40,
        'maxSize': 5
    },
    {
        'classValue': 41,
        'maxSize': 5
    },
    {
        'classValue': 46,
        'maxSize': 5
    },
    {
        'classValue': 47,
        'maxSize': 5
    },
    {
        'classValue': 48,
        'maxSize': 5
    },
    {
        'classValue': 49,
        'maxSize': 5
    },
    {
        'classValue': 50,
        'maxSize': 5
    },
];


/**
 * Classe de pos-classificação para reduzir ruídos na imagem classificada
 *
 * @param {ee.Image} image [eeObjeto imagem de classificação]
 *
 * @example
 * var image = ee.Image("aqui vem a sua imagem");
 * var filterParams = [
 *     {classValue: 1, maxSize: 3},
 *     {classValue: 2, maxSize: 5}, // o tamanho maximo que o mapbiomas está usado é 5
 *     {classValue: 3, maxSize: 5}, // este valor foi definido em reunião
 *     {classValue: 4, maxSize: 3},
 *     ];
 * var filtered = PostClassification.spatialFilter(image, filterParams);
 */
var PostClassification = require('users/mapbiomas/modules:PostClassification.js');

//=============================================================================
// Script
//=============================================================================

var years = [
    2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
];

// integration
var integratedList = ee.List(
    years.map(
        function (year) {
            var integrated = App.integrate(year);

            integrated = PostClassification.spatialFilter(integrated, filterParams);

            return integrated;
        }
    )
);

var integrated = ee.Image(
    integratedList.iterate(
        function (band, image) {
            return ee.Image(image).addBands(band);
        },
        ee.Image().select()
    )
);

// integrated = integrated.where(
//     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2)
//         .and(App.options.integrated.eq(39))
//         .and(App.getAssetData('BIOMES')[0].image.eq(17)), 15);

// integrated = integrated.where(
//     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2)
//         .and(App.options.integrated.eq(20))
//         .and(App.getAssetData('BIOMES')[0].image.eq(17)), 15);

// integrated = integrated.where(
//     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2)
//         .and(App.options.integrated.eq(40))
//         .and(App.getAssetData('BIOMES')[0].image.eq(17)), 15);

// integrated = integrated.where(
//     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2)
//         .and(App.options.integrated.eq(41))
//         .and(App.getAssetData('BIOMES')[0].image.eq(17)), 15);

// integrated = integrated.where(
//     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2)
//         .and(App.options.integrated.eq(47))
//         .and(App.getAssetData('BIOMES')[0].image.eq(17)), 15);

// integrated = integrated.where(
//     App.getAssetData('PANTANAL_AGRICULTURA')[0].image.eq(2)
//         .and(App.options.integrated.eq(48))
//         .and(App.getAssetData('BIOMES')[0].image.eq(17)), 15);

/**
  * Export to asset
  */
var assetGrids = 'projects/mapbiomas-workspace/AUXILIAR/cartas';

var grids = ee.FeatureCollection(assetGrids);

var gridNames = [
    //"NA-19", "NA-20", "NA-21", "NA-22", "NB-20", "NB-21", "NB-22", "SA-19",
    //"SA-20", "SA-21", "SA-22", "SA-23", "SA-24", "SB-18", "SB-19", "SB-20",
    //"SB-21", "SB-22", "SB-23", "SB-24", "SB-25", "SC-18", "SC-19", "SC-20",
    //"SC-21", "SC-22", "SC-23", "SC-24", "SC-25", "SD-20", "SD-21", "SD-22",
    //"SD-23", "SD-24", "SE-20", "SE-21", "SE-22", "SE-23", "SE-24", "SF-21",
    //"SF-22", "SF-23", "SF-24", "SG-21", "SG-22", "SG-23", "SH-21", "SH-22",
    //"SI-22"
    "SG-22"
];

if (exportToAsset) {
    gridNames.forEach(
        function (gridName) {
            var grid = grids.filter(ee.Filter.stringContains('grid_name', gridName));

            Export.image.toAsset({
                'image': integrated
                    .set('version', outputVersion)
                    .set('description', description)
                    .set('territory', 'BRAZIL')
                    .set('collection_id', 2.0),
                'description': gridName + '-' + outputVersion,
                'assetId': outputAsset + '/' + gridName + '-' + outputVersion,
                'pyramidingPolicy': {
                    ".default": "sample"
                },
                'region': grid.geometry().buffer(300).bounds(),
                'scale': 10,
                'maxPixels': 1e13
            });
        }
    );
}

var startLat = ee.Algorithms.If(ui.url.get('lat'), ui.url.get('lat'), -10.068).getInfo();
var startLon = ee.Algorithms.If(ui.url.get('lon'), ui.url.get('lon'), -53.94).getInfo();
var startZoom = ee.Algorithms.If(ui.url.get('zoom'), ui.url.get('zoom'), 6).getInfo();

Map.setCenter(startLon, startLat, startZoom);

Map.onChangeBounds(
    function changeURL(input) {
        ui.url.set({
            'lon': input.lon,
            'lat': input.lat,
            'zoom': input.zoom
        });
    }
);
