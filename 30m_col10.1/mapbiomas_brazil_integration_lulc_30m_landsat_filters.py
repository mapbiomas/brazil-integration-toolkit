# ==============================
# CONFIGURAÇÕES INICIAIS
# ==============================
import ee
import sys
import os
import time
import textwrap
from datetime import timedelta
from pprint import pprint
from concurrent.futures import ThreadPoolExecutor

# Ensure the script can import modules from the parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.region_utils import RegionUtils

# ================================
# AUTHENTICATION AND INITIALIZATION
# ================================
try:
    ee.Initialize(project='mapbiomas-brazil')
except Exception:
    print("Authenticating Earth Engine...")
    ee.Authenticate()
    ee.Initialize(project='mapbiomas')

# ==============================
# GENERAL SCRIPT CONFIGURATION
# ==============================
# Região e coleção
REGION_NAME = 'brazil'
REGION_ISO3 = 'BRA'
# TERRITORY_ID = '1_1_1'
COLLECTION_ID = '10_1'

#
# Versioning
#
VERSION_INPUT_INTEGRATION   = '0-4'
VERSION_SILVICULTURA_FILTER = f'{VERSION_INPUT_INTEGRATION}-sil-1'
VERSION_GENERAL_FILTER      = f'{VERSION_INPUT_INTEGRATION}-gen-1'
VERSION_AGRICULTURE_FILTER  = f'{VERSION_INPUT_INTEGRATION}-agr-1'
VERSION_PASTURE_FILTER      = f'{VERSION_INPUT_INTEGRATION}-pas-1'
VERSION_ALERTAS_FILTER      = f'{VERSION_INPUT_INTEGRATION}-ale-1'
VERSION_TRANSITIONS_FILTER  = f'{VERSION_INPUT_INTEGRATION}-tra-1'

# Year range between 1985 and 2024
YEARS = list(range(1985, 2025))

# Asset paths
ASSET_COLLECTION      = f'projects/mapbiomas-{REGION_NAME}/assets/LAND-COVER/COLLECTION-{COLLECTION_ID}'
ASSET_INTEGRATION     = f'{ASSET_COLLECTION}/INTEGRATION/classification'
ASSET_INTEGRATION_FT  = f'{ASSET_COLLECTION}/INTEGRATION/classification-ft'
ASSET_BIOMES          = 'projects/mapbiomas-workspace/AUXILIAR/ESTATISTICAS/COLECAO9/biomes-coastal-zone-raster'
ASSET_GRID            = 'projects/mapbiomas-workspace/AUXILIAR/cim-world-1-250000'
ASSET_ALERTAS         = 'projects/mapbiomas/assets/RAD_2024_alerts_2'

# Bands
BAND_PREFIX = 'classification_'

region_utils = RegionUtils()

# MapBiomas 1:250,000 grids
GRID_NAMES = region_utils.get_grid_names(iso3=REGION_ISO3)

# BBox of the region
REGION_BBOX = region_utils.get_bbox(iso3=REGION_ISO3)

EXPORT_SCALE = 30
EXPORT_MAX_PIXELS = 1e13
EXPORT_PYRAMIDING_POLICY = "MODE"

# ==============================
# SILVICULTURE FILTER RULES
# ==============================

# classe que devem ser remapeadas para 1
SILVICULTURE_NATURAL_CLASSES = [3, 4, 5, 6, 49, 11, 50, 13]

# classes que devem ser remapeadas para 2
SILVICULTURE_FARMING_CLASSES = [12, 15, 18, 19, 39, 20, 40, 62, 41, 36, 46, 47, 48, 21]

# classes que devem ser remapeadas para 3
SILVICULTURE_CLASSES = [9]

# novas classes apos o remap
REMAPED_CLASSES= [1, 2, 3]

# Natural Classes = 1, Farming Classes = 2, Silviculture Classes = 3
SILVICULTURE_RULES = [
    [[2, 1, 1, 1, 1, 1, 3], [2, 3, 3, 3, 3, 3, 3]],
    [[2, 2, 1, 1, 1, 1, 3], [2, 2, 3, 3, 3, 3, 3]],
    [[2, 2, 2, 1, 1, 1, 3], [2, 2, 2, 3, 3, 3, 3]],
    [[2, 2, 2, 2, 1, 1, 3], [2, 2, 2, 2, 3, 3, 3]],
    [[2, 2, 2, 2, 2, 1, 3], [2, 2, 2, 2, 2, 3, 3]],
    [[3, 3, 3, 1, 1, 1, 2], [3, 3, 3, 3, 3, 3, 2]],
    [[3, 3, 3, 3, 1, 1, 2], [3, 3, 3, 3, 3, 3, 2]],
    [[3, 3, 3, 1, 1, 2, 2], [3, 3, 3, 3, 2, 2, 2]],
    [[3, 3, 3, 3, 2, 2, 3], [3, 3, 3, 3, 3, 3, 3]],
    [[3, 3, 3, 2, 2, 3, 3], [3, 3, 3, 3, 3, 3, 3]],
    [[3, 3, 2, 2, 3, 3, 3], [3, 3, 3, 3, 3, 3, 3]],
    [[3, 2, 2, 2, 2, 3, 3], [3, 3, 3, 3, 3, 3, 3]],
]

SILVICULTURE_RULES_LAST = [
    [[3, 1, 1, 1, 1, 1, 1], [3, 3, 3, 3, 3, 3, 3]],
    [[3, 3, 1, 1, 1, 1, 1], [3, 3, 3, 3, 3, 3, 3]],
    [[3, 3, 3, 1, 1, 1, 1], [3, 3, 3, 3, 3, 3, 3]],
    [[3, 3, 3, 3, 1, 1, 1], [3, 3, 3, 3, 3, 3, 3]],
    [[3, 3, 3, 3, 3, 1, 1], [3, 3, 3, 3, 3, 3, 3]],
    [[3, 3, 3, 3, 3, 3, 1], [3, 3, 3, 3, 3, 3, 3]],
]

SILVICULTURE_INSPECTOR_POINTS = ee.Geometry.MultiPoint([
    [-48.8522690371596, -23.35691895424874]
])

# ==============================
# GENERAL FILTER RULES
# ==============================
GENERAL_KERNEL3_YEARS = YEARS[1:-1][::-1]       # (1985-2024) 1986 a 2023 (reverso)
GENERAL_KERNEL4_YEARS = YEARS[2:-1][::-1]       # (1985-2024) 1987 a 2023 (reverso)
GENERAL_KERNEL3_LAST_YEAR = [YEARS[-2]]         # (1985-2024) 2023

BIOME_IDS = {
    'amz': 12, 
    'caa': 13, 
    'cer': 14, 
    'mat': 15, 
    'pam': 16, 
    'pan': 17
}

GENERAL_CLASSES_BIOME = {
    'amz': [15, 3, 6, 4, 9],
    'caa': [3, 22, 25, 29, 12, 49, 50, 4],
    'cer': [4, 3, 12, 11, 21, 15, 9, 29, 25],
    'mat': [3, 4, 11, 12, 13, 29, 49, 50, 21, 24, 25, 15, 9, 19, 36, 23, 30, 46, 47, 48],
    'pam': [25, 9, 3, 50, 11, 29, 30, 24, 21, 18, 23, 49, 12],
    'pan': [3, 15, 25, 30, 41],
}

GENERAL_EXCEPTIONS = {
    'amz': {
        'k3': [
            [[3, 15, 41], [3, 15, 41]],
            [[3, 15, 39], [3, 15, 39]],
            [[33, 15, 3], [33, 3, 3]],
            [[33, 15, 12], [33, 12, 12]],
            [[33, 15, 33], [33, 12, 33]],
            [[33, 15, 11], [33, 12, 11]],
        ],
        'k3_last': [],
        'k4': [],
    },
    'caa': {'k3': [], 'k3_last': [], 'k4': []},
    'cer': {'k3': [], 'k3_last': [], 'k4': []},
    'mat': {
        'k3': [[[33, 3, 11], [33, 11, 11]]],
        'k3_last': [],
        'k4': [
            [[3, 9, 9, 3], [3, 3, 3, 3]],
            [[21, 3, 3, 9], [21, 9, 9, 9]],
            [[21, 3, 3, 46], [21, 46, 46, 46]],
            [[21, 3, 3, 47], [21, 47, 47, 47]],
            [[15, 3, 3, 9], [15, 9, 9, 9]],
        ]
    },
    'pam': {
        'k3': [],
        'k3_last': [[[11, 11, 49], [11, 11, 11]]],
        'k4': []
    },
    'pan': {'k3': [], 'k3_last': [], 'k4': []},
}

#
# AGRICULTUTURE RULES
#
# Remapeamento de classes
AGRICULTURE_REMAP = {
    39: 2, # Lavoura temporária 
    20: 2, 
    40: 2, 
    62: 2, 
    41: 2,
    46: 3, # Lavoura perene 
    47: 3, 
    48: 3,
    3: 1, # Outros 
    4: 1, 
    5: 1, 
    49: 1, 
    11: 1, 
    50: 1, 
    13: 1, 
    12: 1, 
    15: 1, 
    21: 1
}

# Regras do tipo 1-2-1 → 1-1-1 ou 1-3-1 → 1-1-1
AGRICULTURE_RULES = [
    [[1, 2, 1], [1, 1, 1]],
    [[1, 3, 1], [1, 1, 1]]
]

AGRICULTURE_TARGET_YEARS = YEARS[1:-1][::-1]  # ignora ano_1 e ano_n, em ordem reversa

#
# PASTURE RULES
#
PASTURE_RULES = [
    [15, 21, 21, 21, 15],
    [15, 21, 21, 15, 15],
    [15, 15, 21, 21, 15],
    [15, 15, 21, 15, 15],
    [15, 21, 15, 15, 15],
    [15, 15, 15, 21, 15],
]

PASTURE_CLASS_ID = 15

#
# ALERTAS RULES
#
ALERTAS_DETECT_YEAR_COL = 'ANODETEC'

ALERTAS_TYPE_COL = 'VPRESSAO'

# Dicionário de tipos de alerta e seus respectivos valores
# clima_extremo: valor 1
# ilegal_mining, mining, urban_expansion: valor 3 (classe 25 permanente)
# Demais: valor 2
ALERTAS_TYPE_DICT = ee.Dictionary({
    "natural_cause": 1,
    "ilegal_mining": 3,
    "mining": 3,
    "urban_expansion": 3,
    "agriculture": 2,
    "aquaculture": 2,
    "others": 2,
    "renewable_energy_project": 2,
    "reservoir_or_dam": 2,
    "roads": 2
})

# Lista de anos iniciando em 2019
ALERTAS_YEARS = list(range(2019, YEARS[-1] + 1)) 

# Classes naturais passíveis de alerta
ALERTAS_TARGET_CLASSES = [3, 4, 5, 6, 49, 11, 50, 12, 13, 21]

# Reclassificação por bioma
ALERTAS_BIOME_IDS = {
    'amz': 12,
    'caa': 13,
    'cer': 14,
    'mat': 15,
    'pam': 16,
    'pan': 17,
}

ALERTAS_CLASS_OUTPUT = {
    'amz': 15,
    'caa': 21,
    'cer': 21,
    'mat': 21,
    'pam': 21,
    'pan': 15,
}

# ===============================
# FILTRO DE TRANSIÇÕES
# ===============================

# Número mínimo de pixels conectados para não ser considerado ruído
TRANSITIONS_MIN_CONNECTED_PIXELS = 6

# Lista de classes naturais (ex: floresta, savana, mangue etc.)
TRANSITIONS_NATURAL_CLASSES = [3, 4, 5, 6, 11, 12,  32, 49, 50]

# Lista de classes antrópicas (ex: agricultura, pastagem etc.)
TRANSITIONS_ANTHROPIC_CLASSES = [9, 15, 18, 19, 20, 21, 22, 23, 24, 25, 29, 30, 35, 36, 39, 40, 41, 46, 47, 48, 62]

#
# Execution control for each function
#
RUN_SILVICULTURE = True
RUN_GENERAL      = False
RUN_AGRICULTURE  = False
RUN_PASTURE      = False
RUN_ALERTAS      = False
RUN_TRANSITIONS  = False

# ==============================
# FUNÇÕES UTILITÁRIAS
# ==============================
def wait_until_tasks_finish(export_tasks=[], polling_interval=60):
    """
    Waits until all export tasks created by this script have finished.

    Continues monitoring even if some tasks fail. Displays status and duration at the end.
    Output is formatted with consistent alignment.
    """
    if not export_tasks:
        print("\n⚠️ No export tasks to monitor. Exiting wait function.")
        return
    
    start_time = time.time()
    print(f"\n⏳ Waiting for {len(export_tasks)} task(s) to finish...")

    completed = set()
    failed_tasks = []

    # Calculate max width for formatting
    max_len = max(len(task.status().get('description', '')) for task in export_tasks)
    label_pad = max(60, max_len + 4)

    while True:
        all_done = True

        for task in export_tasks:
            status = task.status()
            description = status.get('description', '[No Description]')
            state = status['state']

            if description in completed:
                continue

            if state in ['READY', 'RUNNING']:
                all_done = False
                print(f"🚀 {description.ljust(label_pad)} | {time.strftime('%Y-%m-%dT%H:%M:%S')} | Status: {state}")
            elif state == 'FAILED':
                error_message = status.get('error_message', 'No error message provided.')
                failed_tasks.append((description, error_message))
                completed.add(description)
                print(f"❌ {description.ljust(label_pad)} | {time.strftime('%Y-%m-%dT%H:%M:%S')} | Status: {state} | Error: {error_message} ")
            elif state == 'COMPLETED':
                completed.add(description)
                print(f"✅ {description.ljust(label_pad)} | {time.strftime('%Y-%m-%dT%H:%M:%S')} | Status: {state}")
            elif state == 'CANCELLED':
                completed.add(description)
                print(f"⚠️ {description.ljust(label_pad)} | {time.strftime('%Y-%m-%dT%H:%M:%S')} | Status: {state}")

        if all_done and len(completed) == len(export_tasks):
            total_time = time.time() - start_time
            formatted_time = str(timedelta(seconds=int(total_time)))
            print(f"\n✅ All tasks finished. Total time: {formatted_time}")
            if failed_tasks:
                print(f"\n❌ {len(failed_tasks)} task(s) failed:\n")
                for description, error in failed_tasks:
                    print(f"❌ {description}\n→ {error}\n")
            break

        time.sleep(polling_interval)


def asset_exists(asset_id):
    """
    Checks if an Earth Engine asset exists.

    Args:
        asset_id (str): Full path of the asset to check.

    Returns:
        bool: True if the asset exists, False otherwise.
    """
    try:
        ee.data.getAsset(asset_id)
        return True
    except ee.EEException:
        return False


def ensure_asset_exists(path, asset_type='ImageCollection'):
    """
    Ensures that an Earth Engine asset exists. If it doesn't, attempts to create it.

    Args:
        path (str): Full path of the asset to ensure.
        asset_type (str): Type of the asset ('Folder' or 'ImageCollection').

    Raises:
        ee.EEException: If asset creation fails.
    """
    try:
        ee.data.getAsset(path)
        print(f"✅ Asset already exists: {path}")
    except ee.EEException:
        print(f"📁 Asset does not exist: {path}")
        print(f"🛠️ Creating asset of type '{asset_type}'...")
        try:
            ee.data.createAsset({'type': asset_type}, path)
            print(f"✅ Created {asset_type}: {path}")
        except ee.EEException as create_err:
            print(f"❌ Failed to create asset: {path}")
            raise create_err


def load_assets(asset_id, version):
    """
    Carrega a imagem de classificação com base na versão de definida.

    Returns:
        ee.Image: Imagem integrada da versão desejada
    """
    return ee.ImageCollection(asset_id).filter(ee.Filter.eq('version', version)).mosaic()


def get_pyramiding_policy_mode(image):
    """
    Generates a pyramiding policy dictionary with 'MODE' for all bands in the image.

    Parameters:
        image (ee.Image): Image whose band names will be used.

    Returns:
        dict: Dictionary {band_name: 'MODE'} for all bands.
    """
    band_names = image.bandNames().getInfo()
    return {band: EXPORT_PYRAMIDING_POLICY for band in band_names}


def export_by_grid(image, asset_output, task_description_prefix, version, description):
    """
    Exporta uma imagem para múltiplos grids definidos, criando uma tarefa de exportação para cada um.

    Args:
        image (ee.Image): Imagem do Earth Engine a ser exportada.
        asset_output (str): Caminho base no Earth Engine onde os assets serão salvos.
        task_description_prefix (str): Prefixo para o nome das tarefas de exportação.
        version (str): Versão da imagem (usada no nome do asset e metadados).
        description (str): Descrição a ser atribuída aos metadados da imagem.

    Returns:
        list: Lista de tarefas de exportação iniciadas (ee.batch.Export.image.toAsset).
    """
    
    grids = ee.FeatureCollection(ASSET_GRID)
    task_list = []
    
    for grid_name in GRID_NAMES:
        asset_id = f"{asset_output}/{grid_name}-{version}"
        task_description = f"{task_description_prefix}-{grid_name}-{version}"

        if asset_exists(asset_id):
            print(f"⚠️  Skipping {task_description} (already exists).")
            continue

        grid = grids.filter(ee.Filter.stringContains('name', grid_name))
        task = ee.batch.Export.image.toAsset(
            image=image.set({
                'version': version,
                'description': description,
                'territory': REGION_NAME.upper(),
            }),
            description=task_description,
            assetId=asset_id,
            region=grid.geometry().buffer(300).bounds(),
            scale=EXPORT_SCALE,
            maxPixels=EXPORT_MAX_PIXELS,
            pyramidingPolicy=get_pyramiding_policy_mode(image)
        )

        print(f"▶️  Exporting {task_description}")
        task.start()
        task_list.append(task)

    return task_list

# ==============================
# TEMPLATE MARKDOWN FUNCTIONS
# ==============================
def get_markdown_silviculture_filter():
    """
    Generates a markdown-formatted description for the integration with silviculture filter applied.
    """
    import textwrap

    return textwrap.dedent(f"""
    
    ### Land Use and Cover – MapBiomas {REGION_NAME.upper()} – Collection {COLLECTION_ID}
    
    **Description:**
    
    This asset represents the land use and land cover map with the application of the *silviculture temporal consistency filter* for MapBiomas {REGION_NAME.upper()}, Collection {COLLECTION_ID}, version {VERSION_SILVICULTURA_FILTER}.

    The silviculture filter aims to improve the consistency of temporal classification for areas mapped as **class 9 (Silviculture)** by detecting and correcting short-term fluctuations, noise, or inconsistent transitions in time series data.

    **Methodology Summary:**

    - **Remapping:** A subset of classes was reclassified into three groups:
      - `1`: Target silviculture classes → {SILVICULTURE_NATURAL_CLASSES}
      - `2`: Classes that typically precede silviculture → {SILVICULTURE_FARMING_CLASSES}
      - `3`: Classes that may follow silviculture → {SILVICULTURE_CLASSES}

    - **Temporal Rules (Kernel 6):** 
      - The filter applies temporal rules using a 6-year sliding window.
      - Rules detect patterns such as `2 → 1 → 1 → 1 → 1 → 3` and reclassify the sequence as a consistent silviculture transition (`2 → 3 → 3 → 3 → 3 → 3`).
      - Final years are processed with a specific rule set to handle edge cases where silviculture occurs near the end of the time series.

    - **Post-processing:**
      - Pixels that are consistently reclassified as group `3` (i.e., verified silviculture) are reassigned to **class 9** in the original classification.

    **Application Notes:**

    - This filter is particularly effective at reducing temporal noise and false classification spikes for silviculture transitions.
    - It is applied only to a subset of classes and years where silviculture inconsistencies are most likely to occur.

    **Output:**

    The final image retains the original class values, with silviculture areas corrected to ensure better temporal consistency in accordance with MapBiomas standards.

    """)


def get_markdown_general_filter():
    """
    Gera a descrição metodológica em formato Markdown para o filtro geral aplicado na integração.

    Returns:
        str: Texto formatado com a descrição dos filtros temporais aplicados por bioma.
    """
    return textwrap.dedent(f"""
    ### Land Use and Cover – MapBiomas {REGION_NAME.upper()} – Collection {COLLECTION_ID}

    **Descrição:**

    Este dataset aplica um filtro geral de consistência temporal (baseado em kernel)
    para suavizar transições inconsistentes nos mapas anuais de uso e cobertura da terra. O processo inclui:

    - Filtro Kernel 3 (janela de 3 anos) para remoção de ruído temporal.
    - Filtro Kernel 4 (janela de 4 anos) para inconsistências mais persistentes.
    - Regras de exceção específicas por bioma, ajustando padrões conhecidos de transição.
    - Máscaras por bioma que limitam a aplicação apenas às classes relevantes em cada região.

    **Notas Metodológicas:**

    1. Os filtros temporais são aplicados iterativamente para cada classe relevante, com substituição de valores isolados.
    2. Listas de exceções são aplicadas após os filtros, preservando ou corrigindo sequências específicas.
    3. Cada bioma possui sua própria configuração de classes e exceções, definidas com base em conhecimento especialista.

    **Anos Filtrados:**
    - Kernel 3: {GENERAL_KERNEL3_YEARS[0]}–{GENERAL_KERNEL3_YEARS[-1]}
    - Kernel 4: {GENERAL_KERNEL4_YEARS[0]}–{GENERAL_KERNEL4_YEARS[-1]}
    - Kernel 3 (último ano): {GENERAL_KERNEL3_LAST_YEAR}

    **Versão de Saída:** `{VERSION_GENERAL_FILTER}`

    **Script:** `apply_general_filter`

    """)


def get_markdown_agriculture_filter():
    '''
    Generates a markdown-formatted description for the integration with agriculture filter applied.
    '''
    return textwrap.dedent(f"""
                           
    ### Land Use and Cover – MapBiomas {REGION_NAME.upper()} – Collection {COLLECTION_ID}
    
    **Description:**
    
    ```
    """)


def get_markdown_pasture_filter():
    '''
    Generates a markdown-formatted description for the integration with pasture filter applied.
    '''
    return textwrap.dedent(f"""
                           
    ### Land Use and Cover – MapBiomas {REGION_NAME.upper()} – Collection {COLLECTION_ID}
    
    **Description:**
    
    ```
    """)


def get_markdown_alertas_filter():
    '''
    Generates a markdown-formatted description for the integration with alerts filter applied.
    '''
    return textwrap.dedent(f"""
                           
    ### Land Use and Cover – MapBiomas {REGION_NAME.upper()} – Collection {COLLECTION_ID}
    
    **Description:**
    
    ```
    """)


def get_markdown_transition_noise_filter():
    '''
    Generates a markdown-formatted description for the integration with transition noise filter applied.
    '''
    return textwrap.dedent(f"""
                           
    ### Land Use and Cover – MapBiomas {REGION_NAME.upper()} – Collection {COLLECTION_ID}
    
    **Description:**
    
    ```
    """)


# ==============================
# FUNÇOES DE FILTROS
# ==============================
def apply_silvicultura_filter(image):
    """
    Aplica o filtro de silvicultura com base em regras temporais e exporta por grade.
    
    Args:
        image (ee.Image): Image de classificação.
        
    Returns:
        ee.Image: Imagem com silvicultura filtrada.
    """
    def remap_classification(image):
        """
        Remapeia as classes da legenda original para [1, 2, 3] conforme regras de silvicultura.
        """
        lookup_in = ee.List(SILVICULTURE_NATURAL_CLASSES + SILVICULTURE_FARMING_CLASSES + SILVICULTURE_CLASSES)
        lookup_out = ee.List(
            [REMAPED_CLASSES[0]] * len(SILVICULTURE_NATURAL_CLASSES) +
            [REMAPED_CLASSES[1]] * len(SILVICULTURE_FARMING_CLASSES) +
            [REMAPED_CLASSES[2]] * len(SILVICULTURE_CLASSES)
        )
        
        def remap_band(year):
            year = ee.Number(year)
            band_name = ee.String(BAND_PREFIX).cat(year.format('%.0f'))
            remapped = image.select([band_name]) \
                            .remap(lookup_in, lookup_out, 0) \
                            .unmask(image.select([band_name])) \
                            .rename(band_name)
            return remapped

        remapped_bands = ee.List(YEARS).map(remap_band)

        return ee.ImageCollection(remapped_bands).toBands().rename(image.bandNames())

    def apply_rules(image, year, rules, kernel_size=6):
        """
        Aplica regras temporais (kernel) a uma sequência de bandas de um dado ano.
        
        Args:
            image (ee.Image): Imagem com as bandas temporais.
            year (int): Ano inicial da janela de k anos.
            rules (list): Lista de regras [[before], [after]].
            kernel_size (int): Tamanho da janela (padrão: 6).
            
        Returns:
            ee.Image: Imagem com bandas atualizadas após aplicação das regras.
        """
        bands = ee.List.sequence(0, kernel_size - 1).map(
            lambda i: ee.String(BAND_PREFIX).cat(
                ee.Number(year).add(i).format('%.0f')
            )
        )
        # The algorithm is expected to take two objects, the current list item, 
        # and the result from the previous iteration or the value of first for the first iteration
        def apply_single_rule(rule, img_acc):
            img_acc = ee.Image(img_acc)
            rule = ee.List(rule)
            before = ee.List(rule.get(0))
            after = ee.List(rule.get(1))

            # Cria máscara combinulldo todas as bandas da regra
            def combine_mask(i, _mask):
                i = ee.Number(i)
                band_i = ee.String(bands.get(i))
                return ee.Image(_mask).And(img_acc.select([band_i]).eq(ee.Number(before.get(i))))

            initial_mask = img_acc.select([bands.get(0)]).eq(ee.Number(before.get(0)))
            mask = ee.List.sequence(1, kernel_size - 1).iterate(combine_mask, initial_mask)
            mask = ee.Image(mask)

            # Aplica regra às bandas da imagem
            def update_band(i, img):
                i = ee.Number(i)
                img = ee.Image(img)
                band_name = ee.String(bands.get(i))
                updated = img.select([band_name]) \
                            .where(mask, ee.Number(after.get(i))) \
                            .rename([band_name])
                return img.addBands(updated, overwrite=True)

            return ee.List.sequence(0, kernel_size - 1).iterate(update_band, img_acc)

        return ee.Image(ee.List(rules).iterate(apply_single_rule, image))

    def apply_rules_kernel(image, rules, years):
        """
        Aplica regras com um determinado kernel para uma lista de anos.
        
        Args:
            image (ee.Image): Imagem de entrada.
            rules (list): Lista de regras.
            years (list): Lista de anos (inteiros).
            
        Returns:
            ee.Image: Imagem com regras aplicadas.
        """
        def apply_to_year(year, img):
            return apply_rules(ee.Image(img), ee.Number(year), rules, kernel_size=7)

        return ee.Image(ee.List(years).iterate(apply_to_year, image))

    print('remapping image...')
    image_remaped = remap_classification(image)
    
    print('applying rules...')
    filtered = apply_rules_kernel(
        image_remaped,
        rules=SILVICULTURE_RULES,
        years=ee.List(YEARS).slice(0, -7)
    )

    print('applying rules last years...')
    filtered = apply_rules_kernel(
        filtered,
        rules=SILVICULTURE_RULES_LAST,
        years=ee.List([YEARS[-7]])
    )

    # Remapeia as classes 1, 2 e 3 de volta para a classe original
    print('applying the class replacement...')
    filtered = image.where(filtered.eq(3), 9)

    # pprint(filtered.reduceRegion(
    #     reducer=ee.Reducer.first(),
    #     geometry=SILVICULTURE_INSPECTOR_POINTS,
    #     scale=EXPORT_SCALE,
    #     maxPixels=EXPORT_MAX_PIXELS
    # ).getInfo())

    return export_by_grid(
        image=filtered,
        asset_output=ASSET_INTEGRATION_FT,
        task_description_prefix='integration-filter-silviculture',
        version=VERSION_SILVICULTURA_FILTER,
        description=get_markdown_silviculture_filter()
    )


def apply_general_filter(classification):
    """
    Aplica filtros temporais (kernel 3 e 4) por bioma, utilizando regras e exceções específicas
    para suavizar transições inconsistentes na série temporal de uso e cobertura da terra.

    Args:
        classification (ee.Image): Imagem de classificação a ser filtrada (por exemplo, saída da silvicultura).

    Returns:
        ee.Image: Imagem com filtro temporal aplicado.
    """
    biomes = ee.Image(ASSET_BIOMES)

    def apply_general_rules(c, classification_ftd):
        """
        Aplica o filtro temporal geral (Kernel 3) para uma determinada classe.

        Args:
            c (int): Código da classe a ser suavizada.
            classification_ftd (ee.Image): Imagem com bandas de anos da classificação.

        Returns:
            ee.Image: Imagem com a classe suavizada ao longo do tempo.
        """
        c = ee.Number(c)
        classification_ftd = ee.Image(classification_ftd)

        def iterate_years(year, classification_ftd):
            """
            """
            year = ee.Number(year).int()
            classification_ftd = ee.Image(classification_ftd)

            b1 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.subtract(1)))
            b2 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year))
            b3 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.add(1)))
            
            t1 = classification_ftd.select(b1)
            t2 = classification_ftd.select(b2)
            t3 = classification_ftd.select(b3)
            
            mask = t2.neq(t1).And(t2.neq(t3))
            
            t_current_ftd = t2.where(mask.And(t2.eq(c)), t1).rename(b2)
            
            return classification_ftd.addBands(t_current_ftd, overwrite=True)

        return ee.List(GENERAL_KERNEL3_YEARS).iterate(iterate_years, classification_ftd)

    def apply_exceptions_kernel3(year, obj):
        """
        Aplica exceções definidas para Kernel 3 (3 anos), corrigindo transições específicas.

        Args:
            year (int): Ano a ser processado.
            obj (dict): Contém imagem filtrada, original e exceções.

        Returns:
            dict: Objeto atualizado com imagem filtrada.
        """
        year, obj = ee.Number(year).int(), ee.Dictionary(obj)

        classification_ftd = ee.Image(obj.get('filtered'))
        classification_ori = ee.Image(obj.get('original'))
        
        exceptions = ee.List(obj.get('exceptions'))
        
        b1 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.subtract(1)))
        b2 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year))
        b3 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.add(1)))
        
        t1 = classification_ori.select(b1)
        t2 = classification_ori.select(b2)
        t3 = classification_ori.select(b3)
        
        t_current_ftd = classification_ftd.select(b2)

        def apply_exception(exception, t_current_ftd):
            """
            """
            t_current_ftd = ee.Image(t_current_ftd)
        
            kernel_bef = ee.List(exception).get(0)
            kernel_aft = ee.List(exception).get(1)
        
            cb0 = ee.Number(ee.List(kernel_bef).get(0))
            cb1 = ee.Number(ee.List(kernel_bef).get(1))
            cb2 = ee.Number(ee.List(kernel_bef).get(2))
        
            ca1 = ee.Number(ee.List(kernel_aft).get(1))
        
            mask = t1.eq(cb0).And(t2.eq(cb1)).And(t3.eq(cb2))
        
            return t_current_ftd.where(mask, ca1)

        filtered = exceptions.iterate(apply_exception, t_current_ftd)

        return obj.set('filtered', classification_ftd.addBands(ee.Image(filtered), overwrite=True))

    def apply_exceptions_kernel3_last(year, obj):
        """
        Aplica exceções para o último ano da série temporal com Kernel 3.

        Args:
            year (int): Último ano.
            obj (dict): Objeto com imagens original e filtrada, além das exceções.

        Returns:
            dict: Objeto atualizado com imagem filtrada.
        """
        year, obj = ee.Number(year).int(), ee.Dictionary(obj)

        classification_ftd = ee.Image(obj.get('filtered'))
        classification_ori = ee.Image(obj.get('original'))
        exceptions = ee.List(obj.get('exceptions'))
        
        b1 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.subtract(1)))
        b2 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year))
        b3 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.add(1)))

        t1 = classification_ori.select(b1)
        t2 = classification_ori.select(b2)
        t3 = classification_ori.select(b3)
        
        t_current_ftd = classification_ftd.select(b3)

        def apply_exception(exception, t_current_ftd):
            """
            """
            t_current_ftd = ee.Image(t_current_ftd)
            
            kernel_bef = ee.List(exception).get(0)
            kernel_aft = ee.List(exception).get(1)
            
            cb0 = ee.Number(ee.List(kernel_bef).get(0))
            cb1 = ee.Number(ee.List(kernel_bef).get(1))
            cb2 = ee.Number(ee.List(kernel_bef).get(2))

            ca2 = ee.Number(ee.List(kernel_aft).get(2))

            mask = t1.eq(cb0).And(t2.eq(cb1)).And(t3.eq(cb2))
            
            return t_current_ftd.where(mask, ca2)

        filtered = exceptions.iterate(apply_exception, t_current_ftd)
        
        return obj.set('filtered', classification_ftd.addBands(ee.Image(filtered), overwrite=True))

    def apply_exceptions_kernel4(year, obj):
        """
        Aplica exceções Kernel 4 (4 anos) para transições mais persistentes.

        Args:
            year (int): Ano alvo da janela de 4 anos.
            obj (dict): Objeto contendo imagem original, filtrada e exceções.

        Returns:
            dict: Objeto atualizado com imagem filtrada.
        """
        year, obj = ee.Number(year).int(), ee.Dictionary(obj)
        
        classification_ftd = ee.Image(obj.get('filtered'))
        classification_ori = ee.Image(obj.get('original'))
        
        exceptions = ee.List(obj.get('exceptions'))

        b1 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.subtract(2)))
        b2 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.subtract(1)))
        b3 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year))
        b4 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.add(1)))

        t1 = classification_ori.select(b1)
        t2 = classification_ori.select(b2)
        t3 = classification_ori.select(b3)
        t4 = classification_ori.select(b4)
        
        t2t3 = classification_ftd.select([b2, b3])

        def apply_exception(exception, t2t3_ftd):
            """
            """
            t2t3_ftd = ee.Image(t2t3_ftd)

            kernel_bef = ee.List(exception).get(0)
            kernel_aft = ee.List(exception).get(1)
            
            cb0 = ee.Number(ee.List(kernel_bef).get(0))
            cb1 = ee.Number(ee.List(kernel_bef).get(1))
            cb2 = ee.Number(ee.List(kernel_bef).get(2))
            cb3 = ee.Number(ee.List(kernel_bef).get(3))
            
            ca1 = ee.Number(ee.List(kernel_aft).get(1))
            ca2 = ee.Number(ee.List(kernel_aft).get(2))
            
            mask = t1.eq(cb0).And(t2.eq(cb1)).And(t3.eq(cb2)).And(t4.eq(cb3))
            
            t2_ftd = t2t3_ftd.select([0])
            t3_ftd = t2t3_ftd.select([1])
            
            return t2_ftd.where(mask, ca1).addBands(t3_ftd.where(mask, ca2))

        filtered = exceptions.iterate(apply_exception, t2t3)

        return obj.set('filtered', classification_ftd.addBands(ee.Image(filtered), overwrite=True))

    def apply_rules_by_biome(biome_key):
        """
        Aplica os filtros e exceções de forma sequencial para um bioma específico.

        Args:
            biome_key (str): Chave do bioma (e.g. 'amz', 'cer').

        Returns:
            ee.Image: Imagem com filtro temporal aplicado ao bioma.
        """
        classes = GENERAL_CLASSES_BIOME[biome_key]
        biome_mask = biomes.eq(BIOME_IDS[biome_key])

        classification_biome = classification.updateMask(biome_mask)
        
        classification_ftd = ee.List(classes).iterate(
            lambda c, img: apply_general_rules(c, img),
            classification_biome
        )
        
        classification_ftd = ee.Image(classification_ftd)
        
        obj_k3 = ee.List(GENERAL_KERNEL3_YEARS).iterate(
            lambda year, obj: apply_exceptions_kernel3(year, obj),
            ee.Dictionary({
                'filtered': classification_ftd, 
                'original': classification_biome, 
                'exceptions': ee.List(GENERAL_EXCEPTIONS[biome_key]['k3'])
                })
        )
        
        obj_k4 = ee.List(GENERAL_KERNEL4_YEARS).iterate(
            lambda year, obj: apply_exceptions_kernel4(year, obj),
            ee.Dictionary({
                'filtered': ee.Dictionary(obj_k3).get('filtered'), 
                'original': classification_biome, 
                'exceptions': ee.List(GENERAL_EXCEPTIONS[biome_key]['k4'])
                })
        )
        
        obj_k3_last = ee.List(GENERAL_KERNEL3_LAST_YEAR).iterate(
            lambda year, obj: apply_exceptions_kernel3_last(year, obj),
            ee.Dictionary({
                'filtered': ee.Dictionary(obj_k4).get('filtered'), 
                'original': classification_biome, 
                'exceptions': ee.List(GENERAL_EXCEPTIONS[biome_key]['k3_last'])
                })
        )
        
        final_img = ee.Image(ee.Dictionary(obj_k3_last).get('filtered'))
        
        return final_img.copyProperties(classification_biome)

    # 
    filtered_images = []

    for biome_key in BIOME_IDS.keys():
        img = apply_rules_by_biome(biome_key)
        filtered_images.append(img)

    filtered = ee.ImageCollection.fromImages(filtered_images).min()


    return export_by_grid(
        image=filtered,
        asset_output=ASSET_INTEGRATION_FT,
        task_description_prefix='integration-filter-general',
        version=VERSION_GENERAL_FILTER,
        description=get_markdown_general_filter()
    )


def apply_agriculture_filter(classification_img):
    """
    Aplica filtro temporal específico para agricultura, remapeando classes agrícolas
    e aplicando regras de suavização temporal (kernel 3).
    
    Args:
        classification_img (ee.Image): Imagem de classificação anterior.
    
    Returns:
        ee.Image: Imagem com filtro de agricultura aplicado.
    """

    # Aplica remapeamento
    def remap_bands(band, acc):
        acc = ee.Image(acc)
        
        img = classification_img.select([band]).remap(
            list(AGRICULTURE_REMAP.keys()), list(AGRICULTURE_REMAP.values()), 0
        ).rename([band])

        return acc.addBands(img, overwrite=True)

    bands = classification_img.bandNames()
    remapped = ee.Image(bands.iterate(remap_bands, classification_img))

    # Aplicar regras
    def apply_rules(year, obj):
        obj = ee.Dictionary(obj)
        year = ee.Number(year).int()
        
        img = ee.Image(obj.get('classification'))

        for rule in AGRICULTURE_RULES:
            bef = rule[0]
            aft = rule[1]

            b1 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.subtract(1)))
            b2 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year))
            b3 = ee.String(f'{BAND_PREFIX}').cat(ee.String(year.add(1)))

            t1 = img.select([b1])
            t2 = img.select([b2])
            t3 = img.select([b3])

            mask = t1.eq(bef[0]).And(t2.eq(bef[1])).And(t3.eq(bef[2]))
            t2 = t2.where(mask, aft[1])

            img = img.addBands(t2.rename([b2]), overwrite=True)

        return obj.set('classification', img)

    obj = {'classification': remapped}
    obj = ee.Dictionary(ee.List(AGRICULTURE_TARGET_YEARS).iterate(apply_rules, obj))

    # Reconstrói imagem final
    filtered = ee.Image(obj.get('classification'))

    # Substitui apenas anos corrigidos nos dados originais
    target_bands = [f'{BAND_PREFIX}{year}' for year in AGRICULTURE_TARGET_YEARS]
    previous_bands = [f'{BAND_PREFIX}{year-1}' for year in AGRICULTURE_TARGET_YEARS]
    
    mask = filtered.select(target_bands).neq(remapped.select(target_bands))

    filtered = classification_img.select(previous_bands)\
        .where(mask, classification_img.select(previous_bands))
    
    filtered = classification_img.addBands(filtered, overwrite=True)

    return export_by_grid(
        image=filtered,
        asset_output=ASSET_INTEGRATION_FT,
        task_description_prefix='integration-filter-agriculture',
        version=VERSION_AGRICULTURE_FILTER,
        description=get_markdown_agriculture_filter()
    )


def apply_pasture_filter(image):
    """
    Preenche pixels de classe 21 (uso alternativo) que estejam rodeados por classe 15 (pastagem),
    com base em padrões definidos em PASTURE_RULES. Corrige as bandas Y-1, Y e Y+1 usando .map().

    Args:
        image (ee.Image): Imagem de classificação com bandas classification_1985 a classification_2023.

    Returns:
        ee.Image: Imagem com preenchimento aplicado nas bandas centrais de 3 anos.
    """

    def get_band_name(year):
        """
        Retorna o nome da banda dado o ano
        """
        return ee.String(BAND_PREFIX).cat(ee.Number(year).format('%.0f'))

    def select_bands_window(year):
        """
        Seleciona as 5 bandas de Y-2 até Y+2
        """
        years_window = ee.List.sequence(year.subtract(2), year.add(2))
        return years_window.map(lambda y: image.select([get_band_name(y)]))

    def generate_mask(t_bands):
        """
        Cria uma máscara booleana onde qualquer regra é satisfeita
        """
        def rule_to_condition(rule):
            rule = ee.List(rule)
            comparisons = t_bands.zip(rule).map(
                lambda pair: ee.Image(ee.List(pair).get(0)).eq(ee.Number(ee.List(pair).get(1))).rename(['mask'])
            )
            return ee.ImageCollection(comparisons).reduce(ee.Reducer.allNonZero())

        rule_masks = ee.List(PASTURE_RULES).map(rule_to_condition)
        return ee.ImageCollection(rule_masks).reduce(ee.Reducer.anyNonZero())

    def correct_three_central_bands(year, image):
        """
        Para o ano Y, corrige as bandas Y-1, Y, Y+1 com base nas regras
        aplicadas sobre a janela Y-2 a Y+2.
        """
        year = ee.Number(year)
        image = ee.Image(image)

        # Seleciona as bandas de Y-2 a Y+2
        t_bands = select_bands_window(year)
        mask = generate_mask(t_bands)

        target_years = ee.List([year.subtract(1), year, year.add(1)])
        target_band_names = target_years.map(get_band_name)
        target_bands = image.select(target_band_names)

        corrected = target_bands.where(mask, PASTURE_CLASS_ID)

        return image.addBands(ee.Image(corrected), overwrite=True)

    # Anos válidos com margem de 2 (para formar janela de 5 anos)
    valid_years = ee.List(YEARS).slice(2, -2)

    # Aplica a correção para cada ano
    filtered = valid_years.iterate(correct_three_central_bands, image)

    filtered = ee.Image(filtered)

    # Exporta a imagem corrigida por grid
    return export_by_grid(
        image=filtered,
        asset_output=ASSET_INTEGRATION_FT,
        task_description_prefix='integration-filter-pasture',
        version=VERSION_PASTURE_FILTER,
        description=get_markdown_pasture_filter()
    )


def apply_alertas_filter(classification_img):
    """
    Aplica correções baseadas em alertas de degradação validados,
    com regras específicas por tipo de alerta, bioma e validade temporal.

    - Alertas do tipo 'clima_extremo' (1): validade de 3 anos, classe 25
    - Alertas do tipo 'mineracao' (3): permanentes, classe 25
    - Alertas do tipo 'urbano' (3): permanentes, classe 25
    - Todos os outros (2): permanentes
        - Classe 15 para AMZ e PAN
        - Classe 21 para outros biomas
    - Apenas classes naturais são modificadas

    Args:
        classification_img (ee.Image): Imagem de classificação já com filtros aplicados.

    Returns:
        ee.Image: Imagem ajustada com base nos alertas.
    """
    # Mapeia e prepara vetor de alertas com campo numérico baseado no tipo
    alert_vector = ee.FeatureCollection(ASSET_ALERTAS).map(
        lambda f: f.set(
            ALERTAS_DETECT_YEAR_COL,
            ee.Number.parse(f.get(ALERTAS_DETECT_YEAR_COL)).int()
        ).set(
            'tipo_alerta_num',
            ALERTAS_TYPE_DICT.get(f.get(ALERTAS_TYPE_COL), 2)
        )
    )

    # Rasterização
    alert_raster_year = ee.Image().uint16().paint(alert_vector, ALERTAS_DETECT_YEAR_COL)
    alert_raster_type = ee.Image().uint8().paint(alert_vector, 'tipo_alerta_num')
    biomes = ee.Image(ASSET_BIOMES)

    updated_bands = []
    for year in ALERTAS_YEARS:
        print(year)
        band = f'{BAND_PREFIX}{year}'
        img_year = classification_img.select(band)

        target_class = img_year.remap(ALERTAS_TARGET_CLASSES, [1]*len(ALERTAS_TARGET_CLASSES), 0)

        for biome_key, biome_id in ALERTAS_BIOME_IDS.items():
            biome_mask = biomes.eq(biome_id)

            # Alertas temporários (clima extremo)
            alert_mask_temp = (
                alert_raster_type.eq(1)
                .And(alert_raster_year.lte(year))
                .And(alert_raster_year.gt(year - 3))
            )

            # Alertas permanentes
            alert_mask_perm_25 = alert_raster_type.eq(3).And(alert_raster_year.lte(year))
            alert_mask_perm_regular = alert_raster_type.eq(2).And(alert_raster_year.lte(year))

            # Condições com classe natural e bioma
            cond_temp = target_class.And(biome_mask).And(alert_mask_temp)
            cond_perm_25 = target_class.And(biome_mask).And(alert_mask_perm_25)
            cond_perm_regular = target_class.And(biome_mask).And(alert_mask_perm_regular)

            # Classe de saída para alertas permanentes
            class_out_perm = 15 if biome_key in ['amz', 'pan'] else 21

            img_year = img_year\
                .where(cond_perm_25, 25)\
                .where(cond_perm_regular, class_out_perm)\
                .where(cond_temp, 25)

        updated_bands.append(img_year.rename(band))

    updated_image = classification_img.addBands(ee.Image(updated_bands), overwrite=True)

    return export_by_grid(
        image=updated_image,
        asset_output=ASSET_INTEGRATION_FT,
        task_description_prefix='integration-filter-alertas',
        version=VERSION_ALERTAS_FILTER,
        description=get_markdown_alertas_filter()
    )


def apply_transition_noise_filter(classification_img):
    """
    Aplica filtro temporal para remover ruídos de transições entre classes naturais e antrópicas,
    utilizando conectividade espacial e tamanho mínimo de mancha para identificar mudanças inconsistentes.

    Args:
        image_process (ee.Image): Imagem multibanda com séries temporais de classificação.

    Returns:
        ee.Image: Imagem com transições espúrias corrigidas.
    """
    def remap_classes(image, class_list):
        return image.remap(class_list, [1] * len(class_list), 0)

    def iterate_years(year, acc_image):
        acc_image = ee.Image(acc_image)
        year = ee.Number(year)
        band_name = ee.String(BAND_PREFIX).cat(year.format('%.0f'))

        current_band = classification_img.select(band_name)

        first_year = ee.Number(YEARS[0])

        def first_year_case():
            return acc_image.addBands(current_band.rename(band_name), overwrite=True)

        def subsequent_year_case():
            prev_year = year.subtract(1)
            prev_band_name = ee.String(BAND_PREFIX).cat(prev_year.format('%.0f'))
            previous_band = acc_image.select(prev_band_name)

            nat_current = remap_classes(current_band, TRANSITIONS_NATURAL_CLASSES)
            ant_current = remap_classes(current_band, TRANSITIONS_ANTHROPIC_CLASSES)
            nat_prev = remap_classes(previous_band, TRANSITIONS_NATURAL_CLASSES)
            ant_prev = remap_classes(previous_band, TRANSITIONS_ANTHROPIC_CLASSES)

            nat_to_ant = nat_current.eq(1).And(ant_prev.eq(1))
            ant_to_nat = ant_current.eq(1).And(nat_prev.eq(1))

            noise_nat_to_ant = nat_to_ant.connectedPixelCount(
                maxSize=TRANSITIONS_MIN_CONNECTED_PIXELS, eightConnected=True
            ).lt(TRANSITIONS_MIN_CONNECTED_PIXELS)

            noise_ant_to_nat = ant_to_nat.connectedPixelCount(
                maxSize=TRANSITIONS_MIN_CONNECTED_PIXELS, eightConnected=True
            ).lt(TRANSITIONS_MIN_CONNECTED_PIXELS)

            corrected = current_band.blend(noise_nat_to_ant.selfMask().multiply(previous_band))
            corrected = corrected.blend(noise_ant_to_nat.selfMask().multiply(previous_band))

            return acc_image.addBands(corrected.rename(band_name), overwrite=True)

        return ee.Image(ee.Algorithms.If(year.eq(first_year),
                                         first_year_case(),
                                         subsequent_year_case()))

    output = ee.List(YEARS).iterate(iterate_years, ee.Image().byte())
    output = ee.Image(output).select(classification_img.bandNames())

    return export_by_grid(
            image=output,
            asset_output=ASSET_INTEGRATION_FT,
            task_description_prefix='integration-filter-transition-noise',
            version=VERSION_TRANSITIONS_FILTER,
            description=get_markdown_transition_noise_filter()
        )



# ==============================
# FUNÇÃO PRINCIPAL DO PIPELINE
# ==============================
def run_pipeline():
    """
    Executa o pipeline completo de filtros temporais do MapBiomas, seguindo a ordem:
    
    1. Silvicultura (regras temporais específicas para silvicultura);
    2. Filtro geral por bioma (classes permitidas e exceções por bioma);
    3. Filtro de agricultura (ajustes de classes agrícolas e suavização temporal);
    4. Filtro de pastagem (preenchimento de buracos temporais da classe 21);
    5. Aplicação de alertas de desmatamento validados.
    6. Filtro de transições (remoção de ruídos de transição entre classes naturais e antrópicas).

    Cada etapa inclui exportação por grid e espera até a conclusão das tarefas antes de prosseguir.
    
    Executa o pipeline completo de filtros temporais do MapBiomas:
    1. Silvicultura → 2. Filtro Geral por Bioma → 3. Agricultura → 4. Pastagem → 5. Alertas → 6. Transições.
    """

    ensure_asset_exists(ASSET_INTEGRATION_FT)

    if RUN_SILVICULTURE:
        print("\n🔹 Etapa 1: Carregando imagem de entrada...")
        integrated = load_assets(asset_id=ASSET_INTEGRATION, version=VERSION_INPUT_INTEGRATION)

        print("🔹 Etapa 1: Aplicando filtro de silvicultura...")
        tasks_silviculture = apply_silvicultura_filter(integrated)

        print("🔹 Etapa 1: Exportando resultados...")
        wait_until_tasks_finish(export_tasks=tasks_silviculture, polling_interval=30)

    if RUN_GENERAL:
        print("\n🔹 Etapa 2: Carregando imagem filtrada (silvicultura)...")
        integrated_ft_silv = load_assets(asset_id=ASSET_INTEGRATION_FT, version=VERSION_SILVICULTURA_FILTER)

        print("\n🔹 Etapa 2: Aplicando filtro de classe gerais...")
        tasks_general = apply_general_filter(integrated_ft_silv)

        print("🔹 Etapa 2: Exportando resultados...")
        wait_until_tasks_finish(tasks_general, polling_interval=30)

    if RUN_AGRICULTURE:
        print("\n🔹 Etapa 3: Carregando imagem filtrada (geral)...")
        integrated_ft_gen = load_assets(asset_id=ASSET_INTEGRATION_FT, version=VERSION_GENERAL_FILTER)

        print("\n🔹 Etapa 3: Aplicando filtro geral por bioma...")
        tasks_agriculture = apply_agriculture_filter(integrated_ft_gen)

        print("🔹 Etapa 3: Exportando resultados...")
        wait_until_tasks_finish(tasks_agriculture, polling_interval=30)

    if RUN_PASTURE:
        print("\n🔹 Etapa 4: Carregando imagem filtrada (agricultura)...")
        integrated_ft_agr = load_assets(asset_id=ASSET_INTEGRATION_FT, version=VERSION_AGRICULTURE_FILTER)

        print("\n🔹 Etapa 4: Aplicando filtro de pastagem...")
        tasks_pasture = apply_pasture_filter(integrated_ft_agr)

        print("🔹 Etapa 4: Exportando resultados...")
        wait_until_tasks_finish(tasks_pasture, polling_interval=30)

    if RUN_ALERTAS:
        print("\n🔹 Etapa 5: Carregando imagem filtrada (pastagem)...")
        integrated_ft_past = load_assets(asset_id=ASSET_INTEGRATION_FT, version=VERSION_PASTURE_FILTER)

        print("\n🔹 Etapa 5: Aplicando filtro de alertas...")
        tasks_alertas = apply_alertas_filter(integrated_ft_past)

        print("🔹 Etapa 5: Exportando resultados...")
        wait_until_tasks_finish(tasks_alertas, polling_interval=30)

    if RUN_TRANSITIONS:
        print("\n🔹 Etapa 6: Carregando imagem filtrada (alertas)...")
        integrated_ft_alertas = load_assets(asset_id=ASSET_INTEGRATION_FT, version=VERSION_ALERTAS_FILTER)

        print("\n🔹 Etapa 6: Aplicando filtro de transições...")
        tasks_transitions = apply_transition_noise_filter(integrated_ft_alertas)

        print("🔹 Etapa 6: Exportando resultados...")
        wait_until_tasks_finish(tasks_transitions, polling_interval=30)

    print("\n✅ Pipeline concluído com sucesso.")

if __name__ == "__main__":
    run_pipeline()
