sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/f/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    JSONModel,
    library,
    Filter,
    FilterOperator,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("facilitymanagement.controller.View1", {
      onInit: function () {
        var oData = {
          oTableData: [],
          sSearchPlant: null,
          sSearchRoomid: null,
          sSearchFloor: null,
          sSearchCondx: null,
          vPlant: null, //   지점
          vFloor: null, //   층
          vRoomid: null, // room id
          vRoomno: null, // 방 호수
          vCondx: null, // 방 상태 z
        };

        var oDataModel = new JSONModel(oData);
        this.getView().setModel(oDataModel, "Main");
      },

      onBeforeRendering: function () {
        var oModel = this.getView().getModel();
        var oViewModel = this.getView().getModel("Main");
        oModel.read("/RoomstatusSet", {
          success: function (oModelData) {
            var data = oModelData;
            var aData = data.results;
            var oData = [];

            oData.push(aData);
            oViewModel.setProperty("/oTableData", aData);
          },
        });
      },

      onSearch: function () {
        var oViewModel = this.getView().getModel("Main");
        var sSearchPlant = oViewModel.getProperty("/sSearchPlant"); //지점번호
        var sSearchFloor = oViewModel.getProperty("/sSearchFloor"); //층수
        var sSearchRoomid = oViewModel.getProperty("/sSearchRoomid"); //룸id
        var sSearchCondx = oViewModel.getProperty("/sSearchCondx"); //방상태

        var oTable = this.getView().byId("RoomTable");
        var oBinding = oTable.getBinding("items");

        var aFilter = [];
        if (sSearchPlant) {
          // 지점번호
          var oFilter = new Filter({
            path: "Plant",
            operator: FilterOperator.Contains,
            value1: sSearchPlant,
            caseSensitive: false,
          });
          aFilter.push(oFilter);
        }

        if (sSearchFloor) {
          // 층수
          var oFilter = new Filter({
            path: "Floor",
            operator: FilterOperator.Contains,
            value1: sSearchFloor,
            caseSensitive: false,
          });
          aFilter.push(oFilter);
        }

        if (sSearchRoomid) {
          // 룸 id
          var oFilter = new Filter({
            path: "Roomid",
            operator: FilterOperator.Contains,
            value1: sSearchRoomid,
            caseSensitive: false,
          });
          aFilter.push(oFilter);
        }

        if (sSearchCondx) {
          // 현재방상태  변경!
          var oFilter = new Filter({
            path: "Condx",
            operator: FilterOperator.Contains,
            value1: sSearchCondx,
            caseSensitive: false,
          });
          aFilter.push(oFilter);
        }

        oBinding.filter(aFilter);
      },

      onFilterChange: function () {
        this.onSearch();
      },

      onPressSave: function (oEvent) {
        var oViewModel = this.getView().getModel("app");

        var vPlant = oViewModel.oData.detail.Plant;
        var vFloor = oViewModel.oData.detail.Floor;
        var vRoomid = oViewModel.oData.detail.Roomid;
        var vRoomno = oViewModel.oData.detail.Roomno;
        var vCondx = oViewModel.oData.detail.Condx;

        var oDataModel = this.getView().getModel(); //??

        var oData = {
          Plant: vPlant,
          Floor: vFloor,
          Roomid: vRoomid,
          Roomno: vRoomno,
          Condx: vCondx,
        };

        var sPath =
          "/RoomstatusSet(Plant='" + vPlant + "',Roomid='" + vRoomid + "')";

        oDataModel.update(sPath, oData, {
          success: function () {
            MessageToast.show("변경 되었습니다.");
          },
        });
      },

      onUpdateFinished: function (oEvent) {
        //oEvent.getSource().setBusy(false);
      },

      onListItemPress: function (oEvent) {
        var oFCL = this.getView().getParent().getParent();

        var oControl = oEvent.getSource(), // oEvent가 발생괸 주체 Control // row
          oBindingContext = oControl.getBindingContext("Main"), // row에 바인딩되어있는 정보
          sPath = oBindingContext.getPath(); // row에 바인딩되어있는 정보중에 Path /table/0/Pernr

        var oRow = this.getView().getModel("Main").getProperty(sPath);

        this.getView().getModel("app").setProperty("/detail", oRow);

        oFCL.setLayout(library.LayoutType.TwoColumnsBeginExpanded);
      },
    });
  }
);
