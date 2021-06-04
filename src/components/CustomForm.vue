<template>
  <div ref="form">
    <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <div v-for="item of formArr" :key="item.key">
        <a-form-item v-if="item.type === 'input'" :label="item.label">
          <a-input
            v-decorator="[item.key, validatorRules[item.key]]"
            :placeholder="'请输入' + item.label"
          />
        </a-form-item>

        <a-form-item v-if="item.type === 'number'" :label="item.label">
          <a-input-number
            :min="1"
            v-decorator="[item.key, validatorRules[item.key]]"
            :placeholder="'请输入' + item.label"
          />
        </a-form-item>

        <a-form-item v-else-if="item.type === 'select'" :label="item.label">
          <a-select
            v-decorator="[item.key, validatorRules[item.key]]"
            :mode="item.mode"
            :placeholder="'请选择' + item.label"
          >
            <a-select-option
              v-for="option of item.options"
              :key="option.value"
              :value="option.value"
              :title="option.text"
            >
              {{ option.text }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-else-if="item.type === 'datePicker'" :label="item.label">
          <a-date-picker
            valueFormat="YYYY-MM-DD hh:mm:ss"
            v-decorator="[item.key, validatorRules[item.key]]"
            show-time
            type="date"
            :placeholder="'请选择' + item.label"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item v-else-if="item.type === 'swicth'" :label="item.label">
          <a-switch v-decorator="[item.key, validatorRules[item.key]]" />
        </a-form-item>

        <a-form-item v-else-if="item.type === 'checkbox'" :label="item.label">
          <a-checkbox-group v-decorator="[item.key, validatorRules[item.key]]">
            <a-checkbox
              v-for="option of item.options"
              :key="option.value"
              :name="option.typename"
            >
              {{ option.text }}</a-checkbox
            >
          </a-checkbox-group>
        </a-form-item>

        <a-form-item v-else-if="item.type === 'radio'" :label="item.label">
          <a-radio-group v-decorator="[item.key, validatorRules[item.key]]">
            <a-radio v-for="option of item.options" :key="option.value">
              {{ option.text }}</a-radio
            >
          </a-radio-group>
        </a-form-item>

        <a-form-item v-else-if="item.type === 'textarea'" :label="item.label">
          <a-input
            v-decorator="[item.key, validatorRules[item.key]]"
            type="textarea"
            :placeholder="'请输入' + item.label"
          />
        </a-form-item>
      </div>

      <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-if="actionShow">
        <a-button type="primary" @click="onSubmit">确定</a-button>
        <a-button style="margin-left: 10px" @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  props: {
    formArr: {
      type: Array,
      default: () => [],
    },
    actionShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: this.$form.createForm(this),
      formObj: null,
      validatorRules: {},
      loading: false,
    };
  },
  mounted() {
    // this.setForm(this.formArr);
    // this.setForm(this.formArr);
  },
  created() {
    this.setValidator(this.formArr);
  },
  methods: {
    onSubmit() {
      let that = this;
      this.form.validateFields((err, value) => {
        if (!err) {
          if (that.formObj && that.formObj.id) value["id"] = that.formObj.id;
          that.$emit("submit", value);
        } else {
          this.$emit("error", true);
        }
      });
    },
    // 规则校验
    setValidator(list) {
      for (const item of list) {
        let errMsg = this.getErrMsg(item.type);
        this.validatorRules[item.key] = {
          rules: [
            {
              required: item.required ? item.required : false,
              message: item.pattern ? item.errMsg : errMsg + item.label,
              pattern: item.pattern,
              type: item.fieldType ? item.fieldType : "string",
            },
          ],
          initialValue: item.value,
          valuePropName: item.valuePropName ? item.valuePropName : "value",
        };
      }
    },
    getErrMsg(type) {
      let errMsg = "";
      switch (type) {
        case "input":
        case "textarea":
          errMsg = "请输入";
          break;
        case "select":
        case "radio":
        case "datePicker":
        case "checkbox":
          errMsg = "请选择";
          break;
        case "uploadImage":
        case "uploadFile":
          errMsg = "请上传";
          break;
        default:
          break;
      }
      return errMsg;
    },
    setForm(list) {
      let obj = {};
      let formObj = this.form.getFieldsValue();
      for (const item of list) {
        if (Object.prototype.hasOwnProperty.call(formObj, item.key)) {
          formObj[item.key] = item.value;
        }
        obj[item.key] = item.value;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(formObj);
        this.formObj = obj;
      });
    },
    resetForm() {
      this.form.resetFields();
    },
    cancel() {
      this.$emit("cancel");
    },
    upload(e) {
      // let obj = {};
      if (this.formObj[e.key]) this.formObj[e.key].push(e.data);
      else this.formObj[e.key] = [e.data];
      let obj = {};
      obj[e.key] = this.formObj[e.key];
      this.form.setFieldsValue(obj);
    },
    removeFile(e) {
      let obj = {};
      obj[e.key] = e.data;
      this.formObj[e.key] = e.data;
      this.form.setFieldsValue(obj);
    },
    // 业务类型
  },
};
</script>
<style scoped>
</style>