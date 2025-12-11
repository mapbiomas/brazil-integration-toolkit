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
 *  1.0.6
 *  1.1.0 - Atualização das regras de prevalência da integração
 *  1.2.0 - Atualização das regras de prevalência da integração para a coleção 4.0
 *  1.3.0 - Atualização das regras de prevalência da integração para a coleção 4.1
 *  1.3.1 - Atualização dos dados da Amazônia, Cerrado e Mata Atlântica para integração da coleção 4.1
 *  1.4.0 - Atualização dos dados da coleção 5.0
 *  1.4.1 - Otimização do filtro espacial
 *  1.5.0 - Atualização da regra de integração da mata atlântica
 *  1.6.0 - Otimização do tempo de exportação
 *  1.6.1 - Ajustes na interface
 *  1.7.0 - Atualização dos dados da coleção 6.0
 *  1.7.1 - Criação do inspetor da série temporal do píxel
 *  1.8.0 -  Atualização dos dados da coleção 7.0
 *  1.9.0 -  Atualização dos dados da coleção 7.1
 *  1.10.0 - Atualização dos dados da coleção 8.0
 *         - Refatoração para o formato do Workspace de Coleções
 *  1.11.0 - Atualização dos dados da coleção 9.0 
 *  1.12.0 - Atualização dos dados da coleção 10.0 
 *  1.13.0 - Atualização dos dados da coleção 10.1
 *
 */
var outputAsset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10_1/INTEGRATION/classification';
var outputVersion = '0-3';

var exportToAsset = false;

var description = [
    "### Description",
    "Collection 10.1 asset update",
    "- **Enhancements**: .",
    "- **Version**: {output_version}",
    " ",
    "## Layer versions",
    "| Layer             | Version | Uptade date           | User              |",
    "|:------------------|--------:|:----------------------|:------------------|",
    "| Amazônia          | 14      | Dez 03, 14:10:00      | Bruno             |",
    "| Caatinga          | 5       | Jun 18, 14:10:00      | Soltan            |",
    "| Cerrado           | 16      | Jun 18, 14:10:00      | Barbara           |",
    "| Mata Atlântica    | 83_Sf   | Jun 18, 14:10:00      | Natalia           |",
    "| Pampa             | 13      | Dez 03, 14:10:00      | Velez             |",
    "| Pantanal          | 30      | Jun 18, 14:10:00      | Mariana           |",
    "| Agua              | 1       | Jun 18, 14:10:00      | Bruno             |",
    "| Agricultura       | 9       | Jun 18, 14:10:00      | Paulo             |",
    "| Aquicultura       | 5       | Jun 18, 14:10:00      | Julia/M. Luize    |",
    "| Floresta Plantada | 9       | Jun 18, 14:10:00      | Paulo             |",
    "| Fotovoltaico      | 1       | Jun 18, 14:10:00      | Soltan            |",
    "| Mineração         | 6       | Jun 18, 14:10:00      | Julia/M. Luize    |",
    "| Pastagem          | 3       | Jun 18, 14:10:00      | Vinicius          |",
    "| Urbano            | 4       | Jun 18, 14:10:00      | Mayumi            |",
    "| Zona Costeira     | 4       | Jun 18, 14:10:00      | Julia/M. Luize    |",
];

description = description.join("\n")
    .replace('{output_version}', outputVersion);

// import modules
var Legend = require('users/joaovsiqueira1/packages:Legend.js');
var Palettes = require('users/mapbiomas/modules:Palettes.js');

var palette = Palettes.get('classification9');

var App = {

    options: {
        // app version
        version: '1.13.0',

        logo: {
            uri: 'gs://mapbiomas-public/mapbiomas-logos/mapbiomas-logo-horizontal.b64',
            base64: null
        },

        assets: [
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/GENERAL/classification-amz',
                'territory': 'AMAZONIA',
                'type': 'classification_singleband_collection',
                'version': '14',
                'theme': 'AMAZONIA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/GENERAL/classification-caa',
                'territory': 'CAATINGA',
                'type': 'classification_singleband_collection',
                'version': '5',
                'theme': 'CAATINGA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/GENERAL/classification-cer-ft',
                'territory': 'CERRADO',
                'type': 'classification_singleband_collection',
                'version': '16',
                'theme': 'CERRADO'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/GENERAL/classification-mat-ft',
                'territory': 'MATAATLANTICA',
                'type': 'classification_multiband_collection',
                'version': '83_Sf',
                'theme': 'MATAATLANTICA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/GENERAL/classification-pam-ft',
                'territory': 'PAMPA',
                'type': 'classification_singleband_collection',
                'version': '13',
                'theme': 'PAMPA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/GENERAL/classification-pan-ft',
                'territory': 'PANTANAL',
                'type': 'classification_multiband_collection',
                'version': '30',
                'theme': 'PANTANAL'
            },
            // transversal data
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/AGRICULTURE/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '9',
                'theme': 'AGRICULTURA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/AGRICULTURE/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '9',
                'theme': 'FLORESTAPLANTADA'
            },
            // {
            //     'asset_id': 'projects/mapbiomas-workspace/TRANSVERSAIS/COLECAO8/agricultura-irrigada',
            //     'territory': 'BRAZIL',
            //     'type': 'classification_singleband_collection',
            //     'version': '1',
            //     'theme': 'AGRICULTURAIRRIGADA'
            // },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/WATER/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '1',
                'theme': 'AGUA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/AQUACULTURE/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '5',
                'theme': 'AQUICULTURA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/URBAN/classification-ft',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '4',
                'theme': 'INFRAURBANA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/MINING/classification-ft',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '6',
                'theme': 'MINERACAO'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/PASTURE/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '3',
                'theme': 'PASTAGEM'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/COASTAL-ZONE/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '4',
                'theme': 'ZONACOSTEIRA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/REEFS/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '1',
                'theme': 'CORAIS'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/SOLAR-PANELS/classification',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_collection',
                'version': '1',
                'theme': 'FOTOVOLTAICO'
            },

            // collections
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection3_1/mapbiomas_collection31_integration_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'COLLECTION31'
            },
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection4_1/mapbiomas_collection41_integration_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'COLLECTION41'
            },
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection5/mapbiomas_collection50_integration_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'COLLECTION50'
            },
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection6/mapbiomas_collection60_integration_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'COLLECTION60'
            },
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection7/mapbiomas_collection70_integration_v2',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'COLLECTION70'
            },
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection7_1/mapbiomas_collection71_integration_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'COLLECTION71'
            },
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection8/mapbiomas_collection80_integration_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'COLLECTION80'
            },
            {
                'asset_id': 'projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'COLLECTION90'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10_1/INTEGRATION/classification',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_collection',
                'version': '0-2',
                'theme': 'COLLECTION100'
            },
            // mosaic data
            {
                'asset_id': 'projects/nexgenmap/MapBiomas2/LANDSAT/BRAZIL/mosaics-2',
                'territory': 'BRAZIL',
                'type': 'mosaic',
                'version': '2',
                'theme': 'MOSAIC'
            },
            // other
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO9/biomes-coastal-zone-raster',
                'territory': 'BRAZIL',
                'type': 'classification_singleband_image',
                'version': null,
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
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/pampa-regions-raster',
                'territory': 'PAMPA',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'PAMPAREGIONS'
            },
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO6/level_2_drainage_basin_pnrh_per_biome-raster',
                'territory': 'CAATINGA',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'BACIAS_L2'
            },
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/areas-protegidas-cerrado-itg_v2',
                'territory': 'CERRADO',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'CER_AP'
            },
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/bLPeixe_col8-raster',
                'territory': 'PAMPA',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'PAMPA_LAGOA_PEIXES'
            },
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/caatinga-irece-raster', //camada revisa para a coleção 9.0
                'territory': 'CAATINGA',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'CAATINGA_IRECE'
            },
            {
                'asset_id': 'projects/mapbiomas-workspace/AUXILIAR/pantanal-agriculture-regions',
                'territory': 'PANTANAL',
                'type': 'classification_singleband_image',
                'version': null,
                'theme': 'PANTANAL_AGRICULTURA'
            },
            {
                'asset_id': 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-10/AGRICULTURE/classification-soja-acumulada',
                'territory': 'BRAZIL',
                'type': 'classification_multiband_image',
                'version': null,
                'theme': 'SOJA_ACUMULADA'
            },
        ],

        'territory_id': {
            amz: 12,
            caa: 13,
            cer: 14,
            mat: 15,
            pam: 16,
            pan: 17,
        },

        year: '2024',

        years: [
            1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992,
            1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
            2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,
            2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
            2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
        ],

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
            'collection90': null,
            'collection100': null,
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

        'legend': {
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
                    [palette[70], 70, ''],
                    [palette[71], 71, ''],
                    [palette[72], 72, ''],
                    [palette[73], 73, ''],
                    [palette[74], 74, ''],
                    [palette[75], 75, 'Fotovoltaico'],
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
                'label': 'Fotovoltaico',
                'rule': {
                    'class_input': 1,
                    'class_output': 75,
                    // 'source': ee.Image(0),
                    'source': App.getAssetData('FOTOVOLTAICO')[0].image.select(['classification', App.options.year].join('_')),
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
                            'source': App.getAssetData('STATES')[0].image.select('classification_' + App.options.years[App.options.years.length - 1]),
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
                'exception': {
                    'rule': [
                        {
                            'class_input': [24],
                            'source': App.getAssetData('INFRAURBANA')[0].image.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': 24
                }
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
                'exception': {
                    'rule': [
                        {
                            'class_input': [24],
                            'source': App.getAssetData('INFRAURBANA')[0].image.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': 24
                }
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
                'prevalence_id': 8,
                'label': 'Infraestrutura Urbana',
                'rule': {
                    'class_input': 24,
                    'class_output': 24,
                    'source': App.getAssetData('INFRAURBANA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }, {
                            'class_input': [33],
                            'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                        }],
                    'class_output': 33
                }
            },
            {
                'prevalence_id': 9,
                'label': 'Silvicultura',
                'rule': {
                    'class_input': 9,
                    'class_output': 9,
                    'source': App.getAssetData('FLORESTAPLANTADA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            1
                        ],
                        'source': App.getAssetData('PAMPA_LAGOA_PEIXES')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
                    },
                },
                'exception': {
                    'type': 'multiclass',
                    'rule': [
                        {
                            'class_input': [3, 11, 12, 29, 33, 49, 50],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 11, 12, 29, 33, 49, 50]
                },
            },
            {
                'prevalence_id': 10,
                'label': 'Silvicultura',
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
                        'source': App.options.biomes
                    },
                },
                'exception': null,
            },
            {
                'prevalence_id': 11,
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
                'prevalence_id': 12,
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
                'prevalence_id': 13,
                'label': 'Cana',
                'rule': {
                    'class_input': 20,
                    'class_output': 20,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }, {
                            'class_input': [33],
                            'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                        }],
                    'class_output': 33
                }
            },
            {
                'prevalence_id': 14,
                'label': 'Cana',
                'rule': {
                    'class_input': 20,
                    'class_output': 20,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'type': 'multiclass', // multiclass or multilayer (default is multilayer)
                    'rule': [
                        {
                            'class_input': [3, 4, 6, 11, 12, 29, 33, 15], //EDITED
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 4, 6, 11, 12, 29, 33, 15] // expected to be a list
                }
            },
            {
                'prevalence_id': 15,
                'label': 'Soja',
                'rule': {
                    'class_input': 39,
                    'class_output': 39,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 16,
                'label': 'Soja',
                'rule': {
                    'class_input': 39,
                    'class_output': 39,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'type': 'multiclass', // multiclass or multilayer (default is multilayer)
                    'rule': [
                        {
                            'class_input': [3, 4, 6, 11, 12, 29, 33, 41],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 4, 6, 11, 12, 29, 33, 41] // expected to be a list
                }
            },
            {
                'prevalence_id': 17, // PAMPA EXCEPTION //todo: REVISAR 
                'label': 'Soja',
                'rule': {
                    'class_input': 39,
                    'class_output': 39,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            1
                        ],
                        'source': App.getAssetData('PAMPA_LAGOA_PEIXES')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
                    },
                },
                'exception': {
                    'type': 'multiclass',
                    'rule': [
                        {
                            'class_input': [3, 11, 12, 29, 33, 49, 50],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 11, 12, 29, 33, 49, 50]
                },
            },
            {
                'prevalence_id': 18, // PAMPA EXCEPTION
                'label': 'Soja',
                'rule': {
                    'class_input': 39,
                    'class_output': 39,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'type': 'multiclass', // multiclass or multilayer (default is multilayer)
                    'rule': [
                        {
                            'class_input': [11, 33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [11, 33] // expected to be a list
                }
            },
            {
                'prevalence_id': 19,
                'label': 'Arroz',
                'rule': {
                    'class_input': 40,
                    'class_output': 40,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 20,
                'label': 'Arroz',
                'rule': {
                    'class_input': 40,
                    'class_output': 40,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [33], //todo: checar tb com o GT agua
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': 33
                }
            },
            {
                'prevalence_id': 21,
                'label': 'Arroz',
                'rule': {
                    'class_input': 40,
                    'class_output': 40,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.mat,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'type': 'multiclass',
                    'rule': [
                        {
                            'class_input': [3, 12, 33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 12, 33]
                }
            },
            {
                'prevalence_id': 22, // PAMPA EXCEPTION
                'label': 'Arroz',
                'rule': {
                    'class_input': 40,
                    'class_output': 40,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            1
                        ],
                        'source': App.getAssetData('PAMPA_LAGOA_PEIXES')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
                    },
                },
                'exception': {
                    'type': 'multiclass',
                    'rule': [
                        {
                            'class_input': [3, 11, 12, 29, 33, 49, 50],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 11, 12, 29, 33, 49, 50]
                },

            },
            {
                'prevalence_id': 23, // PAMPA EXCEPTION
                'label': 'Arroz',
                'rule': {
                    'class_input': 40,
                    'class_output': 40,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'type': 'multiclass', // multiclass or multilayer (default is multilayer)
                    'rule': [
                        {
                            'class_input': [11, 33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [11, 33] // expected to be a list
                }

            },
            {
                'prevalence_id': 24,
                'label': 'Algodão',
                'rule': {
                    'class_input': 62,
                    'class_output': 62,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'type': 'multiclass',
                    'rule': [
                        {
                            'class_input': [3, 4, 6, 9, 11, 12, 15, 21, 25, 29, 33, 41],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 4, 6, 9, 11, 12, 15, 21, 25, 29, 33, 41]
                },
            },
            {
                'prevalence_id': 25,
                'label': 'Algodão',
                'rule': {
                    'class_input': 62,
                    'class_output': 62,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 26,
                'label': 'Algodão',
                'rule': {
                    'class_input': 62,
                    'class_output': 62,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1]) //TODO: revisar após integração
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
                'prevalence_id': 27,
                'label': 'Outras lavouras temporárias',
                'rule': {
                    'class_input': 41,
                    'class_output': 41,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            1
                        ],
                        'source': App.getAssetData('PAMPA_LAGOA_PEIXES')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
                    },
                },
                'exception': {
                    'type': 'multiclass',
                    'rule': [
                        {
                            'class_input': [3, 11, 12, 29, 33, 49, 50],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 11, 12, 29, 33, 49, 50]
                },
            },
            {
                'prevalence_id': 28,
                'label': 'Outras lavouras temporárias',
                'rule': {
                    'class_input': 41,
                    'class_output': 41,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [33], //todo: checar com o GT agua
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': 33
                }
            },
            {
                'prevalence_id': 29, // PAMPA EXCEPTION
                'label': 'Arroz',
                'rule': {
                    'class_input': 41,
                    'class_output': 41,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'type': 'multiclass', // multiclass or multilayer (default is multilayer)
                    'rule': [
                        {
                            'class_input': [11, 33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [11, 33] // expected to be a list
                }

            },
            {
                'prevalence_id': 30,
                'label': 'Outras lavouras temporárias',
                'rule': {
                    'class_input': 41,
                    'class_output': 41,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'type': 'multiclass', // multiclass or multilayer (default is multilayer)
                    'rule': [
                        {
                            'class_input': [3, 4, 6, 11, 12, 29, 33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }
                    ],
                    'class_output': [3, 4, 6, 11, 12, 29, 33] // expected to be a list
                }
            },
            {
                'prevalence_id': 31,
                'label': 'Café',
                'rule': {
                    'class_input': 46,
                    'class_output': 46,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }, {
                            'class_input': [33],
                            'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                        }],
                    'class_output': 33
                }
            },
            {
                'prevalence_id': 32,
                'label': 'Café',
                'rule': {
                    'class_input': 46,
                    'class_output': 46,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1]) //TODO: revisar após integração
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
                'prevalence_id': 33,
                'label': 'Citrus',
                'rule': {
                    'class_input': 47,
                    'class_output': 47,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1]) //TODO: revisar após integração
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
                'prevalence_id': 34,
                'label': 'Citrus',
                'rule': {
                    'class_input': 47,
                    'class_output': 47,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.mat,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1]) //TODO: revisar após integração
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
                'prevalence_id': 35,
                'label': 'Plantio de Palma',
                'rule': {
                    'class_input': 35,
                    'class_output': 35,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 36,
                'label': 'Outras lavouras perenes',
                'rule': {
                    'class_input': 48,
                    'class_output': 48,
                    'source': App.getAssetData('AGRICULTURA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [33],
                            'source': App.options.classification.select(['classification', App.options.year].join('_'))
                        }, {
                            'class_input': [33],
                            'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                        }],
                    'class_output': 33
                }
            },
            {
                'prevalence_id': 37,
                'label': 'Lavoura temporaria (biomas)',
                'rule': {
                    'class_input': 18, // TODO: revisar com a equipe da Amazônia
                    'class_output': 41,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.mat
                        ],
                        'source': App.options.biomes
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                }
            },
            {
                'prevalence_id': 38,
                'label': 'Restinga Herbácea/Arbustiva',
                'rule': {
                    'class_input': 50,
                    'class_output': 50,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 39,
                'label': 'Rios, Lagos e Oceanos (GT)',
                'rule': {
                    'class_input': 33,
                    'class_output': 33,
                    'source': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.cer,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 40,
                'label': 'Rios, Lagos e Oceanos (biomes)',
                'rule': {
                    'class_input': 33,
                    'class_output': 33, // edited
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 41,
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
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 42,
                'label': 'Outras Áreas não Vegetadas',
                'rule': {
                    'class_input': 25,
                    'class_output': 25,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.cer
                        ],
                        'source': App.options.biomes
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                }
            },
            {
                'prevalence_id': 43,
                'label': 'Outras Áreas não Vegetadas',
                'rule': {
                    'class_input': 22,
                    'class_output': 25,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.cer
                        ],
                        'source': App.options.biomes
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                }
            },
            {
                'prevalence_id': 44,
                'label': 'Formação Florestal',
                'rule': {
                    'class_input': 3,
                    'class_output': 3,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null,
            },
            {
                'prevalence_id': 45, //
                'label': 'Formação Savânica',
                'rule': {
                    'class_input': 4,
                    'class_output': 4,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.caa,
                            App.options.territory_id.mat,
                            App.options.territory_id.pam,
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': null,
            },
            {
                'prevalence_id': 46, // CERRADO EXCEPTION
                'label': 'Formação Savânica',
                'rule': {
                    'class_input': 4,
                    'class_output': 4,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [0],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                },
            },
            {
                'prevalence_id': 47,
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
                'prevalence_id': 48,
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
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 49,
                'label': 'Área Úmida Natural não Florestal',
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
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 50,
                'label': 'Área Úmida Natural não Florestal',
                // Dado classificado pelos biomas
                'rule': {
                    'class_input': 11,
                    'class_output': 11,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1]) //TODO: revisar após integração
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 11
                },
            },
            {
                'prevalence_id': 51, // CERRADO EXCEPTION
                'label': 'Área Úmida Natural não Florestal',
                'rule': {
                    'class_input': 11,
                    'class_output': 11,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [0],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                },
            },
            {
                'prevalence_id': 52,
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
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 53,
                'label': 'Formação Campestre',
                'rule': {
                    'class_input': 12,
                    'class_output': 12,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1]) //TODO: revisar após integração
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 12
                },
            },
            {
                'prevalence_id': 54, // CERRADO EXCEPTION
                'label': 'Formação Campestre',
                'rule': {
                    'class_input': 12,
                    'class_output': 12,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [0],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                },
            },
            {
                'prevalence_id': 55,
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
                        'source': App.options.biomes
                    },
                    {
                        'class_input': [15],
                        'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_'))
                    }
                    ],
                    'class_output': 15
                }
            },
            {
                'prevalence_id': 56,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.caa,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CAATINGA_IRECE')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
                    }],
                    'class_output': 21
                }
            },
            {
                'prevalence_id': 57,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.pam,
                        ],
                        'source': App.options.biomes
                    }],
                    'class_output': 21
                }
            },
            {
                'prevalence_id': 58,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [41, 19],
                        'source': App.options.classification.select(['classification', App.options.year].join('_'))
                    }],
                    'class_output': 41
                }
            },
            {
                'prevalence_id': 59,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.amz,
                            App.options.territory_id.mat,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 60,
                'label': 'Pastagem',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.cer,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [1],
                        'source': App.getAssetData('CER_AP')[0].image.select('classification_' + App.options.years[App.options.years.length - 1])
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
                'prevalence_id': 61,
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
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 62, // especifica para a exceção em ucs no cerrado
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
                        'source': App.options.biomes
                    }
                },
                'exception': null
            },
            {
                'prevalence_id': 63,
                'label': 'Mosaico de Agricultura e Pastagem',
                'rule': {
                    'class_input': 21,
                    'class_output': 21,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': {
                        'class_input': [
                            App.options.territory_id.pan,
                        ],
                        'source': App.options.biomes
                    }
                },
                'exception': {
                    'rule': [{
                        'class_input': [
                            App.options.territory_id.pan
                        ],
                        'source': App.options.biomes
                    },
                    ],
                    'class_output': 15
                }
            },
            {
                'prevalence_id': 64,
                'label': 'Lavoura perene (biomas)',
                'rule': {
                    'class_input': 19,
                    'class_output': 41,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 65,
                'label': 'Lavoura perene (biomas)',
                'rule': {
                    'class_input': 41,
                    'class_output': 41,
                    'source': App.options.classification.select(['classification', App.options.year].join('_')),
                    'source_mask': null
                },
                'exception': null
            },
            {
                'prevalence_id': 66,
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
                'prevalence_id': 67,
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

        return data.unmask(0, false);
    },

    getClassificationSinglebandImage: function (obj) {

        var data = ee.Image(obj.asset_id).rename('classification_' + String(App.options.years[App.options.years.length - 1]));

        // print(obj.theme, obj.type, data);

        return data.unmask(0, false);
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
            .filterMetadata('version', 'equals', '1')
            .mosaic();

        var caa = collection
            .filterMetadata('biome', 'equals', 'CAATINGA')
            .filterMetadata('version', 'equals', '1')
            .mosaic();

        var cer = collection
            .filterMetadata('biome', 'equals', 'CERRADO')
            .filterMetadata('version', 'equals', '1')
            .mosaic();

        var mat = collection
            .filterMetadata('biome', 'equals', 'MATAATLANTICA')
            .filterMetadata('version', 'equals', '1')
            .mosaic();

        var pam = collection
            .filterMetadata('biome', 'equals', 'PAMPA')
            .filterMetadata('version', 'equals', '1')
            .mosaic();

        var pan = collection
            .filterMetadata('biome', 'equals', 'PANTANAL')
            .filterMetadata('version', 'equals', '1')
            .mosaic();

        var image = ee.ImageCollection.fromImages([
            caa.mask(App.options.biomes.eq(App.options.territory_id.caa)),
            amz.mask(App.options.biomes.eq(App.options.territory_id.amz)),
            cer.mask(App.options.biomes.eq(App.options.territory_id.cer)),
            mat.mask(App.options.biomes.eq(App.options.territory_id.mat)),
            pam.mask(App.options.biomes.eq(App.options.territory_id.pam)),
            pan.mask(App.options.biomes.eq(App.options.territory_id.pan)),
        ]).mosaic();

        return image;
    },

    getRegions: function () {

        var regions = App.getAssetData('BIOMES')[0].image.select('classification_' + String(App.options.years[App.options.years.length - 1]));
        return regions;
    },

    getCollections: function () {

        App.options.data.collection31 = App.getAssetData('COLLECTION31')[0].image
            .select(['classification', App.options.year].join('_'));

        App.options.data.collection41 = App.getAssetData('COLLECTION41')[0].image
            .select(['classification', App.options.year].join('_'));

        App.options.data.collection50 = App.getAssetData('COLLECTION50')[0].image
            .select(['classification', App.options.year].join('_'));

        App.options.data.collection60 = App.getAssetData('COLLECTION60')[0].image
            .select(['classification', App.options.year].join('_'));

        App.options.data.collection70 = App.getAssetData('COLLECTION70')[0].image
            .select(['classification', App.options.year].join('_'));

        App.options.data.collection71 = App.getAssetData('COLLECTION71')[0].image
            .select(['classification', App.options.year].join('_'));

        App.options.data.collection80 = App.getAssetData('COLLECTION80')[0].image
            .select(['classification', App.options.year].join('_'));

        App.options.data.collection90 = App.getAssetData('COLLECTION90')[0].image
            .select(['classification', App.options.year].join('_'));

        App.options.data.collection100 = App.getAssetData('COLLECTION100')[0].image
            .select(['classification', App.options.year].join('_'));

    },

    createBaseImage: function () {

        var years = ee.List(App.options.years);

        var imageList = ee.List.repeat(ee.Image(), years.length());

        var image = ee.ImageCollection.fromImages(imageList).toBands();

        var bandNames = years.map(
            function (year) {
                return ee.String('classification_').cat(ee.Number(year).format('%.0f'));
            }
        );

        return image.rename(bandNames);

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
            {
                'name': 'Corais (version ' + App.getAssetData('CORAIS')[0].version + ')',
                'data': App.getAssetData('CORAIS')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [69].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
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
                'name': 'Pasture (version ' + App.getAssetData('PASTAGEM')[0].version + ')',
                'data': App.getAssetData('PASTAGEM')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
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
            {
                'name': 'Water (version ' + App.getAssetData('AGUA')[0].version + ')',
                'data': App.getAssetData('AGUA')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [33].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            {
                'name': 'Solar Panels (version ' + App.getAssetData('FOTOVOLTAICO')[0].version + ')',
                'data': App.getAssetData('FOTOVOLTAICO')[0].image.select(['classification', App.options.year].join('_')).selfMask(),
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': {
                    'params': {
                        "title": null,
                        "layers": [75].map(App.ui.filterLegend),
                        "style": App.options.legend.params.style,
                        "orientation": App.options.legend.params.orientation
                    }
                }
            },
            {
                'name': 'Collection 7.1',
                'data': App.options.data.collection71,
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': App.options.legend
            },
            {
                'name': 'Collection 8.0 (version ' + App.getAssetData('COLLECTION80')[0].version + ')',
                'data': App.options.data.collection80,
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': App.options.legend
            },
            {
                'name': 'Collection 9.0 (version ' + App.getAssetData('COLLECTION90')[0].version + ')',
                'data': App.options.data.collection90,
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': App.options.legend
            },
            {
                'name': 'Collection 10.1 (version ' + App.getAssetData('COLLECTION100')[0].version + ')',
                'data': App.options.data.collection100,
                'shown': false,
                'vis': App.options.vis.integration,
                'legend': App.options.legend
            },
            {
                'name': 'Protected Areas',
                'data': App.getAssetData('CER_AP')[0].image.select(App.options.years.length - 1).selfMask(),
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
                'data': App.getAssetData('CAATINGA_IRECE')[0].image.select(App.options.years.length - 1),
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
                'data': App.getAssetData('BIOMES')[0].image.select(App.options.years.length - 1),
                'shown': false,
                'vis': {
                    'format': 'png',
                    'min': 1,
                    'max': 17,
                    'opacity': 1.0,
                    'palette': [
                        '#0072B2',
                        '#009E73',
                        '#D55E00',
                        '#CC79A7',
                        '#F0E442',
                        '#333333',
                        '#e53238'
                    ]
                },
                'legend': null
            },
        ];
    },

    loadAssets: function () {

        App.options.assets = App.options.assets.map(
            function (obj) {

                var baseImage = App.createBaseImage();

                switch (obj.type) {
                    case 'classification_singleband_collection':
                        obj.image = App.getClassificationSinglebandCollection(obj).selfMask();
                        obj.image = baseImage.addBands({ srcImg: obj.image, overwrite: true });
                        break;

                    case 'classification_singleband_image':
                        obj.image = App.getClassificationSinglebandImage(obj).selfMask();
                        obj.image = baseImage.addBands({ srcImg: obj.image, overwrite: true });
                        break;

                    case 'classification_multiband_collection':
                        obj.image = App.getClassificationMultibandCollection(obj).selfMask();
                        obj.image = baseImage.addBands({ srcImg: obj.image, overwrite: true });
                        break;

                    case 'classification_multiband_image':
                        obj.image = App.getClassificationMultibandImage(obj).selfMask();
                        obj.image = baseImage.addBands({ srcImg: obj.image, overwrite: true });
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

    integrate: function (year) {

        App.options.year = String(year);

        App.options.classification = App.getClassifications();

        App.options.prevalenceList = App.getPrevalenceList();

        var prevalence_id = App.options.prevalenceList.length - 1;

        App.options.integrated = App.recursion(
            ee.Image(0),                           // initial image
            App.options.prevalenceList,            // list of integration rules ordered by prevalence
            prevalence_id                          // start with the less prevalenced rules id
        );

        return App.options.integrated.mask(App.options.biomes.neq(0))
            .rename('classification_' + App.options.year);

    },

    recursion: function (image, prevalenceList, prevalence_id) {

        var integrated = App.applyRule(image, prevalenceList[prevalence_id]);

        if (prevalence_id > 0) {

            integrated = App.recursion(
                integrated,
                prevalenceList,
                prevalence_id - 1
            );

        }

        return integrated;
    },

    // filterByPrevalence: function (obj) {

    //     return obj.prevalence_id == this.id;

    // },

    // integrate: function (year) {

    //     App.options.year = String(year);

    //     App.options.classification = App.getClassifications();

    //     App.options.prevalenceList = App.getPrevalenceList();

    //     App.options.integrated = App.recursion(
    //         ee.Image(),
    //         App.options.prevalenceList,
    //         App.options.prevalenceList.filter(App.filterByPrevalence, {
    //             'id': App.options.prevalenceList.length
    //         })
    //     );

    //     return App.options.integrated.mask(App.options.biomes.neq(0))
    //         .rename('classification_' + App.options.year);

    // },

    // recursion: function (image, prevalenceList, obj) {

    //     var integrated;

    //     obj = obj[0];

    //     integrated = App.applyRule(image, obj);

    //     if (obj.prevalence_id > 1) {

    //         integrated = App.recursion(
    //             integrated,
    //             prevalenceList,
    //             prevalenceList.filter(App.filterByPrevalence, {
    //                 'id': obj.prevalence_id - 1
    //             })
    //         );

    //     }

    //     return integrated;
    // },

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
                    '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992',
                    '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000',
                    '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008',
                    '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016',
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

App.init();
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

// integration
var integratedList = ee.List(
    App.options.years.map(
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

/**
  * Export to asset
  */
var assetGrids = 'projects/mapbiomas-workspace/AUXILIAR/cartas';

var grids = ee.FeatureCollection(assetGrids);

var gridNames = [
    "NA-19", "NA-20", "NA-21", "NA-22", "NB-20", "NB-21", "NB-22", "SA-19",
    "SA-20", "SA-21", "SA-22", "SA-23", "SA-24", "SB-18", "SB-19", "SB-20",
    "SB-21", "SB-22", "SB-23", "SB-24", "SB-25", "SC-18", "SC-19", "SC-20",
    "SC-21", "SC-22", "SC-23", "SC-24", "SC-25", "SD-20", "SD-21", "SD-22",
    "SD-23", "SD-24", "SE-20", "SE-21", "SE-22", "SE-23", "SE-24", "SF-21",
    "SF-22", "SF-23", "SF-24", "SG-21", "SG-22", "SG-23", "SH-21", "SH-22",
    "SI-22"
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
                    .set('collection_id', 10.1),
                'description': gridName + '-' + outputVersion,
                'assetId': outputAsset + '/' + gridName + '-' + outputVersion,
                'pyramidingPolicy': {
                    ".default": "mode"
                },
                'region': grid.geometry().buffer(300).bounds(),
                'scale': 30,
                'maxPixels': 1e13
            });
        }
    );
}

var startLat = ee.Algorithms.If(ui.url.get('lat'), ui.url.get('lat'), -3.217073573003624).getInfo();
var startLon = ee.Algorithms.If(ui.url.get('lon'), ui.url.get('lon'), -59.32618540989001).getInfo();
var startZoom = ee.Algorithms.If(ui.url.get('zoom'), ui.url.get('zoom'), 13).getInfo();

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
