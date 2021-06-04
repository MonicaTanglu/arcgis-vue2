import axios from 'axios'
export const ArcgisMixin = {
    data () {
        return {
            featureArea: null,
            features: null
        }
    },
    methods: {
        // 上传文件
        uploadFile (url, params, body) {
            return axios({
                url: url,
                method: "post",
                params: params,
                data: body,
                headers: { "Content-Type": "multipart/form-data" }
            })
        },
        // 上传文件钩子函数
        beforeUpload (file) {
            this.$message.loading("正在上传...", 0);
            // let that = this;
            const params = {
                name: file.name.replace(/.zip$/, ""),
                targetSR: this.view.spatialReference,
                enforceInputFileSizeLimit: true,
                enforceOutputJsonSizeLimit: true,
                generalize: true,
                maxAllowableOffset: 10,
                reducePrecision: true,
                numberOfDigitsAfterDecimal: 0,
            };
            const query = {
                fileType: "shapefile",
                publishParameters: JSON.stringify(params),
                f: "json",
            };
            const url = "https://www.arcgis.com/sharing/rest/content/features/generate"
            let formFile = new FormData()
            formFile.append("file", file)
            this.uploadFile(url, query, formFile).then((uploadRes) => {
                this.features = uploadRes.data.featureCollection.layers[0].featureSet.features
                this.dragModalVisible = true
                // this.addShapeFileToMap()
            })
        },
        ok (e) {
            console.log(e, 'ok')
            for (let i = 0, l = this.features.length; i < l; i++) {
                this.features[i].attributes = { ...e, ...this.features[i].attributes }
            }
            this.addShapeFileToMap(this.features)
        },
        addShapeFileToMap (features) {
            this.$message.destroy()
            let sourceGraphics = []
            let that = this
            let graphics = features.map((feature) => {
                return that.esri.Graphic.fromJSON(feature)
            })
            sourceGraphics = sourceGraphics.concat(graphics)
            this.featureArea.applyEdits({ addFeatures: sourceGraphics }).then(res => {
                if (res.addFeatureResults[0].objectId) {
                    that.dragModalVisible = false
                    that.featureArea.refresh()
                    that.unselectFeature()
                    setTimeout(() => {
                        that.selectFeature(res.addFeatureResults[0].objectId)
                    }, 2000);
                    that.view.goTo(sourceGraphics)

                }
            })
        }
    }
}