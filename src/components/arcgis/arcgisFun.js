export const arcgisFunc = {
    /**
     *
     * @param {加载一些小组件} obj
     * Compass(指北针) ScaleBar(标尺) Fullscreen(全屏)
     * zoom(默认放大缩小)
     */
    loadWidget(obj, view, esri) {
        for (let key in obj) {
            switch (key) {
                case "zoom":
                    view.ui.move(["zoom", "top-right"]);
                    break;
                case "compass":
                    view.ui.add(new esri.Compass({ vew: view }), "top-right");
                    break;
                case "scaleBar":
                    view.ui.add(
                        new esri.ScaleBar({ view: view, unit: "metric", style: "ruler" }),
                        "bottom-left"
                    );
                    break;
                case "fullScreen":
                    view.ui.add(new esri.Fullscreen({ view: view }), "top-right");
                    break;
                case "home":
                    view.ui.add(new esri.Home({ view: view }), "top-right");
                    break;
                default:
                    break;
            }
        }
    },
    // 获取所有图层的id数组
    getAllLayerIds(view) {
        let allLayerIds = [];
        let allLayers = view.allLayerViews.items;
        for (let item of allLayers) {
            allLayerIds.push(item.layer.layerId);
        }
        return allLayerIds;
    },
    // 查询
    taskQuery(searchKey, fieldStr, esri, view, mapServerUrl) {
        const params = new esri.FindParameters({
            layerIds: this.getAllLayerIds(view),
            searchFields: [fieldStr],
            returnGeometry: true,
            searchText: searchKey,
        });
        const findTask = new esri.FindTask({ url: mapServerUrl });
        findTask
            .execute(params)
            .then((res) => this.showResult(res, esri, view))
            .catch((e) => {
                console.log("finTaskErr", e);
            });
    },
    showResult(featureSet, esri, view) {
        const lineColor = new esri.Color([16, 195, 252]);
        const symbol = new esri.SimpleLineSymbol({
            color: lineColor,
            width: "4px",
        });
        const resultFeatures = featureSet.results;
        if (resultFeatures.length > 1) {
            alert("查询到多条信息,默认展示第一条");
        } else if (resultFeatures.length === 0) {
            alert("未查询到信息");
        }
        for (let i = 0, il = resultFeatures.length; i < il; i++) {
            const graphic = resultFeatures[i].feature;
            const geometry = graphic.geometry;
            graphic.symbol = symbol;
            resultFeatures[i].popupEnabled = true;
            view.graphics.add(graphic);
            view.goTo({ target: geometry }, { duration: 1000 });
            break;
        }
    },
    // 距离测量
    distanceMeasurement(e, esri, view, activeWidget) {
        this.setActiveWidget(null);
        if (!e.target.classList.contains("active")) {
            this.setActiveWidget("distance", esri, view, activeWidget);
        } else {
            this.setActiveButton(null, view);
        }
    },
    // 面积测量
    areaMeasurement(e, esri, view, activeWidget) {
        this.setActiveWidget(null);
        if (!e.target.classList.contains("active")) {
            this.setActiveWidget("area", esri, view, activeWidget);
        } else {
            this.setActiveButton(null, view);
        }
    },
    setActiveWidget(type, esri, view, activeWidget) {
        switch (type) {
            case "distance":
                activeWidget = new esri.DistanceMeasurement2D({
                    view: view,
                });
                activeWidget.viewModel.newMeasurement();
                view.ui.add(activeWidget, "bottom-right");
                this.setActiveButton(document.getElementById("distance"), view);
                break;
            case "area":
                activeWidget = new esri.AreaMeasurement2D({
                    view: view,
                });

                // skip the initial 'new measurement' button
                activeWidget.viewModel.newMeasurement();

                view.ui.add(activeWidget, "bottom-right");
                this.setActiveButton(document.getElementById("area"), view);
                break;
            case null:
                if (activeWidget) {
                    view.ui.remove(activeWidget);
                    activeWidget.destroy();
                    activeWidget = null;
                }
                break;
        }
    },
    setActiveButton(selectedButton, view) {
        view.focus();
        let elements = document.getElementsByClassName("active");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active");
        }
        if (selectedButton) {
            selectedButton.classList.add("active");
        }
    },
};