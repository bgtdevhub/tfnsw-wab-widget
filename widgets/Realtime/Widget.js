define(
[
  'dojo/_base/declare', 
  'jimu/BaseWidget', 
  'esri/tasks/query', 
  'esri/layers/FeatureLayer',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/InfoTemplate',
  'esri/Color'
],
function(declare, BaseWidget, Query, FeatureLayer, SimpleMarkerSymbol, InfoTemplate, Color) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: 'realtime',
    // this property is set by the framework when widget is loaded.
    // name: 'Realtime',
    // add additional properties here
    nswTrainsVisible: true,

    busesVisible: true,

    ferriesVisible: true,

    lightrailsVisible: true,

    sydneytrainsVisible: true,

    transitVehicleLocationsLayer: null,

    vehicleTypeSelectionWhereConditions: "(TransitType = 'nswtrains' or TransitType = 'buses' or TransitType = 'ferries' or TransitType = 'lightrail' or TransitType = 'sydneytrains')",

    congestionLevel: "not congestion_level = ''",

    //methods to communication with app container:
    postCreate: function() {
      this.inherited(arguments);

      if (this.config.haveLayerYes) {        
        this.transitVehicleLocationsLayer = this.map.getLayer(this.config.realtimeVehiclePositionLayerId);

        try {
          this.transitVehicleLocationsLayer.setDefinitionExpression(this.vehicleTypeSelectionWhereConditions + " and " + this.congestionLevel);
        } catch (err) {
          alert("Layer defined is not a valid TfNSW Realtime Vehicle Position Layer. Widget will not work as expected.");
        }
        
        // console.log(this.vehicleTypeSelectionWhereConditions + " and " + this.congestionLevel);
      } else {
        // console.log("Loading the default realtime layer");
        this.transitVehicleLocationsLayer = new FeatureLayer("https://services9.arcgis.com/M6PRFWHKXSvV72Qg/ArcGIS/rest/services/Public_Transport_Realtime_Vehicle_Positions/FeatureServer/0",
          {
            outFields: ["*"],
            visible: true,
            refreshInterval: 0.25
          }
        );
        this.transitVehicleLocationsLayer.setDefinitionExpression(this.vehicleTypeSelectionWhereConditions + " and " + this.congestionLevel);
        this.map.addLayer(this.transitVehicleLocationsLayer);
      }      
    },

    selectVehicleType: function() {
      //initialize InfoTemplate
      // const infoTemplate = new InfoTemplate("${TransitType}", "Trip ID: ${trip_id} <br/> Occupancy: ${occupancy_status}");

      const whereConditions = [];
      
      this.nswTrainsVisible ? whereConditions.push("TransitType = 'nswtrains'") : '';
      this.busesVisible ? whereConditions.push("TransitType = 'buses'") : '';
      this.ferriesVisible ? whereConditions.push("TransitType = 'ferries'") : '';
      this.lightrailsVisible ? whereConditions.push("TransitType = 'lightrail'") : '';
      this.sydneytrainsVisible ? whereConditions.push("TransitType = 'sydneytrains'") : '';

      this.vehicleTypeSelectionWhereConditions = "(" + whereConditions.join(' or ') + ")";

      // console.log(this.vehicleTypeSelectionWhereConditions + " and " + this.congestionLevel);

      if (whereConditions.length) {
        this.transitVehicleLocationsLayer.setDefinitionExpression(this.vehicleTypeSelectionWhereConditions + " and " + this.congestionLevel);  
      } else {
        this.transitVehicleLocationsLayer.setDefinitionExpression("TransitType = 'unknown'");  
      }

      // const query = new Query();
      // query.where = whereConditions.join(' or ');

      // query.outFields = ["*"];

      // this.transitVehicleLocationsLayer.queryFeatures(query, (featureSet) => {

      //   const resultFeatures = featureSet.features;
      //   // console.log(resultFeatures.length);
      //   //Loop through each feature returned
      //   for (let i = 0; i < resultFeatures.length; i++) {
      //     //Get the current feature from the featureSet.
      //     //Feature is a graphic
      //     const graphic = resultFeatures[i];
      //     graphic.show();
      //     // console.log(graphic);
      //     // graphic.setSymbol(this.createSymbol(graphic.attributes.TransitType));
      //     // graphic.setSymbol(null);

      //     //Set the infoTemplate.
      //     // graphic.setInfoTemplate(infoTemplate);

      //     //Add graphic to the map graphics layer.
      //     // this.map.graphics.add(graphic);
      //   }
      // });
    },

    // createSymbol: function(transitType) {

    //   const symbol = new SimpleMarkerSymbol();
    //   symbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
    //   symbol.setSize(20);

    //   let color = new Color([255, 255, 0, 0.8]);

    //   switch (transitType) {
    //     case 'nswtrains':
    //       color = new Color([255, 156, 42, 0.8]);
    //       break;
    //     case 'buses':
    //       color = new Color([46, 245, 112, 0.8]);
    //       break;
    //     case 'ferries':
    //       color = new Color([77, 160, 255, 0.8]);
    //       break;
    //     case 'lightrail':
    //       color = new Color([238, 59, 59, 0.8]);
    //       break;
    //     case 'sydneytrains':
    //       color = new Color([154, 45, 226, 0.8]);
    //       break;
    //     default:
    //       color;
    //   }

    //   symbol.setColor(color);

    //   return symbol;
    // },

    _selectCongestionLevel: function(event){

      const congestion = event.target.value === 'ALL_CONGESTION_LEVELS' ? '' : event.target.value;

      if (congestion) {
        this.congestionLevel = "congestion_level = '" + congestion + "'";  
      } else {
        this.congestionLevel = "not congestion_level = ''";
      }

      // console.log(this.vehicleTypeSelectionWhereConditions + " and " + this.congestionLevel);

      this.transitVehicleLocationsLayer.setDefinitionExpression(this.vehicleTypeSelectionWhereConditions + " and " + this.congestionLevel);
    },
    _toggleVisible: function(event){
      const transitType = event.target.innerText[0];
                  
      switch (transitType) {
        case 'N': // nswtrains
          this.nswTrainsVisible = !this.nswTrainsVisible;
          this.nswTrainsVisible ? event.target.classList.add("nswtrains") : event.target.classList.remove("nswtrains")
          this.selectVehicleType();
          break;

        case 'B': // busses
          this.busesVisible = !this.busesVisible;
          this.busesVisible ? event.target.classList.add("buses") : event.target.classList.remove("buses")
          this.selectVehicleType();
          break;

        case 'F': // ferries
          this.ferriesVisible = !this.ferriesVisible;
          this.ferriesVisible ? event.target.classList.add("ferries") : event.target.classList.remove("ferries")
          this.selectVehicleType();
          break;

        case 'L': // lightrails
          this.lightrailsVisible = !this.lightrailsVisible;
          this.lightrailsVisible ? event.target.classList.add("lightrails") : event.target.classList.remove("lightrails")
          this.selectVehicleType();
          break;

        case 'S': // sydneytrains
          this.sydneytrainsVisible = !this.sydneytrainsVisible;
          this.sydneytrainsVisible ? event.target.classList.add("sydneytrains") : event.target.classList.remove("sydneytrains")
          this.selectVehicleType();
          break;
          
        default:
          console.log("Default");
      }
    }

    // startup: function() {
    //   this.inherited(arguments);
    //   console.log('Realtime::startup');
    // },

    // onOpen: function(){
    //   console.log('Realtime::onOpen');
    // },

    // onClose: function(){
    //   console.log('Realtime::onClose');
    // },

    // onMinimize: function(){
    //   console.log('Realtime::onMinimize');
    // },

    // onMaximize: function(){
    //   console.log('Realtime::onMaximize');
    // },

    // onSignIn: function(credential){
    //   console.log('Realtime::onSignIn', credential);
    // },

    // onSignOut: function(){
    //   console.log('Realtime::onSignOut');
    // }

    // onPositionChange: function(){
    //   console.log('Realtime::onPositionChange');
    // },

    // resize: function(){
    //   console.log('Realtime::resize');
    // }

    //methods to communication between widgets:

  });

});
