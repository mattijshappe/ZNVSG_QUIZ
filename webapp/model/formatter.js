sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		calculatePercentage: function(questionCount, questionIndex) {

		},		
		progressPercentFormatter: function(questionCount, questionIndex) {
			if (questionCount && questionIndex && questionCount > 0) {
				var totalCount = parseInt(questionCount,0);
				var currentIndex = parseInt(questionIndex,0) - 1;
				return parseInt((currentIndex / totalCount) * 100,0);
			} else {
				return null;
			}	
		},
		progressValueFormatter: function(questionCount, questionIndex) {
			if (questionCount && questionIndex && questionCount > 0) {
				var totalCount = parseInt(questionCount,0);
				var currentIndex = parseInt(questionIndex,0) - 1;
				return parseInt((currentIndex / totalCount) * 100,0) + "%";
			} else {
				return null;
			}	
		}		
	};
});