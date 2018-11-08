define([
  'dojo/_base/declare',
  'jimu/BaseWidgetSetting',
  'jimu/utils',
  'dojo/on'
],
function(declare, BaseWidgetSetting, jimuUtils, on) {

  return declare([BaseWidgetSetting], {
    baseClass: 'realtime-setting',

    postCreate: function(){
      
      jimuUtils.combineRadioCheckBoxWithLabel(this.haveLayerYes, this.haveLayerYesLabel);
      jimuUtils.combineRadioCheckBoxWithLabel(this.haveLayerNo, this.haveLayerNoLabel);

      this.own(on(this.haveLayerYes,'click', () => {
        this.layerSelection.classList.remove("hidden");
        this.defaultLayerNotification.classList.add("hidden");
      }));

      this.own(on(this.haveLayerNo,'click', () => {
        this.layerSelection.classList.add("hidden");
        this.defaultLayerNotification.classList.remove("hidden");
      }));

      for (let i = 0; i < this.map.graphicsLayerIds.length; i++) {
        var option = document.createElement("option");
        option.text = this.map.graphicsLayerIds[i];
        option.value = this.map.graphicsLayerIds[i];

        this.layerId.appendChild(option);
      }

      //the config object is passed in
      this.setConfig(this.config);
    },

    setConfig: function(config){
      this.widgetTitle.value = config.widgetTitle || 'TfNSW Public Transport Position';
      this.layerId.value = config.realtimeVehiclePositionLayerId;

      if (config.haveLayerYes) {
        this.haveLayerYes.checked = true;
        this.layerSelection.classList.remove("hidden");
        this.defaultLayerNotification.classList.add("hidden");
      }

      if (config.haveLayerNo) {
        this.haveLayerNo.checked = true;
        this.layerSelection.classList.add("hidden");
        this.defaultLayerNotification.classList.remove("hidden");
      }

      if (!config.haveLayerYes && !config.haveLayerNo) {
        this.haveLayerNo.checked = true;
        this.layerSelection.classList.add("hidden");
        this.defaultLayerNotification.classList.remove("hidden");
      }
    },

    getConfig: function(){
      //WAB will get config object through this method
      return {
        widgetTitle: this.widgetTitle.value || 'TfNSW Public Transport Position',
        haveLayerYes: this.haveLayerYes.checked,
        haveLayerNo: this.haveLayerNo.checked,
        realtimeVehiclePositionLayerId: this.layerId.value || ''
      };
    }
  });
});
