sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, JSONModel) {
	"use strict";


	return Controller.extend("sap.m.sample.MessageViewInsideDialog.MessageView", {

		onInit: function () {

			var	oLink = new sap.m.Link({
				text: "Show more information",
				href: "http://sap.com",
				target: "_blank"
			});

			var oMessageTemplate = new sap.m.MessageItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}',
				markupDescription: '{markupDescription}',
				link: oLink
			});

			var aMockMessages = [{
				type: 'Error',
				title: 'Error message',
				description: 'First Error message description. \n' +
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Warning',
				title: 'Warning without description',
				description: ''
			}, {
				type: 'Success',
				title: 'Success message',
				description: 'First Success message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Error',
				title: 'Error message',
				description: 'Second Error message description',
				subtitle: 'Example of subtitle',
				counter: 2
			}, {
				type: 'Information',
				title: 'Information message',
				description: 'First Information message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}];

			var oModel = new JSONModel(),
				that = this;

			oModel.setData(aMockMessages);

			this._oMessageView = new sap.m.MessageView({
				showDetailsHeader: false,
				itemSelect: function () {
					that._oBackButton.setVisible(true);
				},
				items: {
					path: "/",
					template: oMessageTemplate
				}
			});

			this._oBackButton = new sap.m.Button({
				icon: sap.ui.core.IconPool.getIconURI("nav-back"),
				visible: false,
				press: function () {
					that._oMessageView.navigateBack();
					this.setVisible(false);
				}
			});

			this._oMessageView.setModel(oModel);
		},

		handleDialogPress: function (oEvent) {
			var that = this,
				oDialog = new sap.m.Dialog({
					title: "Messages",
					resizable: true,
					content: this._oMessageView,
					state: 'Error',
					beginButton: new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "Close"
					}),
					customHeader: new sap.m.Bar({
						contentMiddle: [
							new sap.m.Text({ text: "Error"})
						],
						contentLeft: [
							that._oBackButton
						]
					}),
					contentHeight: "300px",
					contentWidth: "500px",
					verticalScrolling: false
				});

			oDialog.open();
		}

	});

});
