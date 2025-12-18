
import ee

class RegionUtils:
    def __init__(self):
        self._regions = {
            "ARG": {
                "name": "Argentina",
                "bbox": ee.Geometry.BBox(-73.6116, -55.1947, -53.6158, -21.6282),
                "centroid": ee.Geometry.Point(-64.183, -34.6037),
                "continent": "South America"
            },
            "BOL": {
                "name": "Bolivia",
                "bbox": ee.Geometry.BBox(-69.6644, -23.3146, -57.3608, -9.6792),
                "centroid": ee.Geometry.Point(-63.5887, -16.2902),
                "continent": "South America",
                "grids": [
                    "SC-19", "SD-19", "SE-19", "SF-19", "SC-20", "SD-20", "SE-20", "SF-20", 
                    "SC-21", "SD-21", "SE-21", "SF-21"
                ]
            },
            "BRA": {
                "name": "Brazil",
                "bbox": ee.Geometry.BBox(-74.0206, -34.0036, -32.3925, 5.4057),
                "centroid": ee.Geometry.Point(-53.2, -14.2),
                "continent": "South America",
                "grids": [
                    "NA-19", "NA-20", "NA-21", "NA-22", "NB-20", "NB-21", "NB-22", "SA-19",
                    "SA-20", "SA-21", "SA-22", "SA-23", "SA-24", "SB-18", "SB-19", "SB-20",
                    "SB-21", "SB-22", "SB-23", "SB-24", "SB-25", "SC-18", "SC-19", "SC-20",
                    "SC-21", "SC-22", "SC-23", "SC-24", "SC-25", "SD-20", "SD-21", "SD-22",
                    "SD-23", "SD-24", "SE-20", "SE-21", "SE-22", "SE-23", "SE-24", "SF-21",
                    "SI-22", "SF-23", "SF-24", "SG-21", "SG-22", "SG-23", "SH-21", "SH-22",
                    "SF-22"
                ]
            },
            "CHL": {
                "name": "Chile",
                "bbox": ee.Geometry.BBox(-75.7152, -56.0381, -66.3521, -16.8497),
                "centroid": ee.Geometry.Point(-71.5429, -35.6751),
                "continent": "South America"
            },
            "COL": {
                "name": "Colombia",
                "bbox": ee.Geometry.BBox(-83.94374834920974, -4.362080430100584, -66.71718584920974, 14.014768311472285),
                "centroid": ee.Geometry.Point(-74.2973, 4.5709),
                "continent": "South America",
                "grids": [
                    "NA-17", "NB-17", "NC-17", "ND-17", "NA-18", "NB-18", "NC-18", "ND-18",
                    "NA-19", "NB-19", "NC-19", "ND-19", "SA-17", "SB-17", "SA-18", "SB-18",
                    "SA-19", "SB-19"
                ]
            },
            "ECU": {
                "name": "Ecuador",
                "bbox": ee.Geometry.BBox(-81.1555, -5.1216, -75.1741, 2.4547),
                "centroid": ee.Geometry.Point(-78.1834, -1.8312),
                "continent": "South America"
            },
            "GUY": {
                "name": "Guyana",
                "bbox": ee.Geometry.BBox(-61.4546, 0.9867, -56.3885, 8.0884),
                "centroid": ee.Geometry.Point(-58.9302, 4.8604),
                "continent": "South America"
            },
            "PRY": {
                "name": "Paraguay",
                "bbox": ee.Geometry.BBox(-62.9000, -27.7194, -54.1984, -19.2697),
                "centroid": ee.Geometry.Point(-58.4438, -23.4425),
                "continent": "South America"
            },
            "PER": {
                "name": "Peru",
                "bbox": ee.Geometry.BBox(-81.4107, -18.4018, -68.6380, -0.0361),
                "centroid": ee.Geometry.Point(-75.0152, -9.1899),
                "continent": "South America",
                "grids": [
                    'SA-17', 'SA-18', 'SA-19', 'SB-17', 'SB-18', 'SB-19', 'SC-17', 'SC-18', 
                    'SC-19', 'SD-18', 'SD-19', 'SE-18', 'SE-19',
                ]
            },
            "SUR": {
                "name": "Suriname",
                "bbox": ee.Geometry.BBox(-58.1336, 1.6741, -53.7565, 6.2528),
                "centroid": ee.Geometry.Point(-56.0278, 3.9193),
                "continent": "South America"
            },
            "URY": {
                "name": "Uruguay",
                "bbox": ee.Geometry.BBox(-58.6156, -35.2565, -53.0174, -29.9033),
                "centroid": ee.Geometry.Point(-55.7658, -32.5228),
                "continent": "South America"
            },
            "VEN": {
                "name": "Venezuela",
                # considering the whole territory including the islands and ezequibo region
                "bbox": ee.Geometry.BBox(-73.60253643672235, 0.49079864857105976, -57.738278624222346, 12.883289835325007),
                "centroid": ee.Geometry.Point(-66.5897, 6.4238),
                "continent": "South America"
            },
            "GUF": {
                "name": "French Guiana",
                "bbox": ee.Geometry.BBox(-54.6824, 2.0352, -51.5865, 5.9807),
                "centroid": ee.Geometry.Point(-53.1258, 3.9339),
                "continent": "South America"
            },
            "IDN": {
                "name": "Indonesia",
                "bbox": ee.Geometry.BBox(95.0044, -10.9200, 141.0332, 6.0755),
                "centroid": ee.Geometry.Point(113.9213, -0.7893),
                "continent": "Asia"
            },
            "MEX": {
                "name": "Mexico",
                "bbox": ee.Geometry.BBox(-118.7324, 14.3885, -86.7106, 33.1677),
                "centroid": ee.Geometry.Point(-102.5528, 23.6345),
                "continent": "North America"
            },
            "IND": {
                "name": "India",
                "bbox": ee.Geometry.BBox(67.0101, 6.5430, 97.4089, 35.6735),
                "centroid": ee.Geometry.Point(78.9629, 20.5937),
                "continent": "Asia"
            },
            "COD": {
                "name": "DR Congo",
                "bbox": ee.Geometry.BBox(12.0394, -13.5296, 31.3143, 5.3911),
                "centroid": ee.Geometry.Point(21.7587, -4.0383),
                "continent": "Africa"
            }
        }

    def get_bbox(self, iso3):
        """Retorna a caixa delimitadora (bounding box) para o país especificado."""
        return self._regions[iso3]["bbox"]

    def get_centroid(self, iso3):
        """Retorna o ponto central (centroid) para o país especificado."""
        return self._regions[iso3]["centroid"]

    def get_metadata(self, iso3):
        """Retorna os metadados (nome, bbox, centroid, continente) para o país especificado."""
        return self._regions.get(iso3, {})

    def list_regions(self, continent=None):
        """Lista os códigos dos países, filtrando por continente se especificado."""
        return [k for k, v in self._regions.items() if continent is None or v["continent"] == continent]
    
    def get_grid_names(self, iso3):
        """Retorna os nomes das cartas (grids) para o país, se houver."""
        return self._regions.get(iso3, {}).get("grids", [])


