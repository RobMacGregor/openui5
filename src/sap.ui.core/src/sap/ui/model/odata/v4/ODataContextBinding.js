/*!
 * ${copyright}
 */

//Provides class sap.ui.model.odata.v4.ODataContextBinding
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/model/ChangeReason",
	"sap/ui/model/ContextBinding",
	"./_Context",
	"./_ODataHelper",
	"./lib/_Cache"
], function (jQuery, ChangeReason, ContextBinding, _Context, _ODataHelper, _Cache) {
	"use strict";

	var mSupportedEvents = {
			change : true,
			dataReceived : true,
			dataRequested : true
		};

	/**
	 * DO NOT CALL this private constructor for a new <code>ODataContextBinding</code>,
	 * but rather use {@link sap.ui.model.odata.v4.ODataModel#bindContext bindContext} instead!
	 *
	 * @param {sap.ui.model.odata.v4.ODataModel} oModel
	 *   The OData v4 model
	 * @param {string} sPath
	 *   The binding path in the model; must not end with a slash
	 * @param {sap.ui.model.Context} [oContext]
	 *   The context which is required as base for a relative path
	 * @param {object} [mParameters]
	 *   Map of OData query options as specified in "OData Version 4.0 Part 2: URL Conventions".
	 *   The following query options are allowed:
	 *   <ul>
	 *   <li> All "5.2 Custom Query Options" except for those with a name starting with "sap-"
	 *   <li> The $expand and $select "5.1 System Query Options"
	 *   </ul>
	 *   All other query options lead to an error.
	 *   Query options specified for the binding overwrite model query options.
	 *   Note: Query options may only be provided for absolute binding paths as only those
	 *   lead to a data service request.
	 * @throws {Error} When disallowed OData query options are provided
	 * @class Context binding for an OData v4 model.
	 *   An event handler can only be attached to this binding for the following events: 'change',
	 *   'dataReceived', and 'dataRequested'.
	 *   For other events, an error is thrown.
	 *
	 * @author SAP SE
	 * @version ${version}
	 * @alias sap.ui.model.odata.v4.ODataContextBinding
	 * @extends sap.ui.model.ContextBinding
	 * @public
	 */
	var ODataContextBinding = ContextBinding.extend("sap.ui.model.odata.v4.ODataContextBinding", {
			constructor : function (oModel, sPath, oContext, mParameters) {
				ContextBinding.call(this, oModel, sPath, oContext);

				if (sPath.slice(-1) === "/") {
					throw new Error("Invalid path: " + sPath);
				}
				this.oCache = undefined;
				if (!this.isRelative()) {
					this.oCache = _Cache.createSingle(oModel.oRequestor, sPath.slice(1),
						_ODataHelper.buildQueryOptions(oModel.mUriParameters, mParameters,
							["$expand", "$select"]));
				} else if (mParameters) {
					throw new Error("Bindings with a relative path do not support parameters");
				}
			},
			metadata : {
				publicMethods : []
			}
		});

	// See class documentation
	// @public
	// @see sap.ui.base.EventProvider#attachEvent
	// @since 1.37.0
	ODataContextBinding.prototype.attachEvent = function (sEventId) { //@override
		if (!(sEventId in mSupportedEvents)) {
			throw new Error("Unsupported event '" + sEventId
				+ "': v4.ODataContextBinding#attachEvent");
		}
		return ContextBinding.prototype.attachEvent.apply(this, arguments);
	};

	/**
	 * The 'change' event is fired when the binding is initialized or its parent context is changed.
	 * It is to be used by controls to get notified about changes to the bound context of this
	 * context binding.
	 * Registered event handlers are called with the change reason as parameter.
	 *
	 * @name sap.ui.model.odata.v4.ODataContextBinding#change
	 * @event
	 * @param {sap.ui.base.Event} oEvent
	 * @param {object} oEvent.getParameters
	 * @param {sap.ui.model.ChangeReason} oEvent.getParameters.reason
	 *   The reason for the 'change' event: {@link sap.ui.model.ChangeReason.Change Change}
	 *   when the binding is initialized, {@link sap.ui.model.ChangeReason.Refresh Refresh} when
	 *   the binding is refreshed, and {@link sap.ui.model.ChangeReason.Context Context} when the
	 *   parent context is changed
	 * @see sap.ui.base.Event
	 * @protected
	 * @since 1.37.0
	 */

	/**
	 * The 'dataRequested' event is fired directly after data has been requested from a back end.
	 * It is to be used by applications for example to switch on a busy indicator. Registered event
	 * handlers are called without parameters.
	 *
	 * @name sap.ui.model.odata.v4.ODataContextBinding#dataRequested
	 * @event
	 * @param {sap.ui.base.Event} oEvent
	 * @see sap.ui.base.Event
	 * @public
	 * @since 1.37.0
	 */

	/**
	 * The 'dataReceived' event is fired after the back end data has been processed. It is to be
	 * used by applications for example to switch off a busy indicator or to process an error.
	 *
	 * If back end requests are successful, the event has no parameters. The response data is
	 * available in the model. Note that controls bound to this data may not yet have been updated;
	 * it is thus not safe for registered event handlers to access data via control APIs.
	 *
	 * If a back end request fails, the 'dataReceived' event provides an <code>Error</code> in the
	 * 'error' event parameter.
	 *
	 * @name sap.ui.model.odata.v4.ODataContextBinding#dataReceived
	 * @event
	 * @param {sap.ui.base.Event} oEvent
	 * @param {object} oEvent.getParameters
	 * @param {Error} [oEvent.getParameters.error] The error object if a back end request failed.
	 *   If there are multiple failed back end requests, the error of the first one is provided.
	 * @see sap.ui.base.Event
	 * @public
	 * @since 1.37.0
	 */

	/**
	 * Initializes the OData context binding. Fires a 'change' event in case the binding has a
	 * resolved path.
	 *
	 * @protected
	 * @see sap.ui.model.Binding#initialize
	 * @since 1.37.0
	 */
	ODataContextBinding.prototype.initialize = function () { //@override
		var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);

		if (!sResolvedPath) {
			return;
		}
		this.oElementContext = _Context.create(this.oModel, this, sResolvedPath);
		this._fireChange({reason : ChangeReason.Change});
	};

	/**
	 * Method not supported
	 *
	 * @throws {Error}
	 *
	 * @public
	 * @see sap.ui.model.Binding#isInitial
	 * @since 1.37.0
	 */
	ODataContextBinding.prototype.isInitial = function () { //@override
		throw new Error("Unsupported operation: v4.ODataContextBinding#isInitial");
	};

	/**
	 * Refreshes the binding. Prompts the model to retrieve data from the server and notifies the
	 * control that new data is available. <code>bForceUpdate</code> has to be <code>true</code>.
	 * If <code>bForceUpdate</code> is not given or <code>false</code>, an error is thrown.
	 * Refresh is supported for absolute bindings.
	 *
	 * @param {boolean} bForceUpdate
	 *   The parameter <code>bForceUpdate</code> has to be <code>true</code>.
	 * @param {string} [sGroupId]
	 *   The parameter <code>sGroupId</code> is not supported.
	 * @throws {Error} When <code>bForceUpdate</code> is not <code>true</code> or
	 *   <code>sGroupId</code> is set or refresh on this binding is not supported.
	 * @public
	 * @see sap.ui.model.Binding#refresh
	 * @since 1.37.0
	 */
	ODataContextBinding.prototype.refresh = function (bForceUpdate, sGroupId) { //@override
		if (bForceUpdate !== true) {
			throw new Error("Unsupported operation: v4.ODataContextBinding#refresh, "
				+ "bForceUpdate must be true");
		}
		if (sGroupId !== undefined) {
			throw new Error("Unsupported operation: v4.ODataContextBinding#refresh, "
				+ "sGroupId parameter must not be set");
		}
		if (!this.oCache) {
			throw new Error("Refresh on this binding is not supported");
		}
		this.oCache.refresh();
		this._fireChange({reason : ChangeReason.Refresh});
	};

	/**
	 * Requests the value for the given path; the value is requested from this binding's
	 * cache or from its context in case it has no cache.
	 *
	 * @param {string} [sPath]
	 *   Some relative path
	 * @returns {Promise}
	 *   A promise on the outcome of the cache's <code>read</code> call
	 *  @private
	 */
	ODataContextBinding.prototype.requestValue = function (sPath) {
		var that = this,
			bDataRequested = false;

		if (this.oCache) {
			return this.oCache.read(/*sGroupId*/"", sPath, function () {
				bDataRequested = true;
				that.oModel.dataRequested("", that.fireDataRequested.bind(that));
			}).then(function (vValue) {
				if (bDataRequested) {
					that.fireDataReceived();
				}
				return vValue;
			}, function (oError) {
				if (bDataRequested) {
					if (oError.canceled) {
						that.fireDataReceived();
					} else {
						// log error only once when data request failed
						jQuery.sap.log.error("Failed to read path " + that.sPath, oError,
							"sap.ui.model.odata.v4.ODataContextBinding");
						that.fireDataReceived({error : oError});
					}
				}
				throw oError;
			});
		}
		return this.oContext.requestValue(this.sPath + (sPath ? "/" + sPath : ""));
	};

	/**
	 * Method not supported
	 *
	 * @throws {Error}
	 * @public
	 * @see sap.ui.model.Binding#resume
	 * @since 1.37.0
	 */
	ODataContextBinding.prototype.resume = function () { //@override
		throw new Error("Unsupported operation: v4.ODataContextBinding#resume");
	};

	/**
	 * Sets the (base) context which is used when the binding path is relative.
	 *
	 * @param {sap.ui.model.Context} [oContext]
	 *   The context which is required as base for a relative path
	 * @private
	 * @see sap.ui.model.Binding#setContext
	 */
	ODataContextBinding.prototype.setContext = function (oContext) { //@override
		if (this.oContext !== oContext) {
			this.oContext = oContext;
			if (this.isRelative()) {
				throw new Error("Nested context bindings are not supported");
			}
		}
	};

	/**
	 * Method not supported
	 *
	 * @throws {Error}
	 * @public
	 * @see sap.ui.model.Binding#suspend
	 * @since 1.37.0
	 */
	ODataContextBinding.prototype.suspend = function () { //@override
		throw new Error("Unsupported operation: v4.ODataContextBinding#suspend");
	};

	return ODataContextBinding;

}, /* bExport= */ true);
