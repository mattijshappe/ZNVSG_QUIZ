sap.ui.define([
		"vnsg/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("vnsg.controller.ObjectNotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onAfterRendering: function(){
			 	var oBundle = this.getModel("i18n").getResourceBundle();
			 	var sMsg = oBundle.getText("allQuestionsAnsweredText", [this.getView().getModel("Questions").getProperty("/emailAddress")]);
			 	this.getView().byId("page").setText(sMsg);
			}
		});

	}
);