window.setting = (function () {
    const mapBaseOrigin = `${window._CONFIG['argis']}:6080/`
    const mapBaseUrl = `${mapBaseOrigin}arcgis/rest/services/test`
    return {
        esriCss: `${window._CONFIG['argis']}:1569/arcgis_js_api/library/4.17/esri/css/main.css`,
        esriJs: `${window._CONFIG['argis']}:1569/arcgis_js_api/library/4.17/init.js`,
        esriFont: `${window._CONFIG['argis']}:1569/ArcGIS_Font`,
        mapBaseOrigin: mapBaseOrigin,
        mapServer: `${mapBaseUrl}/MapServer`,
        featureLayerZRZ: `${mapBaseUrl}/MapServer/0`, // 自然幢
        featureLayerJSYDSYQ: `${mapBaseUrl}/MapServer/1`, // 宗地
        featureLayerDJZQ: `${mapBaseUrl}/MapServer/2`, // 地籍子区
        baseLayer: `${mapBaseUrl}/MapServer`, // 底图
        remarkLayer: `${mapBaseUrl}/FeatureServer/0`, // 点图
        areaLayer: `${mapBaseUrl}/FeatureServer/5` // 面图
    }
})()