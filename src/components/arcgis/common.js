import * as esriLoading from "esri-loader";
import store from "@/store/";
// import config from "@/defaultSettings.js";
export function importEsri (cb) {
    esriLoading.loadCss(window.setting.esriCss);
    // esriLoading.loadCss('https://js.arcgis.com/4.18/esri/themes/light/main.css');
    // esriLoading.loadScript(window.setting.esriJs);
    esriLoading.setDefaultOptions({ url: window.setting.esriJs });
    esriLoading
        .loadModules([
            "esri/Basemap",
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/widgets/LayerList",
            "esri/layers/MapImageLayer",
            "esri/config",
            "esri/layers/TileLayer",
            "esri/symbols/TextSymbol",
            "esri/widgets/Legend",
            "esri/widgets/Expand",
            "esri/widgets/Compass",
            "esri/widgets/ScaleBar",
            "esri/widgets/Fullscreen",
            "esri/tasks/FindTask",
            "esri/tasks/support/FindParameters",
            "esri/symbols/SimpleLineSymbol",
            "esri/Color",
            "esri/geometry/Point",
            "esri/geometry/Extent",
            "esri/tasks/QueryTask",
            "esri/tasks/support/Query",
            "esri/widgets/Home",
            // "esri/widgets/Measurement",
            "esri/layers/support/Field",
            "esri/Graphic",
            "esri/widgets/DistanceMeasurement2D",
            "esri/widgets/AreaMeasurement2D",
            "esri/layers/ImageryTileLayer",
            "esri/PopupTemplate"
        ])
        .then(
            ([
                Basemap,
                Map,
                MapView,
                FeatureLayer,
                LayerList,
                MapImageLayer,
                esriConfig,
                TileLayer,
                TextSymbol,
                Legend,
                Expand,
                Compass,
                ScaleBar,
                Fullscreen,
                FindTask,
                FindParameters,
                SimpleLineSymbol,
                Color,
                Point,
                Extent,
                QueryTask,
                Query,
                Home,
                // Measurement,
                Field,
                Graphic,
                DistanceMeasurement2D,
                AreaMeasurement2D,
                ImageryTileLayer,
                PopupTemplate
            ]) => {
                esriConfig.fontsUrl = window.setting.esriFont;
                const esri = {
                    Basemap: Basemap,
                    Map: Map,
                    MapView: MapView,
                    FeatureLayer: FeatureLayer,
                    LayerList: LayerList,
                    MapImageLayer: MapImageLayer,
                    esriConfig: esriConfig,
                    TileLayer: TileLayer,
                    TextSymbol: TextSymbol,
                    Legend: Legend,
                    Expand: Expand,
                    Compass: Compass,
                    ScaleBar: ScaleBar,
                    Fullscreen: Fullscreen,
                    FindTask: FindTask,
                    FindParameters: FindParameters,
                    SimpleLineSymbol: SimpleLineSymbol,
                    Color: Color,
                    Point: Point,
                    Extent: Extent,
                    QueryTask: QueryTask,
                    Query: Query,
                    Home: Home,
                    // Measurement: Measurement,
                    Graphic: Graphic,
                    Field: Field,
                    DistanceMeasurement2D: DistanceMeasurement2D,
                    AreaMeasurement2D: AreaMeasurement2D,
                    ImageryTileLayer: ImageryTileLayer,
                    PopupTemplate: PopupTemplate
                };
                store.dispatch("InitEsriMap", esri);
                cb(esri);
            }
        );
}