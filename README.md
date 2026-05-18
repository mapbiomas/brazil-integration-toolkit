# MapBiomas Brazil – LULC Integration

This repository contains the **Land Use and Land Cover (LULC) integration workflows for MapBiomas Brazil**, supporting different spatial resolutions and satellite data sources.  
The scripts are responsible for **integrating annual LULC classifications and applying spatial and temporal filters**, following MapBiomas methodological standards.

---

## Available Integrations

### 🛰️ LULC – 30 m (Landsat)

Integration based on **Landsat imagery (30 m spatial resolution)**, covering the full historical series.

- **Integration**
  
  JavaScript (Google Earth Engine) script responsible for generating the integrated LULC maps.
  
  👉 [`mapbiomas_brazil_integration_lulc_30m_landsat.js`](./30m_col10.1/mapbiomas_brazil_integration_lulc_30m_landsat.js)


- **Filters**
  
  Python script that applies spatial and temporal filters to the integrated results, ensuring consistency and noise reduction.
  
  👉 [`mapbiomas_brazil_integration_lulc_30m_landsat_filters.py`](./30m_col10.1/mapbiomas_brazil_integration_lulc_30m_landsat_filters.py)

---

### 🛰️ LULC – 10 m (col. 3 - beta)

- [**step01 - Integration**](./10m_col3/step01_mapbiomas_brazil_integration_LULC_10m_col3.js)
- [**step02 - 1st Spatial Filter**](./10m_col3/step02_mapbiomas_brazil_spatial_filter.js)
- [**step03 - Filters**](./10m_col3/step03_mapbiomas_brazil_filters.py)
- [**step04 - 2nd Spatial Filter**](./10m_col3/step04_mabiomas_brazil_2nd_spatial_filter.js)


---

## Notes

- All scripts follow **MapBiomas Brazil methodological guidelines**.
- Integration outputs are designed to be compatible with downstream modules such as:
  - transitions
  - deforestation
  - secondary vegetation
- Filtering steps are modular and can be adapted by biome, time period, or collection version.

---
