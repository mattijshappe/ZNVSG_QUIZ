/*global location*/
sap.ui.define([
	"vnsg/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"vnsg/model/formatter",
	"sap/m/MessageBox"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	MessageBox
) {
	"use strict";

	return BaseController.extend("vnsg.controller.Questions", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			this.getView().unbindElement();
			this.getRouter().getRoute("questions").attachPatternMatched(this._onObjectMatched, this);
		},
		onAnswerListUpdated: function(oEvent) {
			var myAnswerId = this.getView().getModel().getProperty(this.getView().getBindingContext().getPath() + "/myAnswerId");
			// Set the correct radio button selected
			this.setSelectedAnswerButton(oEvent.getSource(), myAnswerId);
		},
		onAnswerPress: function(oEvent) {
			var myAnswerId = oEvent.getSource().getBindingContext().getProperty("Id");
			// Set the radio box active
			this.setSelectedAnswerButton(oEvent.getSource().getParent(), myAnswerId);
			// Update the selected answer in the model
			this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/myAnswerId", myAnswerId);
		},

		setSelectedAnswerButton: function(answerList, answerId) {
			/**
			 * Set the seletcted answer radiobuttons
			 */
			var rbAnswers = answerList.getControlsByFieldGroupId("rbAnswer");
			// Set the correct radio button selected
			for (var i = 0; i < rbAnswers.length; i++) {
				var rbAnswerId = rbAnswers[i].getBindingContext().getProperty("Id");
				if (rbAnswerId === answerId) {
					rbAnswers[i].setSelected(true);
				} else {
					rbAnswers[i].setSelected(false);
				}
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var oModel = this.getModel();
			var emailAddress = oEvent.getParameter("arguments").emailAddress;
			var quizId = oEvent.getParameter("arguments").quizId;
			this.getView().getModel("Questions").setProperty("/emailAddress", emailAddress);
//			this.getView().getModel("Questions").setProperty("/quizId", quizId);
			
			var filters = [];
			var filterByName = new sap.ui.model.Filter("Email", sap.ui.model.FilterOperator.EQ, emailAddress);
			filters.push(filterByName);
			var sPath = "/QuizSet('" + quizId +"')/toQuestions";
			oModel.read(sPath, {
				//oModel.read("/toQuestions", {
				filters: filters,
				success: function(oData, response) {
					if (oData.results.length === 0) {
						this.getRouter().getTargets().display("notFound");
						return;
					}
					this.getView().getModel("Questions").setProperty("/activeQuestionIndex", 0);
					this.getView().getModel("Questions").setProperty("/questionCount", oData.results.length);
					this.getView().getModel("Questions").setProperty("/questions", oData.results);
					// Bind the next question to the view
					this._bindNextQuestion("Next");
				}.bind(this)
			});
		},

		_bindNextQuestion: function(operation) {
			var Questions = this.getView().getModel("Questions");
			if (operation === "Next") {
				var nextQuestionIndex = Questions.getProperty("/activeQuestionIndex") + 1;
			} else {
				nextQuestionIndex = Questions.getProperty("/activeQuestionIndex") - 1;
			}
			if (nextQuestionIndex === 0) {
				nextQuestionIndex = 1;
			} else if (nextQuestionIndex > Questions.getProperty("/questionCount")) {
				// Last question processed
				this.getRouter().getTargets().display("objectNotFound");
				return;
			} else {
				var questions = Questions.getProperty("/questions");
				var quizId = questions[nextQuestionIndex - 1].QuizId;
				var nextQuestionId = questions[nextQuestionIndex - 1].Id; // index starts by 0
				var emailAddress = Questions.getProperty("/emailAddress");
				var sObjectPath = this.getModel().createKey("QuestionSet", {
					QuizId: quizId,
					Id: nextQuestionId,
					Email: emailAddress
				});
				this.getView().bindElement({
					path: "/" + sObjectPath,
					parameters: {
						expand: 'toQuiz'
					}
				});
				if (! this.oTemplate){
				// bind to question path, binding in the XML view will result
				// to invalid binding from source quiz entity
				this.oTemplate = this.getView().byId("idColumnListItem");
				var oAnswerList = this.getView().byId("idAnswerList");
				oAnswerList.bindAggregation("items", {
					path: "ToAnswers",
					parameters: {
						expand: 'ToQuestion'
					},
									template: this.oTemplate
				});
				}
			}
			Questions.setProperty("/activeQuestionIndex", nextQuestionIndex);
		},
		onSelectAnswer: function(oEvent) {
			var answerId = oEvent.getSource().getBindingContext().getProperty("Id");
			oEvent.getSource().getModel().setProperty(this.getView().getBindingContext().getPath() + "/myAnswerId", answerId);
		},

		onPreviousQuestion: function() {
			this._bindNextQuestion("Previous");
		},

		onSubmitAnswer: function() {
			var resourceModel = this.getModel("i18n");
			var myAnswerId = this.getView().getModel().getProperty(this.getView().getBindingContext().getPath() + "/myAnswerId");
			if (!myAnswerId) {
				jQuery.sap.require("sap.m.MessageBox");
				var alertText = resourceModel.getProperty("noAnswerSelected");
				MessageBox.error(alertText);
				return;
			}
			this.getView().getModel().submitChanges();
			this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/Answered", true);
			this._bindNextQuestion("Next");
		}
	});
});