/*
 * ! ${copyright}
 */

// Provides control sap.ui.fl.variants.VariantManagement.
sap.ui.define([
	'jquery.sap.global', '../transport/TransportSelection', 'sap/ui/model/json/JSONModel', 'sap/ui/model/Sorter', 'sap/ui/model/Filter', 'sap/ui/Device', 'sap/ui/core/TextAlign', 'sap/ui/core/InvisibleText', 'sap/ui/core/Control', 'sap/ui/core/ValueState', 'sap/ui/layout/HorizontalLayout', 'sap/ui/layout/Grid', 'sap/m/SearchField', 'sap/m/RadioButton', 'sap/m/ScreenSize', 'sap/m/PopinDisplay', 'sap/m/ColumnListItem', 'sap/m/Column', 'sap/m/Text', 'sap/m/Bar', 'sap/m/Table', 'sap/m/Page', 'sap/m/PlacementType', 'sap/m/ButtonType', 'sap/m/Toolbar', 'sap/m/ToolbarSpacer', 'sap/m/Button', 'sap/m/CheckBox', 'sap/m/Dialog', 'sap/m/Input', 'sap/m/Label', 'sap/m/ResponsivePopover', 'sap/m/SelectList', 'sap/m/ObjectIdentifier', 'sap/m/OverflowToolbar', 'sap/m/OverflowToolbarPriority', 'sap/m/OverflowToolbarLayoutData'
], function(jQuery, TransportSelection, JSONModel, Sorter, Filter, Device, TextAlign, InvisibleText, Control, ValueState, HorizontalLayout, Grid, SearchField, RadioButton, ScreenSize, PopinDisplay, ColumnListItem, Column, Text, Bar, Table, Page, PlacementType, ButtonType, Toolbar, ToolbarSpacer, Button, CheckBox, Dialog, Input, Label, ResponsivePopover, SelectList, ObjectIdentifier, OverflowToolbar, OverflowToolbarPriority, OverflowToolbarLayoutData) {
	"use strict";

	/**
	 * Constructor for a new VariantManagement.
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class The VariantManagement control can be used to manage variants, such as filter bar variants or table variants.
	 * @extends sap.ui.core.Control
	 * @constructor
	 * @public
	 * @since 1.50
	 * @alias sap.ui.fl.variants.VariantManagement
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var VariantManagement = Control.extend("sap.ui.fl.variants.VariantManagement", /** @lends sap.ui.fl.variants.VariantManagement.prototype */
	{
		metadata: {
			library: "sap.ui.fl",
			designTime: true,
			properties: {

				/**
				 * Enables the setting of the initially selected variant.
				 */
				initialSelectionKey: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Provides a string value to set the default variant. Used for the save dialog. Has no effect on the selected variant.
				 */
				defaultVariantKey: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The key of the currently selected item. Returns null if the default item list is selected.
				 */
				selectionKey: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Indicates that Execute on Selection is visible in the Save Variant and the Manage Variants dialogs.
				 */
				showExecuteOnSelection: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Indicates that Share is visible in the Save Variant and the Manage Variants dialogs. Share allows you to share variants with other
				 * users.
				 */
				showShare: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Indicates that set as default is visible in the Save Variant and the Manage Variants dialogs.
				 */
				showSetAsDefault: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Overwrites the default Standard variant title.
				 */
				standardItemText: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If set to<code>true</code>, the scenario is an industry-specific solution.<br>
				 * <b>Node:</b>This flag is only used internally in the app variant scenarios.
				 */
				industrySolutionMode: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Indicates if the vendor layer is active.<br>
				 * <b>Node:</b>This flag is only used internally in the app variant scenarios.
				 */
				vendorLayer: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * If set to<code>true</code>, the key for a vendor variant will be added manually.<br>
				 * <b>Node:</b>This flag is only used internally in the app variant scenarios.
				 */
				manualVariantKey: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * If set to<code>true</code>, the Standard variant selection will trigger a search.
				 */
				executeOnSelectionForStandardVariant: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				}
			},
			aggregations: {

				/**
				 * Variant items displayed by the <code>VariantManagement</code> control.
				 * @private
				 */
				variantItems: {
					type: "sap.ui.fl.variants.VariantItem",
					multiple: true,
					singularName: "variantItem"
				}
			},
			events: {

				/**
				 * This event is fired when the Save Variant dialog is closed with OK for a variant.
				 */
				save: {
					parameters: {
						/**
						 * The variant title
						 */
						name: {
							type: "string"
						},

						/**
						 * Indicates if an existing variant is overwritten or if a new variant is created
						 */
						overwrite: {
							type: "boolean"
						},

						/**
						 * The variant key
						 */
						key: {
							type: "string"
						},

						/**
						 * The Execute on Selection indicator
						 */
						exe: {
							type: "boolean"
						},

						/**
						 * The default variant indicator
						 */
						def: {
							type: "boolean"
						},

						/**
						 * The shared variant indicator
						 */
						global: {
							type: "boolean"
						},

						/**
						 * The package name
						 */
						lifecyclePackage: {
							type: "string"
						},

						/**
						 * The transport ID
						 */
						lifecycleTransportId: {
							type: "string"
						}
					}
				},

				/**
				 * This event is fired when users apply changes to variants in the Manage Variants dialog.
				 */
				manage: {
					parameters: {
						/**
						 * List of changed variant keys
						 */
						renamed: {
							type: "object[]"
						},

						/**
						 * List of deleted variant keys
						 */
						deleted: {
							type: "string[]"
						},

						/**
						 * List of variant keys and the associated Execute on Selection indicator
						 */
						exe: {
							type: "object[]"
						},

						/**
						 * The default variant key
						 */
						def: {
							type: "boolean"
						}
					}
				},

				/**
				 * This event is fired when a new variant is selected.
				 */
				select: {
					parameters: {
						/**
						 * The variant key
						 */
						key: {
							type: "string"
						}
					}
				}
			}
		},

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
		 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
		 */
		renderer: function(oRm, oControl) {
			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiFlVarMngmt");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.oVariantLayout);
			oRm.write("</div>");
		}
	});

	VariantManagement.MAX_NAME_LEN = 100;
	VariantManagement.STANDARD_NAME = "STANDARD";
	VariantManagement.STANDARDVARIANTKEY = "*standard*";

	VariantManagement.COLUMN_NAME_IDX = 0;

	/*
	 * Constructs and initializes the VariantManagement control.
	 */
	VariantManagement.prototype.init = function() {

		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl");

		this.oModel = new JSONModel({
			modified: false,
			selectedVariantKey: VariantManagement.STANDARDVARIANTKEY,
			standardVariantKey: VariantManagement.STANDARDVARIANTKEY,
			defaultVariantKey: VariantManagement.STANDARDVARIANTKEY,
			initialDefaultVariantKey: VariantManagement.STANDARDVARIANTKEY,
			items: []

		});
		this.setModel(this.oModel, "$variants");

		// this.setSelectedVariantKey(VariantManagement.STANDARDVARIANTKEY);
		this.addItem(this._setStandardItemProperties());

		var oVariantInvisbletext = new InvisibleText({
			text: {
				parts: [
					{
						path: '$variants>/selectedVariantKey'
					}, {
						path: '$variants>/modified'
					}
				],
				formatter: function(sKey, bValue) {
					var sText = this.getSelectedVariantText(sKey);
					if (bValue) {
						sText = this._oRb.getText("VARIANT_MANAGEMENT_MODIFIED", [
							sText
						]);
					}
					return sText;
				}.bind(this)
			}
		});

		var oVariantText = new Label(this.getId() + "-text", {
			text: {
				path: '$variants>/selectedVariantKey',
				formatter: function(sKey) {
					var sText = this.getSelectedVariantText(sKey);
					return sText;
				}.bind(this)
			}
		});

		oVariantText.addStyleClass("sapUiFlVarMngmtText");
		oVariantText.addStyleClass("sapMH4Style");

		if (Device.system.phone) {
			oVariantText.addStyleClass("sapUiFlVarMngmtTextMaxWidth");
		}

		var oVariantModifiedText = new Label(this.getId() + "-modified", {
			visible: "{$variants>/modified}"
		});
		oVariantModifiedText.setText("*");
		oVariantModifiedText.addStyleClass("sapUiFlVarMngmtText");
		oVariantModifiedText.addStyleClass("sapUiFlVarMngmtModified");
		oVariantModifiedText.addStyleClass("sapMH4Style");

		this.oVariantPopoverTrigger = new Button(this.getId() + "-trigger", {
			type: ButtonType.Transparent,
			icon: "sap-icon://arrow-down",
			press: function() {
				this._openVariantList();
			}.bind(this),
			tooltip: this._oRb.getText("VARIANT_MANAGEMENT_TRIGGER_TT")
		});
		this.oVariantPopoverTrigger.addStyleClass("sapUiFlVarMngmtTriggerBtn");
		this.oVariantPopoverTrigger.addAriaLabelledBy(oVariantInvisbletext);

		this.oVariantLayout = new HorizontalLayout({
			content: [
				oVariantText, oVariantModifiedText, this.oVariantPopoverTrigger, oVariantInvisbletext
			]
		});
		this.oVariantLayout.addStyleClass("sapUiFlVarMngmtLayout");
		this.addDependent(this.oVariantLayout);
	};

	/**
	 * Once a new variant change is saved by the flexibility layer, it will receive a new key.
	 * @public
	 * @param {string} sOldKey the previous variant key.
	 * @param {string} sNewKey replaces the <code>sOldKey</code> and is now the new variant key.
	 */
	VariantManagement.prototype.replaceKey = function(sOldKey, sNewKey) {
		var oItem = this._getItemByKey(sOldKey);
		if (oItem) {
			oItem.key = sNewKey;
		}
	};

	/**
	 * Adds a new variant to the internal model.
	 * @public
	 * @param {map} mItem describes the new variant item
	 * @param {string} [mItem.key] key of the variant
	 * @param {string} [mItem.text] text of the variant
	 * @param {boolean} [mItem.readOnly] indicates if the variant is changeable
	 * @param {boolean} [mItem.executeOnSelection] indicates if a query should be triggered when the variant is selected
	 * @param {boolean} [mItem.global] indicates if the variant is shared
	 * @param {string} [mItem.lifeCyclePackage] package name
	 * @param {string} [mItem.lifeCycleTransportId] transport name
	 * @param {string} [mItem.namespace] The namespace of the variant
	 * @param {boolean} [mItem.textReadOnly] indicates if the variant text is changeable
	 * @param {string} [mItem.author] creator of the variant
	 */
	VariantManagement.prototype.addItem = function(mItem) {
		if (mItem && mItem.key && !this._getItemByKey(mItem.key)) {
			var mTechnicalInfos = {
				initialText: mItem.text,
				initialExecuteOnSelection: mItem.executeOnSelection,
				deleted: false
			};

			jQuery.extend(mTechnicalInfos, mItem);
			this._addItem(mTechnicalInfos);
		}
	};

	VariantManagement.prototype._determineStandardVariantName = function() {

		var sText = this._oRb.getText("VARIANT_MANAGEMENT_STANDARD"), sStandardKey = this.getStandardVariantKey(), sStandardName = this.getStandardItemText();

		if ((sStandardKey === VariantManagement.STANDARDVARIANTKEY) && sStandardName) {
			sText = sStandardName;
		}

		return sText;
	};

	VariantManagement.prototype.setInitialDefaultVariantKey = function(sKey) {
		this.oModel.setProperty("/initialDefaultVariantKey", sKey);
	};
	VariantManagement.prototype.getInitialDefaultVariantKey = function() {
		return this.oModel.getProperty("/initialDefaultVariantKey");
	};

	VariantManagement.prototype.setDefaultVariantKey = function(sKey) {
		this.oModel.setProperty("/defaultVariantKey", sKey);
	};
	VariantManagement.prototype.getDefaultVariantKey = function() {
		return this.oModel.getProperty("/defaultVariantKey");
	};

	VariantManagement.prototype.setSelectedVariantKey = function(sKey) {
		this.oModel.setProperty("/selectedVariantKey", sKey);
	};
	VariantManagement.prototype.getSelectedVariantKey = function() {
		return this.oModel.getProperty("/selectedVariantKey");
	};

	VariantManagement.prototype.setStandardVariantKey = function(sStandardVariantKey) {
		this.oModel.setProperty("/standardVariantKey", sStandardVariantKey);
	};
	VariantManagement.prototype.getStandardVariantKey = function() {
		return this.oModel.getProperty("/standardVariantKey");
	};

	VariantManagement.prototype.setModified = function(bFlag) {
		this.oModel.setProperty("/modified", bFlag);
	};
	VariantManagement.prototype.getModified = function() {
		return this.oModel.getProperty("/modified");
	};

	VariantManagement.prototype.getStandardVariantName = function(sKey) {
		return this._getVariantText("standardVariantKey", sKey);
	};

	VariantManagement.prototype.getSelectedVariantText = function(sKey) {
		return this._getVariantText("selectedVariantKey", sKey);
	};

	VariantManagement.prototype._getVariantText = function(sProperty, sKey) {
		var oItem = null, sSelectedKey = sKey;

		if (this.oModel) {

			if (!sSelectedKey) {
				sSelectedKey = this.oModel.getProperty("/" + sProperty);
			}

			oItem = this._getItemByKey(sSelectedKey);
		}

		if (oItem) {
			return oItem.text;
		}

		return "";
	};

	VariantManagement.prototype._getItems = function() {
		return this.oModel.oData["items"];
	};

	VariantManagement.prototype.addVariantItem = function(oVariantItem) {
		this.addAggregation("variantItems", oVariantItem);

		var oItem = this._setItemProperties(oVariantItem);
		this.addItem(oItem);

		return this;
	};

	VariantManagement.prototype._addItem = function(oItem) {

		var oData = this.oModel.getData();
		oData["items"] = oData["items"].concat([
			oItem
		]);

		this.oModel.setData(oData);
	};

// VARIANT LIST

	VariantManagement.prototype._createVariantList = function() {

		if (this.oVariantPopOver) {
			return;
		}

		var oVariantManageBtn = new Button(this.getId() + "-manage", {
			text: this._oRb.getText("VARIANT_MANAGEMENT_MANAGE"),
			enabled: true,
			press: function() {
				this._openManagementDialog();
			}.bind(this),
			layoutData: new OverflowToolbarLayoutData({
				priority: OverflowToolbarPriority.Low
			})
		});

		this.oVariantSaveBtn = new Button(this.getId() + "-mainsave", {
			text: this._oRb.getText("VARIANT_MANAGEMENT_SAVE"),
			press: function() {
				this._handleVariantSave();
			}.bind(this),
			// enabled: false,
			enabled: {
				path: "/modified",
				formatter: function(bValue) {
					return bValue;
				}
			},
			layoutData: new OverflowToolbarLayoutData({
				priority: OverflowToolbarPriority.Low
			})
		});
		this.oVariantSaveBtn.setModel(this.oModel);

		this.oVariantSaveAsBtn = new Button(this.getId() + "-saveas", {
			text: this._oRb.getText("VARIANT_MANAGEMENT_SAVEAS"),
			press: function() {
				this._openSaveAsDialog();
			}.bind(this),
			layoutData: new OverflowToolbarLayoutData({
				priority: OverflowToolbarPriority.Low
			})
		});

		var oVariantList = new SelectList(this.getId() + "-list", {
			itemPress: function(oEvent) {
				var sSelectionKey = null;
				if (oEvent && oEvent.getParameters()) {
					var oItemPressed = oEvent.getParameters().item;
					if (oItemPressed) {
						sSelectionKey = oItemPressed.getKey();
					}
				}
				if (sSelectionKey) {
					this.setSelectedVariantKey(sSelectionKey);
					this.oVariantPopOver.close();
					this.setModified(false);
					this.bFireSelect = true;
				}
			}.bind(this)
		});
		oVariantList.setNoDataText(this._oRb.getText("VARIANT_MANAGEMENT_NODATA"));

		var oItemTemplate = new sap.ui.core.Item({
			key: "{key}",
			text: "{text}"
		});
		oVariantList.setModel(this.oModel);
		oVariantList.bindAggregation("items", "/items", oItemTemplate);
		oVariantList.bindProperty("selectedKey", "/selectedVariantKey");

		if (this.getModified()) {
			var oSelectedItem = this._getItemByKey(this.getSelectedVariantKey());
			if (oSelectedItem) {
				if (!oSelectedItem.readOnly || (this._isIndustrySolutionModeAndVendorLayer() && (this.getStandardVariantKey() === oSelectedItem.key))) {
					this.oVariantSaveBtn.setEnabled(true);
				}
			}
		}

		var oSearchField = new SearchField(this.getId() + "-search");
		oSearchField.attachLiveChange(function(oEvent) {
			this._triggerSearch(oEvent, oVariantList);
		}.bind(this));

		var oVariantSelectionPage = new Page(this.getId() + "-selpage", {
			subHeader: new Toolbar({
				content: [
					oSearchField
				]
			}),
			content: [
				oVariantList
			],
			footer: new OverflowToolbar({
				content: [
					new ToolbarSpacer(this.getId() + "-spacer"), oVariantManageBtn, this.oVariantSaveBtn, this.oVariantSaveAsBtn
				]
			}),
			showSubHeader: false,
			showNavButton: false,
			showHeader: false
		});

		this.oVariantPopOver = new ResponsivePopover(this.getId() + "-popover", {
			title: this._oRb.getText("VARIANT_MANAGEMENT_VARIANTS"),
			contentWidth: "400px",
			placement: PlacementType.Bottom,
			content: [
				oVariantSelectionPage
			],
			afterOpen: function() {
				this._setTriggerButtonIcon(false);
			}.bind(this),
			afterClose: function() {
				if (this.bFireSelect) {
					this.bFireSelect = false;

					this.fireSelect({
						key: this.getSelectedVariantKey()
					});
				}

				this._setTriggerButtonIcon(true);
			}.bind(this),
			contentHeight: "300px"
		});
		this.oVariantPopOver.addStyleClass("sapUiFlVarMngmtPopover");

		if (this.oVariantPopoverTrigger.$().closest(".sapUiSizeCompact").length > 0) {
			this.oVariantPopOver.addStyleClass("sapUiSizeCompact");
		}

		var oItems = this._getItems();
		if (oItems.length < 9) {
			oVariantSelectionPage.setShowSubHeader(false);
		} else {
			oVariantSelectionPage.setShowSubHeader(true);
			oSearchField.setValue("");
		}

		oVariantList.getBinding("items").sort(this._getSorter());
		oVariantList.getBinding("items").filter([
			this._getFilter()
		]);

	};

	VariantManagement.prototype._openVariantList = function() {
		var oItem;

		if (this.oVariantPopOver && this.oVariantPopOver.isOpen()) {
			this.oVariantPopOver.close();
			return;
		}

		this._createVariantList();

		this.oVariantSaveBtn.setEnabled(false);
		this.oVariantSaveAsBtn.setEnabled(true);

		if (this._isIndustrySolutionModeAndVendorLayer() && this.getManualVariantKey() && (this.getStandardVariantKey() === this.STANDARDVARIANTKEY)) {
			this.oVariantSaveBtn.setEnabled(false);
			this.oVariantSaveAsBtn.setEnabled(true);
		}

		if (this.getModified()) {
			oItem = this._getItemByKey(this.getSelectedVariantKey());
			if (!oItem.readOnly || (this._isIndustrySolutionModeAndVendorLayer() && (this.getStandardVariantKey() === oItem.key))) {
				this.oVariantSaveBtn.setEnabled(true);
			}
		}

		this.oVariantPopOver.openBy(this.oVariantPopoverTrigger);

	};

	VariantManagement.prototype._setTriggerButtonIcon = function() {
		var oIcon;

		if (!Device.system.phone) {

			oIcon = sap.ui.getCore().byId(this.oVariantPopoverTrigger.$("img")[0].id);
			if (oIcon) {
				oIcon.toggleStyleClass("sapUiFlVarMngmtImageExpand");
			}
		}
	};

	VariantManagement.prototype._triggerSearch = function(oEvent, oVariantList) {

		if (!oEvent) {
			return;
		}

		var parameters = oEvent.getParameters();
		if (!parameters) {
			return;
		}

		var sValue = parameters.newValue ? parameters.newValue : "";

		var oFilter = new Filter({
			path: "text",
			operator: sap.ui.model.FilterOperator.Contains,
			value1: sValue
		});

		oVariantList.getBinding("items").filter([
			oFilter, this._getFilter()
		]);
	};

	// SAVE DIALOG

	VariantManagement.prototype._createSaveAsDialog = function() {

		if (!this.oSaveAsDialog) {

			this.oInputName = new Input(this.getId() + "-name", {
				liveChange: function(oEvent) {
					this._checkVariantNameConstraints(this.oInputName, this.oSaveSave);
				}.bind(this)
			});

			var oLabelName = new Label(this.getId() + "-namelabel", {
				text: this._oRb.getText("VARIANT_MANAGEMENT_NAME"),
				required: true
			});
			oLabelName.setLabelFor(this.oInputName);

			this.oDefault = new CheckBox(this.getId() + "-default", {
				text: this._oRb.getText("VARIANT_MANAGEMENT_SETASDEFAULT"),
				visible: this.getShowSetAsDefault(),
				width: "100%"
			});

			this.oExecuteOnSelect = new CheckBox(this.getId() + "-execute", {
				text: this._oRb.getText("VARIANT_MANAGEMENT_EXECUTEONSELECT"),
				visible: this.getShowExecuteOnSelection(),
				width: "100%"
			});

			this.oShare = new CheckBox(this.getId() + "-share", {
				text: this._oRb.getText("VARIANT_MANAGEMENT_SHARE"),
				visible: this.getShowShare(),
				select: function(oEvent) {
					this._handleShareSelected(oEvent);
				}.bind(this),
				width: "100%"
			});

			this.oInputManualKey = new Input(this.getId() + "-key", {
				liveChange: function(oEvent) {
					this._checkVariantNameConstraints(this.oInputManualKey);
				}.bind(this)
			});

			this.oLabelKey = new Label(this.getId() + "-keylabel", {
				text: this._oRb.getText("VARIANT_MANAGEMENT_KEY"),
				required: true
			});
			this.oLabelKey.setLabelFor(this.oInputManualKey);

			this.oSaveSave = new Button(this.getId() + "-variantsave", {
				text: this._oRb.getText("VARIANT_MANAGEMENT_OK"),
				press: function() {
					this._bSaveCanceled = false;
					this._handleVariantSaveAs(this.oInputName.getValue());
				}.bind(this),
				enabled: true
			});
			var oSaveAsDialogOptionsGrid = new Grid({
				defaultSpan: "L6 M6 S12"
			});

			if (this.getShowSetAsDefault()) {
				oSaveAsDialogOptionsGrid.addContent(this.oDefault);
			}
			if (this.getShowShare()) {
				oSaveAsDialogOptionsGrid.addContent(this.oShare);
			}
			if (this.getShowExecuteOnSelection()) {
				oSaveAsDialogOptionsGrid.addContent(this.oExecuteOnSelect);
			}

			this.oSaveAsDialog = new Dialog(this.getId() + "-savedialog", {
				title: this._oRb.getText("VARIANT_MANAGEMENT_SAVEDIALOG"),
				beginButton: this.oSaveSave,
				endButton: new Button(this.getId() + "-variantcancel", {
					text: this._oRb.getText("VARIANT_MANAGEMENT_CANCEL"),
					press: function() {
						this._bSaveCanceled = true;
						this.oSaveAsDialog.close();
					}.bind(this)
				}),
				content: [
					oLabelName, this.oInputName, this.oLabelKey, this.oInputManualKey, oSaveAsDialogOptionsGrid
				],
				stretch: Device.system.phone,
				afterOpen: function() {
					this._setTriggerButtonIcon(false);
				}.bind(this),
				afterClose: function() {
					this._setTriggerButtonIcon(true);
				}.bind(this)
			});

			this.oSaveAsDialog.addStyleClass("sapUiPopupWithPadding");
			this.oSaveAsDialog.addStyleClass("sapUiFlVarMngmtSaveDialog");

			if (this.oVariantPopoverTrigger.$().closest(".sapUiSizeCompact").length > 0) {
				this.oSaveAsDialog.addStyleClass("sapUiSizeCompact");
			}

			this.oSaveAsDialog.setParent(this);
		}
	};

	VariantManagement.prototype._openSaveAsDialog = function() {

		this._createSaveAsDialog();

		this.oInputName.setValue(this.getSelectedVariantText(this.getSelectedVariantKey()));
		this.oSaveSave.setEnabled(false);

		this.oInputName.setEnabled(true);
		this.oInputName.setValueState(ValueState.None);
		this.oInputName.setValueStateText(null);
		this.oDefault.setSelected(false);
		this.oShare.setSelected(false);
		this.oExecuteOnSelect.setSelected(false);

		// set variant name to Standard
		if (this._isIndustrySolutionModeAndVendorLayer() && this.getManualVariantKey()) {
			this.oInputName.setValue(this._oRb.getText("VARIANT_MANAGEMENT_STANDARD"));
			this.oInputName.setEnabled(false);
		}

		if (this.oVariantPopOver) {
			this.oVariantPopOver.close();
		}

		this.sTransport = null;
		this.sPackage = null;
		if (this.getManualVariantKey()) {
			this.oInputManualKey.setVisible(true);
			this.oInputManualKey.setEnabled(true);
			this.oInputManualKey.setValueState(ValueState.None);
			this.oInputManualKey.setValueStateText(null);
			this.oLabelKey.setVisible(true);
		} else {
			this.oInputManualKey.setVisible(false);
			this.oLabelKey.setVisible(false);
		}

		this.oSaveAsDialog.open();
	};

	VariantManagement.prototype._handleVariantSaveAs = function(sNewVariantName) {
		var sKey = "SV" + new Date().getTime(), sName = sNewVariantName.trim(), sManualKey = this.oInputManualKey.getValue().trim(), sTransport = "", sPackage = "", bExecuteOnSelect = false;

		if (sName == "") {
			this.oInputName.setValueState(ValueState.Error);
			this.oInputName.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"));
			return;
		}

		if (this.getManualVariantKey()) {
			if (sManualKey == "") {
				this.oInputManualKey.setValueState(ValueState.Error);
				this.oInputManualKey.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"));
				return;
			}
			sKey = sManualKey;
		}

		if (this.oSaveAsDialog) {
			this.oSaveAsDialog.close();
		}
		if (this.oExecuteOnSelect !== null) {
			bExecuteOnSelect = this.oExecuteOnSelect.getSelected();
		}

		this.addItem({
			key: sKey,
			text: sName,
			readOnly: false,
			executeOnSelection: bExecuteOnSelect,
			global: this.oShare.getSelected(),
			lifecycleTransportId: this.sTransport,
			lifecyclePackage: this.sPackage
		});

		this.setSelectedVariantKey(sKey);

		if (this.oDefault.getSelected()) {
			this.setDefaultVariantKey(sKey);
		}
		if (this.oShare.getSelected()) {
			sPackage = this.sPackage;
			sTransport = this.sTransport;
		}

		this.setModified(false);

		this.fireSave({
			key: sKey,
			name: sName,
			overwrite: false,
			def: this.oDefault.getSelected(),
			exe: this.oExecuteOnSelect.getSelected(),
			global: this.oShare.getSelected(),
			lifecyclePackage: sPackage,
			lifecycleTransportId: sTransport
		});

	};

	VariantManagement.prototype._handleVariantSave = function() {

		var oItem = this._getItemByKey(this.getSelectedVariantKey());

		var bDefault = false;
		if (this.getDefaultVariantKey() === oItem.key) {
			bDefault = true;
		}

		if (oItem.global) {
			var fOkay = function(sPackage, sTransport) {

				if (this.oVariantPopOver) {
					this.oVariantPopOver.close();
				}

				this.sPackage = sPackage;
				this.sTransport = sTransport;
				this.fireSave({
					name: oItem.text,
					overwrite: true,
					key: oItem.key,
					def: bDefault,
					global: this._isIndustrySolutionModeAndVendorLayer(),
					lifecyclePackage: this.sPackage,
					lifecycleTransportId: this.sTransport
				});
			}.bind(this);
			var fError = function(oResult) {
				this.sTransport = null;
				this.sPackage = null;
			}.bind(this);
			this._assignTransport(oItem, fOkay, fError);
		} else {

			if (this.oVariantPopOver) {
				this.oVariantPopOver.close();
			}

			this.fireSave({
				name: oItem.text,
				overwrite: true,
				key: oItem.key,
				def: bDefault
			});
		}

		this.setModified(false);
	};

	VariantManagement.prototype._handleShareSelected = function(oEvent) {

		this.sTransport = null;
		this.sPackage = null;

		if (oEvent.getParameters().selected) {
			var fOkay = function(sPackage, sTransport) {
				this.sTransport = sTransport;
				this.sPackage = sPackage;
			}.bind(this);
			var fError = function(oResult) {
				this.oShare.setSelected(false);
				this.sTransport = null;
				this.sPackage = null;
			}.bind(this);

			this._assignTransport(null, fOkay, fError);
		}
	};

// MANAGE DIALOG

	VariantManagement.prototype._createManagementDialog = function() {

		if (!this.oManagementDialog) {

			this.oManagementTable = new Table(this.getId() + "-managementTable", {
				growing: true,
				columns: [
					new Column({
						header: new Text({
							text: this._oRb.getText("VARIANT_MANAGEMENT_NAME")
						}),
						width: "14rem"
					}), new Column({
						header: new Text({
							text: this._oRb.getText("VARIANT_MANAGEMENT_VARIANTTYPE")
						}),
						width: "8rem",
						demandPopin: true,
						popinDisplay: PopinDisplay.Inline,
						minScreenWidth: ScreenSize.Tablet,
						visible: this.getShowShare()
					}), new Column({
						header: new Text({
							text: this._oRb.getText("VARIANT_MANAGEMENT_DEFAULT")
						}),
						width: "4rem",
						demandPopin: true,
						popinDisplay: PopinDisplay.Inline,
						minScreenWidth: ScreenSize.Tablet,
						visible: this.getShowSetAsDefault()
					}), new Column({
						header: new Text({
							text: this._oRb.getText("VARIANT_MANAGEMENT_EXECUTEONSELECT")
						}),
						width: "5rem",
						hAlign: TextAlign.Center,
						demandPopin: true,
						popinDisplay: PopinDisplay.Inline,
						minScreenWidth: "800px",
						visible: this.getShowExecuteOnSelection()
					}), new Column({
						header: new Text({
							text: this._oRb.getText("VARIANT_MANAGEMENT_AUTHOR")
						}),
						width: "8rem",
						demandPopin: true,
						popinDisplay: PopinDisplay.Inline,
						minScreenWidth: "900px"
					}), new Column({
						width: "2rem",
						hAlign: TextAlign.Center
					}), new Column({
						visible: false
					})
				]
			});

			this.oManagementSave = new Button(this.getId() + "-managementsave", {
				text: this._oRb.getText("VARIANT_MANAGEMENT_OK"),
				enabled: true,
				press: function() {
					this._handleManageSavePressed();
				}.bind(this)
			});

			this.oManagementCancel = new Button(this.getId() + "-managementcancel", {
				text: this._oRb.getText("VARIANT_MANAGEMENT_CANCEL"),
				press: function() {
					this.oManagementDialog.close();
					this._handleManageCancelPressed();
				}.bind(this)
			});

			this.oManagementDialog = new Dialog(this.getId() + "-managementdialog", {
				customHeader: new Bar(this.getId() + "-managementHeader", {
					contentMiddle: [
						new Text(this.getId() + "-managementHeaderText", {
							text: this._oRb.getText("VARIANT_MANAGEMENT_MANAGEDIALOG")
						})
					]
				}),
				beginButton: this.oManagementSave,
				endButton: this.oManagementCancel,
				content: [
					this.oManagementTable
				],
				stretch: Device.system.phone,
				afterOpen: function() {
					this._setTriggerButtonIcon(false);
				}.bind(this),
				afterClose: function() {
					if (this.bFireSelect) {
						this.bFireSelect = false;
						this.fireSelect({
							key: this.getSelectedVariantKey()
						});
					}
					this._setTriggerButtonIcon(true);
				}.bind(this)
			});

			if (this.oVariantPopoverTrigger.$().closest(".sapUiSizeCompact").length > 0) {
				this.oManagementDialog.addStyleClass("sapUiSizeCompact");
			}

			this.oManagementDialog.setParent(this);

			this.oManagementTable.setModel(this.oModel);

			this.oManagementTable.bindItems({
				path: "/items",
				factory: this._templateFactoryManagementDialog.bind(this)
			});

			this.oManagementTable.getBinding("items").sort(this._getSorter());
			this.oManagementTable.getBinding("items").filter(this._getFilter());

			this._bDeleteOccured = false;
		}

	};

	VariantManagement.prototype._templateFactoryManagementDialog = function(sId, oContext) {

		var sTooltip = null, bExeEnabled, sDefaultVariantKey, oDeleteButton, oNameControl, oItem = oContext.getObject();
		if (!oItem) {
			return undefined;
		}

		var fLiveChange = function(oEvent) {
			this._checkVariantNameConstraints(oEvent.oSource, this.oManagementSave, oEvent.oSource.getParent().getBindingContext().getObject().key);
		}.bind(this);

		var fChange = function(oEvent) {
			this._handleManageItemNameChange(oEvent.oSource.getParent().getBindingContext().getObject());
		}.bind(this);

		var fSelectRB = function(oEvent) {
			if (oEvent.getParameters().selected === true) {
				this._handleManageDefaultVariantChange(oEvent.oSource.getParent().getBindingContext().getObject().key);
			}
		}.bind(this);

		var fSelectCB = function(oEvent) {
			this._handleManageExecuteOnSelectionChanged(oEvent.oSource.getParent().getBindingContext().getObject());
		}.bind(this);

		var fPress = function(oEvent) {
			this._handleManageDeletePressed(oEvent.oSource.getParent().getBindingContext().getObject());
		}.bind(this);

		if (oItem.key !== this.getStandardVariantKey()) {
			if (oItem.readOnly) {
				sTooltip = this._oRb.getText("VARIANT_MANAGEMENT_WRONG_LAYER");
			} else if (oItem.textReadOnly) {
				sTooltip = this._oRb.getText("VARIANT_MANAGEMENT_WRONG_LANGUAGE");
			}
		}

		if ((oItem.key === this.getStandardVariantKey()) || oItem.readOnly || oItem.textReadOnly) {
			oNameControl = new ObjectIdentifier({
				title: "{text}"
			});
			if (sTooltip) {
				oNameControl.setTooltip(sTooltip);
			}
		} else {
			oNameControl = new Input({
				liveChange: fLiveChange,
				change: fChange,
				value: "{text}"
			});
		}

		oDeleteButton = new Button({
			icon: "sap-icon://sys-cancel",
			enabled: true,
			type: ButtonType.Transparent,
			press: fPress,
			tooltip: this._oRb.getText("VARIANT_MANAGEMENT_DELETE"),
			// visible: "{:= ${readOnly} ? false : true }}"
			visible: !oItem.readOnly
		});

		this._assignColumnInfoForDeleteButton(oDeleteButton);

		sDefaultVariantKey = this.getDefaultVariantKey();
		bExeEnabled = (oItem.readOnly === false);

		var oTemplate = new ColumnListItem({
			// vAlign: "Middle",
			cells: [
				oNameControl, new Text({
					text: this._oRb.getText(oItem.global ? "VARIANT_MANAGEMENT_SHARED" : "VARIANT_MANAGEMENT_PRIVATE"),
					wrapping: false
				}), new RadioButton({
					groupName: this.getId(),
					select: fSelectRB,
					selected: ((oItem.key === sDefaultVariantKey) || (!sDefaultVariantKey && (oItem.key === this.getStandardVariantKey()))) ? true : false
				}), new CheckBox({
					enabled: bExeEnabled,
					select: fSelectCB,
					selected: "{executeOnSelection}"
				}), new Text({
					text: "{author}",
					textAlign: "Begin"
				}), oDeleteButton, new Text({
					text: "{key}"
				})

			]
		});

		return oTemplate;
	};

	VariantManagement.prototype._openManagementDialog = function() {

		this._createManagementDialog();

		this.setInitialDefaultVariantKey(this.getDefaultVariantKey());

		if (this.oVariantPopOver) {
			this.oVariantPopOver.close();
		}

		this.oManagementSave.setEnabled(false);

		// Idealy this should be done only once in _createtManagementDialog. But the binding does not recognize a change, when filtering is involved.
		// After delete on the ui we filter the item out .deleted=true. The real deletion will occure only when OK is pressed.
		// But the filterd items and the result after real deletion is identical, so no change is detected; based on this the context on the table is
		// not invalidated....
		// WA: do the binding always, while opening the dialog.
		if (this._bDeleteOccured) {

			this._bDeleteOccured = false;

			this.oManagementTable.bindItems({
				path: "/items",
				factory: this._templateFactoryManagementDialog.bind(this)
			});

			this.oManagementTable.getBinding("items").sort(this._getSorter());
			this.oManagementTable.getBinding("items").filter(this._getFilter());
		}

		this.oManagementDialog.open();

	};

	VariantManagement.prototype._assignColumnInfoForDeleteButton = function(oDeleteButton) {
		if (!this._oInvisibleDeleteColumnName) {
			this._oInvisibleDeleteColumnName = new InvisibleText({
				text: this._oRb.getText("VARIANT_MANAGEMENT_ACTION_COLUMN")
			});

			this.oManagementDialog.addContent(this._oInvisibleDeleteColumnName);
		}

		if (this._oInvisibleDeleteColumnName) {
			oDeleteButton.addAriaLabelledBy(this._oInvisibleDeleteColumnName);
		}
	};

	VariantManagement.prototype._handleManageDefaultVariantChange = function(sKey) {
		if (!this._anyInErrorState(this.oManagementTable)) {
			this.oManagementSave.setEnabled(true);
		}

		this.setDefaultVariantKey(sKey);
	};

	VariantManagement.prototype._handleManageCancelPressed = function() {
		var sDefaultVariantKey, aItems = this._getItems();
		aItems.forEach(function(oItem) {
			oItem.deleted = false;
			oItem.deletedTransport = null;
			oItem.text = oItem.initialText;
			oItem.executeOnSelection = oItem.initialExecuteOnSelection;
		});

		sDefaultVariantKey = this.getInitialDefaultVariantKey();
		if (sDefaultVariantKey !== this.getDefaultVariantKey()) {
			this.setDefaultVariantKey(sDefaultVariantKey);
		}

		this.oModel.checkUpdate(true);
	};

	VariantManagement.prototype._handleManageDeletePressed = function(oItem) {

		var sKey = oItem.key;

		if (!this._anyInErrorState(this.oManagementTable)) {
			this.oManagementSave.setEnabled(true);
		}

		oItem.deleted = true;

		if ((sKey === this.getDefaultVariantKey())) {
			this.setDefaultVariantKey(this.getStandrdVariantKey());
		}

		if (oItem.global) {
			var fOkay = function(sPackage, sTransport) {
				oItem.deletedTransport = sTransport;
			};

			var fError = function(oResult) {
				oItem.deleted = false;
			};

			this._assignTransport(oItem, fOkay, fError);
		}

		this.oModel.checkUpdate(true);

		// this.oManagementCancel.focus();
	};

	VariantManagement.prototype._handleManageExecuteOnSelectionChanged = function(oItem) {

		if (!this._anyInErrorState(this.oManagementTable)) {
			this.oManagementSave.setEnabled(true);
		}

		if (oItem.global) {
			var fOkay = function(sPackage, sTransport) {
				oItem.lifecyclePackage = sPackage;
				oItem.lifecycleTransportId = sTransport;
			};
			var fError = function(oResult) {
				oItem.executeOnSelection = oItem.initialExecuteOnSelection;
			};

			this._assignTransport(oItem, fOkay, fError);
		}
	};

	VariantManagement.prototype._handleManageItemNameChange = function(oItem) {

		if (!this._anyInErrorState(this.oManagementTable)) {
			this.oManagementSave.setEnabled(true);
		}

		if (!oItem.text.localeCompare(oItem.initialText)) {

			if (oItem.global) {
				var fOkay = function(sPackage, sTransport) {
					oItem.lifecyclePackage = sPackage;
					oItem.lifecycleTransportId = sTransport;
				};

				var fError = function(oResult) {
					oItem.text = oItem.initialText;
				};

				this._assignTransport(oItem, fOkay, fError);
			}
		}

	};

	VariantManagement.prototype._handleManageSavePressed = function() {
		var aRemovedVariantKeys = [], aExeVariantKeys = [], aRenamedVariantKeys = [], aItems = this._getItems();

		aItems.forEach(function(oItem) {
			if (oItem.deleted) {
				aRemovedVariantKeys.push(oItem.key);
			} else {

				if (oItem.text !== oItem.initialText) {
					aRenamedVariantKeys.push({
						key: oItem.key,
						name: oItem.text
					});
				}

				if (oItem.executeOnSelection !== oItem.initialExecuteOnSelection) {
					aExeVariantKeys.push({
						key: oItem.key,
						exe: oItem.executeOnSelection
					});
				}
			}
		});

		var oObj = {
			renamed: aRenamedVariantKeys,
			deleted: aRemovedVariantKeys,
			exe: aExeVariantKeys
		};

		if (this.getDefaultVariantKey() !== this.getInitialDefaultVariantKey()) {
			oObj.def = this.getDefaultVariantKey();
		}

		this.fireManage(oObj);

		this.oManagementDialog.close();

		if (aRemovedVariantKeys.length > 0) {

			var oData = this.oModel.getData();

			oData["items"] = oData["items"].filter(function(oItem) {
				return oItem.deleted === false;
			});

			this.oModel.setData(oData);

			this._bDeleteOccured = true;
			if (aRemovedVariantKeys.indexOf(this.getSelectedVariantKey()) > -1) {
				this.setModified(false);
				this.setSelectedVariantKey(this.getStandardVariantKey());

				this.bFireSelect = true;
			}
		}

	};

	VariantManagement.prototype._anyInErrorState = function(oManagementTable) {
		var aItems, oInput, bInError = false;

		if (oManagementTable) {
			aItems = oManagementTable.getItems();
			aItems.some(function(oItem) {
				oInput = oItem.getCells()[VariantManagement.COLUMN_NAME_IDX];
				if (oInput && oInput.getValueState && (oInput.getValueState() === ValueState.Error)) {
					bInError = true;
				}

				return bInError;
			});
		}

		return bInError;
	};

// UTILS

	VariantManagement.prototype._getFilter = function() {
		return new Filter({
			path: "deleted",
			operator: sap.ui.model.FilterOperator.NE,
			value1: true
		});
	};

	VariantManagement.prototype._getSorter = function() {

		var fnSort = function(v1, v2) {
			if (v1 === this.getStandardVariantName().toUpperCase()) {
				return -1;
			}
			return Sorter.defaultComparator(v1, v2);
		};

		return new Sorter({
			path: 'text',
			descending: false,
			comparator: fnSort.bind(this)
		});
	};

	VariantManagement.prototype._checkVariantNameConstraints = function(oInputField, oSaveButton, sKey) {

		if (!oInputField) {
			return;
		}

		var sValue = oInputField.getValue();
		sValue = sValue.trim();

		if (!this._checkIsDuplicate(sValue, sKey)) {

			if (sValue === "") {
				oInputField.setValueState(ValueState.Error);
				oInputField.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"));
			} else if (sValue.length > VariantManagement.MAX_NAME_LEN) {
				oInputField.setValueState(ValueState.Error);
				oInputField.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_MAX_LEN", [
					VariantManagement.MAX_NAME_LEN
				]));
			} else {
				oInputField.setValueState(ValueState.None);
				oInputField.setValueStateText(null);
			}
		} else {
			oInputField.setValueState(ValueState.Error);
			oInputField.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_DUPLICATE"));
		}

		if (oSaveButton) {
			if (oInputField.getValueState() === ValueState.Error) {
				oSaveButton.setEnabled(false);
			} else {
				oSaveButton.setEnabled(true);
			}
		}
	};

	VariantManagement.prototype._checkIsDuplicate = function(sValue, sKey) {
		var bDublicate = false, aItems = this._getItems(), sLowerCaseValue = sValue.toLowerCase();
		aItems.some(function(oItem) {
			if (oItem.text.toLowerCase() === sLowerCaseValue) {

				if (sKey && (sKey === oItem.key)) {
					return false;
				}
				bDublicate = true;
			}

			return bDublicate;
		});

		return bDublicate;
	};

	VariantManagement.prototype._isIndustrySolutionModeAndVendorLayer = function() {
		if (this.getIndustrySolutionMode() && this.getVendorLayer()) {
			return true;
		}

		return false;
	};

	VariantManagement.prototype._getItemByKey = function(sKey) {
		var oItem = null, aItems = this._getItems();
		aItems.some(function(oEntry) {
			if (oEntry.key === sKey) {
				oItem = oEntry;
			}

			return (oItem != null);
		});

		return oItem;
	};

	VariantManagement.prototype._assignTransport = function(oItem, fOkay, fError) {
		var sTransport = null;

		var oObject = {
			type: "variant",
			name: "",
			namespace: "",
			"package": ""
		};
		// oObject["package"] = "";
		if (oItem) {
			oObject["package"] = oItem.lifecyclePackage;
			oObject["name"] = oItem.key;
			oObject["namespace"] = oItem.namespace;

			sTransport = oItem.lifecycleTransportId;
		}
		var _fOkay = function(oResult) {
			fOkay(oResult.getParameters().selectedPackage, oResult.getParameters().selectedTransport);
		};
		var _fError = function(oResult) {
			fError(oResult);
		};

		if (sTransport != null && sTransport.trim().length > 0) {
			fOkay(oObject["package"], sTransport);
		} else {
			var bCompactMode = false;
			if (this.oVariantPopoverTrigger.$().closest(".sapUiSizeCompact").length > 0) {
				bCompactMode = true;
			}
			var oTransports = new TransportSelection();
			oTransports.selectTransport(oObject, _fOkay, _fError, bCompactMode);
		}

	};

	VariantManagement.prototype._setItemProperties = function(oVariantItem) {

		var oItem = {
			key: oVariantItem.getKey(),
			text: oVariantItem.getText(),
			readOnly: oVariantItem.getReadOnly(),
			executeOnSelection: oVariantItem.getExecuteOnSelection(),
			global: oVariantItem.getGlobal(),
			lifecyclePackage: oVariantItem.getLifecyclePackage(),
			lifecycleTransportId: oVariantItem.getLifecycleTransportId(),
			namespace: oVariantItem.getNamespace(),
			textReadOnly: oVariantItem.getTextReadOnly(),
			author: oVariantItem.getAuthor()
		};

		return oItem;
	};

	VariantManagement.prototype._setStandardItemProperties = function() {

		var oItem = {
			key: this.getStandardVariantKey(),
			text: this._determineStandardVariantName(),
			readOnly: true,
			executeOnSelection: this.getExecuteOnSelectionForStandardVariant(),
			global: true,
			lifecyclePackage: "",
			lifecycleTransportId: "",
			namespace: "",
			textReadOnly: true,
			author: "SAP"
		};

		return oItem;
	};

	// exit destroy all controls created in init
	VariantManagement.prototype.exit = function() {

		if (this.oVariantPopOver) {
			this.oVariantPopOver.destroy();
			this.oVariantPopOver = undefined;
		}

		if (this.oSaveAsDialog) {
			this.oSaveAsDialog.destroy();
			this.oSaveAsDialog = undefined;
		}

		if (this.oManagementDialog) {
			this.oManagementDialog.destroy();
			this.oManagementDialog = undefined;
		}

		if (this.oModel) {
			this.oModel.destroy();
			this.oModel = undefined;
		}

		if (this.oDefault && !this.oDefault._bIsBeingDestroyed) {
			this.oDefault.destroy();
		}
		this.oDefault = undefined;

		if (this.oShare && !this.oShare._bIsBeingDestroyed) {
			this.oShare.destroy();
		}
		this.oShare = undefined;

		if (this.oExecuteOnSelect && !this.oExecuteOnSelect._bIsBeingDestroyed) {
			this.oExecuteOnSelect.destroy();
		}
		this.oExecuteOnSelect = undefined;

		this.oVariantPopoverTrigger = undefined;
		this._oRb = undefined;
	};

	return VariantManagement;

}, /* bExport= */true);