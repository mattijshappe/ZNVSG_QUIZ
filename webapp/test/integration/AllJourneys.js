jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"vnsg/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"vnsg/test/integration/pages/Worklist",
		"vnsg/test/integration/pages/Object",
		"vnsg/test/integration/pages/NotFound",
		"vnsg/test/integration/pages/Browser",
		"vnsg/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "vnsg.view."
	});

	sap.ui.require([
		"vnsg/test/integration/WorklistJourney",
		"vnsg/test/integration/ObjectJourney",
		"vnsg/test/integration/NavigationJourney",
		"vnsg/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});