sap.ui.define([
		"vnsg/controller/BaseController",
		"sap/ui/model/json/JSONModel"
	], function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("vnsg.controller.App", {

			onInit : function () {
				// apply content density mode to root view
		var quizEntity = "/QuizSet('')";
		this.getView().bindElement(quizEntity);				
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
		});

	}
);