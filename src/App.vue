<template>
  <div id="app">
    <div>
      <a-input
        style="width: 200px; margin-right: 10px"
        placeholder="请输入OBJECTID"
        v-model="objectId"
      />
      <a-button @click="search">查询</a-button>
    </div>
    <!-- <a-button></a-button> -->
    <div id="viewDiv"></div>
    <div id="toolbarDiv">
      <div class="esri-widget esri-widget--button esri-component">
        <!-- <label>（上传压缩的shapefile文件，格式.zip）</label> -->
        <a-upload
          :file-list="fileList"
          :before-upload="beforeUpload"
          accept=".zip"
        >
          <a-tooltip
            placement="right"
            title="上传压缩的shapefile文件，格式.zip"
          >
            <a-button> <a-icon type="upload" /> </a-button>
          </a-tooltip>
        </a-upload>
      </div>
    </div>
    <a-modal
      title="备注"
      v-model="remarkVisible"
      @ok="handleOk"
      @cancel="handleCancle"
      cancelText="取消"
      okText="确定"
    >
      <a-input v-model="remarkForm.name" placeholder="备注信息"></a-input>
    </a-modal>
    <!-- <draggable> -->
    <!-- <a-modal :visible="formVisible" v-drag :title="null">
      <h2 class="title" v-dragHandle>modal标题</h2>
      <label>文本信息</label>
      <a-input placeholder="请输入文本信息"></a-input>
    </a-modal> -->
    <drag-modal :visible="dragModalVisible" title="信息录入">
      <div slot="content">
        <custom-form
          :formArr="formArr"
          @submit="ok"
          @error="error"
          :actionShow="true"
        ></custom-form>
      </div>
    </drag-modal>
    <!-- </draggable> -->
  </div>
</template>

<script>
import { importEsri } from "@/components/arcgis/common.js";
// import draggable from "vuedraggable";
import DragModal from "@/components/modal/dragModal.vue";
import CustomForm from "@/components/CustomForm.vue";
import { ArcgisMixin } from "./mixins/mixin";
export default {
  mixins: [ArcgisMixin],
  components: {
    // draggable,
    DragModal,
    CustomForm,
  },
  name: "App",
  data() {
    return {
      esri: null,
      map: null,
      view: null,
      remarkVisible: false,
      geometry: null,
      symbol: null,
      objectId: 17213,
      highlight: null,
      editFeature: null, //编辑的要素
      remarkForm: {
        name: "",
        createTime: "",
        creater: "test",
      },
      featureRemark: null,
      // formVisible: true,
      dragModalVisible: false,
      fileList: null,
      graphicsLayer: null,
      formArr: [
        {
          label: "文字信息",
          type: "input",
          key: "TEXT",
          value: null,
          required: true,
          errMsg: "请输入",
          disabled: false,
        },
        {
          label: "编号",
          type: "input",
          key: "BH",
          value: null,
          required: true,
          errMsg: "请输入",
          disabled: false,
        },
        {
          label: "面积",
          type: "input",
          key: "MJ",
          value: null,
          required: true,
          errMsg: "请输入",
          disabled: false,
        },
      ],
    };
  },
  methods: {
    loadEsri(esri) {
      let baseLayer = new esri.TileLayer({
        url:
          "http://localhost:6080/arcgis/rest/services/ncx/NcxBaseMap/MapServer",
      });
      const baseMap = new esri.Basemap({
        baseLayers: [baseLayer],
        id: "myBasemap",
        title: "custom basemap",
      });
      this.map = new esri.Map({ basemap: baseMap });

      this.view = new esri.MapView({
        container: "viewDiv",
        map: this.map,
        popup: {
          autoOpenEnabled: true,
          dockEnabled: true,
          defaultPopupTemplateEnabled: true,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false,
            position: "bottom-right",
          },
        },
      });
      this.view.ui.add("toolbarDiv", "top-right");
      this.esri = esri;
      const featureLayerRemark = new esri.FeatureLayer({
        url: window.setting.remarkLayer,
        popupTemplate: this.setPopTemplate(),
        id: "remarkLayer",
      });
      let featureLayerZRZ = new esri.FeatureLayer({
        url: window.setting.featureLayerZRZ,
      });
      let featureLayerJSYDSYQ = new esri.FeatureLayer({
        url: window.setting.featureLayerJSYDSYQ,
      });
      // this.searchFeature = this.featureLayer2;
      let featureLayerDJZQ = new esri.FeatureLayer({
        url: window.setting.featureLayerDJZQ,
        // popupEnabled: false,
      });
      this.featureArea = new esri.FeatureLayer({
        url: window.setting.areaLayer,
      });
      this.map.add(featureLayerZRZ);
      this.map.add(featureLayerJSYDSYQ);
      this.map.add(featureLayerDJZQ);
      this.featureRemark = featureLayerRemark;
      this.map.add(this.featureArea);
      this.map.add(featureLayerRemark);
      this.graphicsLayer = new esri.GraphicsLayer();
      this.map.add(this.graphicsLayer);
      this.view.on("click", (e) => {
        // 右键
        if (e.native.which === 3) {
          // 新增要素 清除editFeature
          this.remarkForm.name = null;
          this.remarkVisible = true;
          this.editFeature = null;
          this.geometry = e.mapPoint.clone();
        } else {
          // 非右键 hitTest主要是目的是为了获取点击的要素的属性
          this.view.hitTest(e).then((response) => {
            if (response.results.length === 0) return;
            else if (
              response.results[0].graphic &&
              response.results[0].graphic.layer.id === "remarkLayer"
            ) {
              this.unselectFeature();
              this.selectFeature(
                response.results[0].graphic.attributes[
                  this.featureRemark.objectIdField
                ]
              );
            }
          });
        }
      });
      this.view.popup.on("trigger-action", (e) => {
        console.log(e, "popupClick");
        if (e.action.id === "remark-edit") {
          // 编辑
          // 这里需要判断 添加备注的人与修改的人是否一致
          // this.view.popup = null;
          this.view.popup.visible = false;
          this.remarkForm.name = this.editFeature.attributes.NAME;
          this.remarkVisible = true;
        } else if (e.action.id === "remark-delete") {
          // 删除
          // 这里需要判断 添加备注的人与删除的人是否一致
          this.view.popup.visible = false;
          this.deleteFeature();
          console.log("delete");
        } else {
          console.log("else");
        }
      });
    },
    setAction() {
      const edit = {
        title: "编辑",
        id: "remark-edit",
        className: "esri-icon-edit",
      };
      const trash = {
        title: "删除",
        id: "remark-delete",
        className: "esri-icon-trash",
      };
      return [edit, trash];
    },
    setPopTemplate() {
      const popupTemplate = {
        actions: this.setAction(),
        title: "备注信息",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "NAME",
                label: "备注信息",
              },
              {
                fieldName: "CREATER",
                label: "创建人",
              },
              {
                fieldName: "CREATETIME",
                label: "创建时间",
              },
              {
                fieldName: "UPDATETIME",
                label: "更新时间",
              },
            ],
          },
        ],
      };
      return popupTemplate;
    },
    search() {
      let that = this;
      if (!this.objectId) {
        this.$message.warning("请输入OBJECTID");
        return;
      } else {
        let params = {
          表达式: "OBJECTID=" + this.objectId,
        };
        let geoprocessor = new this.esri.Geoprocessor({
          url:
            "http://localhost:6080/arcgis/rest/services/TEST/GPServer/TestClipZRZ",
        });
        geoprocessor.submitJob(params).then((jobInfo) => {
          var jobid = jobInfo.jobId;
          console.log("submitJob", jobInfo);
          var options = {
            interval: 1500,
            statusCallback: function (j) {
              console.log("Job Status: ", j.jobStatus);
            },
          };
          var fillSymbol = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [1, 2, 224, 0.75],
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 255, 159],
              width: 1,
            },
          };
          geoprocessor.waitForJobCompletion(jobid, options).then((info) => {
            if (info.jobStatus === "job-succeeded") {
              geoprocessor
                .getResultData(info.jobId, "ZDJBXX_Intersect", that.getResult)
                .then((result) => {
                  console.log(result, "result");
                  let features = result.value.features;
                  let graphics = features.map((feature) => {
                    feature.symbol = fillSymbol;
                    return feature;
                  });
                  that.graphicsLayer.addMany(graphics);
                  console.log("getResult", result);
                });
            }
          });
        });
      }
    },
    getResult(result) {
      console.log(result, "result");
    },
    handleOk() {
      // let that = this;
      if (!this.remarkForm.name) {
        this.$message.warning("请填写备注信息");
        return false;
      }
      let attributes = {};
      // 要素编辑
      if (this.editFeature) {
        attributes = this.editFeature.attributes;
        attributes.NAME = this.remarkForm.name;
        attributes.UPDATETIME = new Date();
        this.geometry = this.editFeature.geometry;
        let pointGraphic = new this.esri.Graphic({
          geometry: this.geometry,
          attributes: attributes,
        });
        this.updateFeature(pointGraphic);
      } else {
        // 要素新增
        attributes = {
          NAME: this.remarkForm.name,
          CREATETIME: new Date(),
          CREATER: "test",
          UPDATETIME: new Date(),
        };

        let pointGraphic = new this.esri.Graphic({
          geometry: this.geometry,
          attributes: attributes,
        });

        this.addFeature(pointGraphic);
      }
    },
    addFeature(pointGraphic) {
      let that = this;
      this.featureRemark
        .applyEdits({ addFeatures: [pointGraphic] })
        .then((res) => {
          if (res.addFeatureResults[0].objectId) {
            that.featureRemark.refresh();
            that.unselectFeature();
            setTimeout(() => {
              that.selectFeature(res.addFeatureResults[0].objectId);
            }, 2000);
            this.$message.success("添加成功");
            this.remarkVisible = false;
          } else {
            this.$message.error("添加失败");
          }
        });
    },
    updateFeature(pointGraphic) {
      let that = this;
      this.featureRemark
        .applyEdits({ updateFeatures: [pointGraphic] })
        .then((res) => {
          if (res.updateFeatureResults[0].objectId) {
            that.featureRemark.refresh();
            that.unselectFeature();
            setTimeout(() => {
              that.selectFeature(res.updateFeatureResults[0].objectId);
            }, 1000);
            this.$message.success("更新成功");
            this.remarkVisible = false;
          } else {
            this.$message.error("更新失败失败");
          }
        });
    },
    // 删除要素
    deleteFeature() {
      this.$confirm({
        content: "确定要删除吗？",
        onOk: () => {
          let attributes = this.editFeature.attributes;
          this.geometry = this.editFeature.geometry;
          let pointGraphic = new this.esri.Graphic({
            geometry: this.geometry,
            attributes: attributes,
          });
          this.featureRemark
            .applyEdits({ deleteFeatures: [pointGraphic] })
            .then((res) => {
              if (res.deleteFeatureResults[0].objectId) {
                this.$message.success("删除成功");
                this.featureRemark.refresh();
              } else {
                this.$message.error("删除失败");
              }
            });
        },
      });
    },
    // 高亮显示选中的要素 并获取选中的要素的相关值
    selectFeature(objectId) {
      let that = this;
      this.featureRemark
        .queryFeatures({
          objectIds: [objectId],
          outFields: ["*"],
          returnGeometry: true,
        })
        .then(function (results) {
          if (results.features.length > 0) {
            let feature = results.features[0];
            that.editFeature = feature;
            feature.popupTemplate = that.setPopTemplate();
            that.view.popup.open({
              features: [feature],
            });
            // that.featureRemark.popupTemplate = that.setPopTemplate();
            that.view.whenLayerView(feature.layer).then(function (layerView) {
              that.highlight = layerView.highlight(feature);
            });
          }
        });
    },
    unselectFeature() {
      if (this.highlight) {
        this.highlight.remove();
      }
    },
    handleCancle() {},
    error() {
      this.dragModalVisible = false;
    },
  },
  mounted() {
    const esri = this.$store.state.app.esri;
    if (esri) this.loadEsri(esri);
    else importEsri(this.loadEsri);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  height: 100%;
}
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
