
typeof SDK == "undefined" && (SDK = {
    __namespace: !0
});
SDK.REST = {
    _context: function () {
        if (typeof GetGlobalContext != "undefined")
            return GetGlobalContext();
        if (typeof Xrm != "undefined")
            return Xrm.Page.context;
        throw new Error("Context is not available.");
    },
    _getServerUrl: function () {
        if (this._context().getClientUrl)
            return this._context().getClientUrl();
        var n = this._context().getServerUrl();
        return n.match(/\/$/) && (n = n.substring(0, n.length - 1)),
            n
    },
    _ODataPath: function () {
        return this._getServerUrl() + "/XRMServices/2011/OrganizationData.svc/"
    },
    _errorHandler: function (n) {
        if (n.status == 12029)
            return new Error("The attempt to connect to the server failed.");
        if (n.status == 12007)
            return new Error("The server name could not be resolved.");
        var t;
        try {
            t = JSON.parse(n.responseText).error.message.value
        } catch (i) {
            t = n.responseText
        }
        return new Error("Error : " + n.status + ": " + n.statusText + ": " + t)
    },
    _dateReviver: function (n, t) {
        var i;
        return typeof t == "string" && (i = /Date\(([-+]?\d+)\)/.exec(t),
            i) ? new Date(parseInt(t.replace("/Date(", "").replace(")/", ""), 10)) : t
    },
    _parameterCheck: function (n, t) {
        if (typeof n == "undefined" || n === null)
            throw new Error(t);
    },
    _stringParameterCheck: function (n, t) {
        if (typeof n != "string")
            throw new Error(t);
    },
    _callbackParameterCheck: function (n, t) {
        if (typeof n != "function")
            throw new Error(t);
    },
    createRecord: function (n, t, i, r) {
        this._parameterCheck(n, "SDK.REST.createRecord requires the object parameter.");
        this._stringParameterCheck(t, "SDK.REST.createRecord requires the type parameter is a string.");
        this._callbackParameterCheck(i, "SDK.REST.createRecord requires the successCallback is a function.");
        this._callbackParameterCheck(r, "SDK.REST.createRecord requires the errorCallback is a function.");
        var u = new XMLHttpRequest;
        u.open("POST", encodeURI(this._ODataPath() + t + "Set"), !0);
        u.setRequestHeader("Accept", "application/json");
        u.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        u.onreadystatechange = function () {
            this.readyState == 4 && (this.status == 201 ? i(JSON.parse(this.responseText, SDK.REST._dateReviver).d) : r(SDK.REST._errorHandler(this)))
        }
            ;
        u.send(JSON.stringify(n))
    },
    retrieveRecord: function (n, t, i, r, u, f) {
        var e, s, o;
        this._stringParameterCheck(n, "SDK.REST.retrieveRecord requires the id parameter is a string.");
        this._stringParameterCheck(t, "SDK.REST.retrieveRecord requires the type parameter is a string.");
        i != null && this._stringParameterCheck(i, "SDK.REST.retrieveRecord requires the select parameter is a string.");
        r != null && this._stringParameterCheck(r, "SDK.REST.retrieveRecord requires the expand parameter is a string.");
        this._callbackParameterCheck(u, "SDK.REST.retrieveRecord requires the successCallback parameter is a function.");
        this._callbackParameterCheck(f, "SDK.REST.retrieveRecord requires the errorCallback parameter is a function.");
        e = "";
        (i != null || r != null) && (e = "?",
            i != null && (s = "$select=" + i,
                r != null && (s = s + "," + r),
                e = e + s),
            r != null && (e = e + "&$expand=" + r));
        o = new XMLHttpRequest;
        o.open("GET", encodeURI(this._ODataPath() + t + "Set(guid'" + n + "')" + e), !0);
        o.setRequestHeader("Accept", "application/json");
        o.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        o.onreadystatechange = function () {
            this.readyState == 4 && (this.status == 200 ? u(JSON.parse(this.responseText, SDK.REST._dateReviver).d) : f(SDK.REST._errorHandler(this)))
        }
            ;
        o.send()
    },
    updateRecord: function (n, t, i, r, u) {
        this._stringParameterCheck(n, "SDK.REST.updateRecord requires the id parameter.");
        this._parameterCheck(t, "SDK.REST.updateRecord requires the object parameter.");
        this._stringParameterCheck(i, "SDK.REST.updateRecord requires the type parameter.");
        this._callbackParameterCheck(r, "SDK.REST.updateRecord requires the successCallback is a function.");
        this._callbackParameterCheck(u, "SDK.REST.updateRecord requires the errorCallback is a function.");
        var f = new XMLHttpRequest;
        f.open("POST", encodeURI(this._ODataPath() + i + "Set(guid'" + n + "')"), !0);
        f.setRequestHeader("Accept", "application/json");
        f.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        f.setRequestHeader("X-HTTP-Method", "MERGE");
        f.onreadystatechange = function () {
            this.readyState == 4 && (this.status == 204 || this.status == 1223 ? r() : u(SDK.REST._errorHandler(this)))
        }
            ;
        f.send(JSON.stringify(t))
    },
    updateRecordSync: function (n, t, i, r, u) {
        this._stringParameterCheck(n, "SDK.REST.updateRecord requires the id parameter.");
        this._parameterCheck(t, "SDK.REST.updateRecord requires the object parameter.");
        this._stringParameterCheck(i, "SDK.REST.updateRecord requires the type parameter.");
        this._callbackParameterCheck(r, "SDK.REST.updateRecord requires the successCallback is a function.");
        this._callbackParameterCheck(u, "SDK.REST.updateRecord requires the errorCallback is a function.");
        var f = new XMLHttpRequest;
        f.open("POST", encodeURI(this._ODataPath() + i + "Set(guid'" + n + "')"), !1);
        f.setRequestHeader("Accept", "application/json");
        f.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        f.setRequestHeader("X-HTTP-Method", "MERGE");
        f.onreadystatechange = function () {
            this.readyState == 4 && (this.status == 204 || this.status == 1223 ? r() : u(SDK.REST._errorHandler(this)))
        }
            ;
        f.send(JSON.stringify(t))
    },
    deleteRecord: function (n, t, i, r) {
        this._stringParameterCheck(n, "SDK.REST.deleteRecord requires the id parameter.");
        this._stringParameterCheck(t, "SDK.REST.deleteRecord requires the type parameter.");
        this._callbackParameterCheck(i, "SDK.REST.deleteRecord requires the successCallback is a function.");
        this._callbackParameterCheck(r, "SDK.REST.deleteRecord requires the errorCallback is a function.");
        var u = new XMLHttpRequest;
        u.open("POST", encodeURI(this._ODataPath() + t + "Set(guid'" + n + "')"), !0);
        u.setRequestHeader("Accept", "application/json");
        u.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        u.setRequestHeader("X-HTTP-Method", "DELETE");
        u.onreadystatechange = function () {
            this.readyState == 4 && (this.status == 204 || this.status == 1223 ? i() : r(SDK.REST._errorHandler(this)))
        }
            ;
        u.send()
    },
    retrieveMultipleRecords: function (n, t, i, r, u) {
        var e, f;
        this._stringParameterCheck(n, "SDK.REST.retrieveMultipleRecords requires the type parameter is a string.");
        t != null && this._stringParameterCheck(t, "SDK.REST.retrieveMultipleRecords requires the options parameter is a string.");
        this._callbackParameterCheck(i, "SDK.REST.retrieveMultipleRecords requires the successCallback parameter is a function.");
        this._callbackParameterCheck(r, "SDK.REST.retrieveMultipleRecords requires the errorCallback parameter is a function.");
        this._callbackParameterCheck(u, "SDK.REST.retrieveMultipleRecords requires the OnComplete parameter is a function.");
        t != null && (e = t.charAt(0) != "?" ? "?" + t : t);
        f = new XMLHttpRequest;
        f.open("GET", this._ODataPath() + n + "Set" + e, !0);
        f.setRequestHeader("Accept", "application/json");
        f.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        f.onreadystatechange = function () {
            var t, f;
            this.readyState == 4 && (this.status == 200 ? (t = JSON.parse(this.responseText, SDK.REST._dateReviver).d,
                i(t.results),
                t.__next != null ? (f = t.__next.substring((SDK.REST._ODataPath() + n + "Set").length),
                    SDK.REST.retrieveMultipleRecords(n, f, i, r, u)) : u()) : r(SDK.REST._errorHandler(this)))
        }
            ;
        f.send()
    },
    retrieveRecordsExist: function (n, t) {
        var u, i, r;
        if (this._stringParameterCheck(n, "SDK.REST.retrieveMultipleRecords requires the type parameter is a string."),
            t != null && this._stringParameterCheck(t, "SDK.REST.retrieveMultipleRecords requires the options parameter is a string."),
            t != null && (u = t.charAt(0) != "?" ? "?" + t : t),
            i = new XMLHttpRequest,
            i.open("GET", this._ODataPath() + n + "Set" + u + "&$top=1", !1),
            i.setRequestHeader("Accept", "application/json"),
            i.setRequestHeader("Content-Type", "application/json; charset=utf-8"),
            i.send(),
            this.readyState == 4)
            if (this.status == 200) {
                if (r = JSON.parse(this.responseText, SDK.REST._dateReviver).d,
                    r.results != null && r.results[0] != null)
                    return !0
            } else
                SDK.REST._errorHandler(this)
    },
    associateRecords: function (n, t, i, r, u, f, e) {
        var o, s;
        this._stringParameterCheck(n, "SDK.REST.associateRecords requires the parentId parameter is a string.");
        this._stringParameterCheck(t, "SDK.REST.associateRecords requires the parentType parameter is a string.");
        this._stringParameterCheck(i, "SDK.REST.associateRecords requires the relationshipName parameter is a string.");
        this._stringParameterCheck(r, "SDK.REST.associateRecords requires the childId parameter is a string.");
        this._stringParameterCheck(u, "SDK.REST.associateRecords requires the childType parameter is a string.");
        this._callbackParameterCheck(f, "SDK.REST.associateRecords requires the successCallback parameter is a function.");
        this._callbackParameterCheck(e, "SDK.REST.associateRecords requires the errorCallback parameter is a function.");
        o = new XMLHttpRequest;
        o.open("POST", encodeURI(this._ODataPath() + t + "Set(guid'" + n + "')/$links/" + i), !0);
        o.setRequestHeader("Accept", "application/json");
        o.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        o.onreadystatechange = function () {
            this.readyState == 4 && (this.status == 204 || this.status == 1223 ? f() : e(SDK.REST._errorHandler(this)))
        }
            ;
        s = {};
        s.uri = this._ODataPath() + "/" + u + "Set(guid'" + r + "')";
        o.send(JSON.stringify(s))
    },
    disassociateRecords: function (n, t, i, r, u, f) {
        this._stringParameterCheck(n, "SDK.REST.disassociateRecords requires the parentId parameter is a string.");
        this._stringParameterCheck(t, "SDK.REST.disassociateRecords requires the parentType parameter is a string.");
        this._stringParameterCheck(i, "SDK.REST.disassociateRecords requires the relationshipName parameter is a string.");
        this._stringParameterCheck(r, "SDK.REST.disassociateRecords requires the childId parameter is a string.");
        this._callbackParameterCheck(u, "SDK.REST.disassociateRecords requires the successCallback parameter is a function.");
        this._callbackParameterCheck(f, "SDK.REST.disassociateRecords requires the errorCallback parameter is a function.");
        var e = new XMLHttpRequest;
        e.open("POST", encodeURI(this._ODataPath() + t + "Set(guid'" + n + "')/$links/" + i + "(guid'" + r + "')"), !0);
        e.setRequestHeader("Accept", "application/json");
        e.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        e.setRequestHeader("X-HTTP-Method", "DELETE");
        e.onreadystatechange = function () {
            this.readyState == 4 && (this.status == 204 || this.status == 1223 ? u() : f(SDK.REST._errorHandler(this)))
        }
            ;
        e.send()
    },
    __namespace: !0
};
SDK = window.SDK || {
    __namespace: !0
};
SDK.Metadata = SDK.Metadata || {
    __namespace: !0
};
SDK.Metadata.Query = SDK.Metadata.Query || {
    __namespace: !0
};
SDK.Metadata.Query.ValueEnums = SDK.Metadata.Query.ValueEnums || {
    __namespace: !0
},
    function () {
        function i() {
            return typeof GetGlobalContext != "undefined" ? GetGlobalContext() : typeof Xrm != "undefined" ? Xrm.Page.context : new Error("Context is not available.")
        }
        function e() {
            if (typeof i().getClientUrl != "undefined")
                return i().getClientUrl();
            var n = i().getServerUrl();
            return n.match(/\/$/) && (n = n.substring(0, n.length - 1)),
                n
        }
        function o(t, i, f, e) {
            var h, w, v, y, o, l, p, b, k;
            if (t.readyState == 4)
                if (t.onreadystatechange = null,
                    t.status == 200) {
                    h = t.responseXML;
                    try {
                        a(h)
                    } catch (tt) { }
                    var nt = c(h, "//a:Results/a:KeyValuePairOfstringanyType/b:value[../b:key/text()='ServerVersionStamp']")
                        , d = []
                        , g = u(h, "//a:Results/a:KeyValuePairOfstringanyType/b:value[../b:key/text()='EntityMetadata']");
                    for (o = 0; o < g.childNodes.length; o++)
                        w = r(g.childNodes[o]),
                            w._type = "EntityMetadata",
                            d.push(w);
                    if (v = {},
                        y = u(h, "//a:Results/a:KeyValuePairOfstringanyType/b:value[../b:key/text()='DeletedMetadata']"),
                        y != null)
                        for (o = 0; o < y.childNodes.length; o++)
                            for (l = y.childNodes[o].firstChild,
                                v[n(l)] = [],
                                p = 0; p < l.nextSibling.childNodes.length; p++)
                                b = n(l.nextSibling.childNodes[p]),
                                    v[n(l)].push(b);
                    k = new SDK.Metadata.Query.RetrieveMetadataChangesResponse(d, nt, v);
                    i(k, e)
                } else
                    f(s(t))
        }
        function s(t) {
            var l, r, f, e, o, i, s, h, c, a;
            if (t.status == 12029)
                return new Error("The attempt to connect to the server failed.");
            if (t.status == 12007)
                return new Error("The server name could not be resolved.");
            if (l = t.responseXML,
                r = "Unknown (unable to parse the fault)",
                typeof l == "object") {
                var u = null
                    , v = null
                    , y = l.firstChild.firstChild;
                for (f = 0; f < y.childNodes.length; f++)
                    if (e = y.childNodes[f],
                        "s:Fault" == e.nodeName) {
                        for (o = 0; o < e.childNodes.length; o++)
                            if (i = e.childNodes[o],
                                "faultstring" == i.nodeName && (u = n(i)),
                                "detail" == i.nodeName)
                                for (s = 0; s < i.childNodes.length; s++)
                                    if (h = i.childNodes[s],
                                        "OrganizationServiceFault" == h.nodeName)
                                        for (c = 0; c < h.childNodes.length; c++)
                                            if (a = h.childNodes[c],
                                                "ErrorCode" == a.nodeName) {
                                                v = n(a);
                                                break
                                            }
                        break
                    }
            }
            return (v != null && u != null ? r = "Error Code:" + v + " Message: " + u : u != null && (r = u),
                r.indexOf("-2147204270") != -1) ? new Error("ExpiredVersionStamp: The clientVersionStamp value passed with the request is before the time specified in the Organization.ExpireSubscriptionsInDays value. Reinitialize your metadata cache using a null clientVersionStamp parameter.") : new Error(r)
        }
        function h(n) {
            for (var t = 0; t < f.length; t++)
                if (n == f[t])
                    return !0;
            return !1
        }
        function r(n) {
            var o, f, s, e, u, i;
            if (n.attributes != null && n.attributes.length == 1 && n.attributes.getNamedItem("i:nil") != null && n.attributes.getNamedItem("i:nil").nodeValue == "true")
                return null;
            if (n.firstChild != null && n.firstChild.nodeType == 3) {
                o = t(n);
                switch (o) {
                    case "ActivityTypeMask":
                    case "ObjectTypeCode":
                    case "ColumnNumber":
                    case "DefaultFormValue":
                    case "MaxValue":
                    case "MinValue":
                    case "MaxLength":
                    case "Order":
                    case "Precision":
                    case "PrecisionSource":
                    case "LanguageCode":
                        return parseInt(n.firstChild.nodeValue, 10);
                    case "AutoRouteToOwnerQueue":
                    case "CanBeChanged":
                    case "CanTriggerWorkflow":
                    case "IsActivity":
                    case "IsActivityParty":
                    case "IsAvailableOffline":
                    case "IsChildEntity":
                    case "IsCustomEntity":
                    case "IsCustomOptionSet":
                    case "IsDocumentManagementEnabled":
                    case "IsEnabledForCharts":
                    case "IsGlobal":
                    case "IsImportable":
                    case "IsIntersect":
                    case "IsManaged":
                    case "IsReadingPaneEnabled":
                    case "IsValidForAdvancedFind":
                    case "CanBeSecuredForCreate":
                    case "CanBeSecuredForRead":
                    case "CanBeSecuredForUpdate":
                    case "IsCustomAttribute":
                    case "IsManaged":
                    case "IsPrimaryId":
                    case "IsPrimaryName":
                    case "IsSecured":
                    case "IsValidForCreate":
                    case "IsValidForRead":
                    case "IsValidForUpdate":
                    case "IsCustomRelationship":
                    case "CanBeBasic":
                    case "CanBeDeep":
                    case "CanBeGlobal":
                    case "CanBeLocal":
                        return n.firstChild.nodeValue == "true" ? !0 : !1;
                    case "Value":
                        return n.firstChild.nodeValue == "true" || n.firstChild.nodeValue == "false" ? n.firstChild.nodeValue == "true" ? !0 : !1 : n.firstChild.nodeValue == "ApplicationRequired" || n.firstChild.nodeValue == "None" || n.firstChild.nodeValue == "Recommended" || n.firstChild.nodeValue == "SystemRequired" ? n.firstChild.nodeValue : parseInt(n.firstChild.nodeValue, 10);
                    default:
                        return n.firstChild.nodeValue
                }
            }
            if (h(t(n))) {
                for (f = [],
                    i = 0; i < n.childNodes.length; i++)
                    s = n.childNodes[i].attributes != null && n.childNodes[i].attributes.getNamedItem("i:type") != null ? n.childNodes[i].attributes.getNamedItem("i:type").nodeValue.split(":")[1] : t(n.childNodes[i]),
                        e = r(n.childNodes[i]),
                        e._type = s,
                        f.push(e);
                return f
            }
            if (n.childNodes.length == 0)
                return null;
            for (u = {},
                n.attributes.getNamedItem("i:type") != null && (u._type = n.attributes.getNamedItem("i:type").nodeValue.split(":")[1]),
                i = 0; i < n.childNodes.length; i++)
                u[t(n.childNodes[i])] = n.childNodes[i].nodeType == 3 ? n.childNodes[i].nodeValue : r(n.childNodes[i]);
            return u
        }
        function u(n, t) {
            if (window.ActiveXObject && typeof n.selectSingleNode != "undefined")
                return n.selectSingleNode(t);
            var r = new XPathEvaluator
                , i = r.evaluate(t, n, v, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return i != null ? i.singleNodeValue : null
        }
        function c(n, t) {
            var i = u(n, t);
            return l(i) ? null : typeof i.text != "undefined" ? i.text : i.textContent
        }
        function n(n) {
            return typeof n.text != "undefined" ? n.text : n.textContent
        }
        function l(n) {
            return n == null ? !0 : n.attributes.getNamedItem("i:nil") != null && n.attributes.getNamedItem("i:nil").value == "true" ? !0 : !1
        }
        function t(n) {
            return typeof n.baseName != "undefined" ? n.baseName : n.localName
        }
        function a(n) {
            n.setProperty("SelectionNamespaces", "xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:i='http://www.w3.org/2001/XMLSchema-instance' xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic' xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata'")
        }
        function v(n) {
            return {
                s: "http://schemas.xmlsoap.org/soap/envelope/",
                a: "http://schemas.microsoft.com/xrm/2011/Contracts",
                i: "http://www.w3.org/2001/XMLSchema-instance",
                b: "http://schemas.datacontract.org/2004/07/System.Collections.Generic",
                c: "http://schemas.microsoft.com/xrm/2011/Metadata"
            }[n] || null
        }
        this.AttributeQueryExpression = function (n, t) {
            function r(n) {
                try {
                    i.setCriteria(n)
                } catch (t) {
                    throw t;
                }
            }
            function u(n) {
                try {
                    i.setProperties(n)
                } catch (t) {
                    throw t;
                }
            }
            if (!(this instanceof SDK.Metadata.Query.AttributeQueryExpression))
                return new SDK.Metadata.Query.AttributeQueryExpression(n, t);
            var i = null
                , f = "SDK.Metadata.Query.AttributeQueryExpression is not initialized.";
            if (typeof n == "undefined" || typeof t == "undefined" || n == null || t == null)
                throw new Error("SDK.Metadata.Query.AttributeQueryExpression criteria and properties parameter values are required.");
            else {
                if (!(n instanceof SDK.Metadata.Query.MetadataFilterExpression))
                    throw new Error("SDK.Metadata.Query.AttributeQueryExpression criteria must be an SDK.Metadata.Query.MetadataFilterExpression");
                if (!(t instanceof SDK.Metadata.Query.MetadataPropertiesExpression))
                    throw new Error("SDK.Metadata.Query.AttributeQueryExpression properties must be an SDK.Metadata.Query.MetadataPropertiesExpression");
                i = new SDK.Metadata.Query.MetadataQueryExpression(n, t)
            }
            this.getCriteria = function () {
                return i.getCriteria()
            }
                ;
            this.setCriteria = function (n) {
                r(n)
            }
                ;
            this.getProperties = function () {
                return i.getProperties()
            }
                ;
            this.setProperties = function (n) {
                u(n)
            }
                ;
            this._toXml = function () {
                if (i == null)
                    throw new Error(f);
                return ["<c:AttributeQuery>", i._toXml(), "<\/c:AttributeQuery>"].join("")
            }
        }
            ;
        this.AttributeQueryExpression.__class = !0;
        this.Collection = function (n, t) {
            if (!(this instanceof SDK.Metadata.Query.Collection))
                return new SDK.Metadata.Query.Collection(n, t);
            var r = n
                , u = "The value being added to the SDK.Metadata.Query.Collection is not the expected type."
                , i = [];
            this.count = 0;
            this.add = function (n) {
                if (r == String && (n = new String(n)),
                    r == Number && (n = new Number(n)),
                    n instanceof r)
                    i.push(n),
                        this.count++;
                else
                    throw new Error(u);
            }
                ;
            this.clear = function () {
                i.length = 0;
                this.Count = 0
            }
                ;
            this.remove = function (n) {
                for (var t = 0; t < i.length; t++)
                    if (n === i[t]) {
                        i.splice(t, 1);
                        this.count--;
                        return
                    }
                throw new Error("Item '" + n.toString() + "' not found.");
            }
                ;
            this.contains = function (n) {
                for (var t = 0; t < i.length; t++)
                    if (n === i[t])
                        return !0;
                return !1
            }
                ;
            this.addRange = function (n) {
                var i = "SDK.Metadata.Query.Collection.addRange requires an array parameter.", t;
                if (n != null)
                    if (typeof n.push != "undefined")
                        for (t = 0; t < n.length; t++)
                            this.add(n[t]);
                    else
                        throw new Error(i);
                else
                    throw new Error(i);
            }
                ;
            this.forEach = function (n) {
                for (var t = 0; t < i.length; t++)
                    n(i[t], t)
            }
                ;
            t != null && this.addRange(t)
        }
            ;
        this.Collection.__class = !0;
        this.EntityQueryExpression = function (n, t, i, r, u) {
            function a(n) {
                try {
                    f.setCriteria(n)
                } catch (t) {
                    throw t;
                }
            }
            function v(n) {
                try {
                    f.setProperties(n)
                } catch (t) {
                    throw t;
                }
            }
            function h(n) {
                if (n == null)
                    e = n;
                else if (n instanceof SDK.Metadata.Query.AttributeQueryExpression)
                    e = n;
                else
                    throw new Error(p);
            }
            function c(n) {
                if (n == null)
                    o = n;
                else if (n instanceof SDK.Metadata.Query.RelationshipQueryExpression)
                    o = n;
                else
                    throw new Error(b);
            }
            function l(n) {
                if (n == null)
                    s = n;
                else if (n instanceof SDK.Metadata.Query.LabelQueryExpression)
                    s = n;
                else
                    throw new Error(w);
            }
            if (!(this instanceof SDK.Metadata.Query.EntityQueryExpression))
                return new SDK.Metadata.Query.EntityQueryExpression(n, t, i, r, u);
            var f = null
                , e = null
                , o = null
                , s = null
                , y = "SDK.Metadata.Query.EntityQueryExpression is not initialized."
                , p = "SDK.Metadata.Query.EntityQueryExpression attributeQuery must be an SDK.Metadata.Query.AttributeQueryExpression"
                , w = "SDK.Metadata.Query.EntityQueryExpression labelQuery must be an SDK.Metadata.Query.LabelQueryExpression"
                , b = "SDK.Metadata.Query.EntityQueryExpression relationshipQuery must be an SDK.Metadata.Query.RelationshipQueryExpression";
            if (typeof n == "undefined" || typeof t == "undefined" || n == null || t == null)
                throw new Error("SDK.Metadata.Query.EntityQueryExpression criteria and properties parameter values are required.");
            else
                try {
                    f = new SDK.Metadata.Query.MetadataQueryExpression(n, t)
                } catch (k) {
                    throw k;
                }
            typeof i != "undefined" && h(i);
            typeof r != "undefined" && c(r);
            typeof u != "undefined" && l(u);
            this.getCriteria = function () {
                return f.getCriteria()
            }
                ;
            this.setCriteria = function (n) {
                a(n)
            }
                ;
            this.getProperties = function () {
                return f.getProperties()
            }
                ;
            this.setProperties = function (n) {
                v(n)
            }
                ;
            this.getAttributeQuery = function () {
                return e
            }
                ;
            this.setAttributeQuery = function (n) {
                h(n)
            }
                ;
            this.getRelationshipQuery = function () {
                return o
            }
                ;
            this.setRelationshipQuery = function (n) {
                c(n)
            }
                ;
            this.getLabelQuery = function () {
                return s
            }
                ;
            this.setLabelQuery = function (n) {
                l(n)
            }
                ;
            this._toXml = function () {
                var n, t, i;
                if (f == null)
                    throw new Error(y);
                return n = '<c:AttributeQuery i:nil="true" />',
                    e != null && (n = e._toXml()),
                    t = '<c:LabelQuery i:nil="true" />',
                    s != null && (t = s._toXml()),
                    i = '<c:RelationshipQuery i:nil="true" />',
                    o != null && (i = o._toXml()),
                    ['<b:value i:type="c:EntityQueryExpression" xmlns:c="http://schemas.microsoft.com/xrm/2011/Metadata/Query">', f._toXml(), n, t, i, "<\/b:value>"].join("")
            }
        }
            ;
        this.EntityQueryExpression.__class = !0;
        this.GuidValue = function (n) {
            if (!(this instanceof SDK.Metadata.Query.GuidValue))
                return new SDK.Metadata.Query.GuidValue(n);
            var t = null;
            if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(n))
                t = n;
            else
                throw new Error("Value passed as a Guid Value is not a valid Guid.");
            this.value = t
        }
            ;
        this.GuidValue.__class = !0;
        this.LabelQueryExpression = function (n) {
            if (!(this instanceof SDK.Metadata.Query.LabelQueryExpression))
                return new SDK.Metadata.Query.LabelQueryExpression(n);
            var t = null;
            if (typeof n != "undefined")
                try {
                    t = new SDK.Metadata.Query.Collection(Number, n)
                } catch (i) {
                    throw i;
                }
            else
                t = new SDK.Metadata.Query.Collection(Number);
            this.filterLanguages = t;
            this._toXml = function () {
                if (t == null)
                    throw new Error("SDK.Metadata.Query.LabelQueryExpression is not initialized.");
                var n = [];
                return t.forEach(function (t) {
                    n.push("<d:int>" + t + "<\/d:int>")
                }),
                    ['<c:FilterLanguages xmlns:d="http://schemas.microsoft.com/2003/10/Serialization/Arrays">', n.join(""), "<\/c:FilterLanguages>"].join("")
            }
        }
            ;
        this.LabelQueryExpression.__class = !0;
        this.MetadataConditionExpression = function (n, t, i) {
            function c(n) {
                var o, l, t, i;
                if (f == null)
                    throw new Error(d);
                for (o = !1,
                    l = ["AttributeType", "RelationshipType", "OwnershipType", "RequiredLevel", "Format", "ImeMode", "SecurityTypes"],
                    t = 0; t < l.length; t++)
                    if (f == l[t]) {
                        o = !0;
                        e = h.Metadata;
                        break
                    }
                if (o)
                    switch (f) {
                        case "AttributeType":
                            r = "AttributeTypeCode";
                            break;
                        case "RelationshipType":
                            r = "RelationshipType";
                            break;
                        case "OwnershipType":
                            r = "OwnershipTypes";
                            break;
                        case "RequiredLevel":
                            r = "AttributeRequiredLevel";
                            break;
                        case "Format":
                            var c = !1
                                , a = !1
                                , v = !1;
                            for (t in SDK.Metadata.Query.ValueEnums.DateTimeFormat)
                                if (u == t) {
                                    r = "DateTimeFormat";
                                    c = !0;
                                    break
                                }
                            if (!c)
                                for (t in SDK.Metadata.Query.ValueEnums.IntegerFormat)
                                    if (u == t) {
                                        a = !0;
                                        r = "IntegerFormat";
                                        break
                                    }
                            if (!c && !a)
                                for (t in SDK.Metadata.Query.ValueEnums.StringFormat)
                                    if (u == t) {
                                        v = !0;
                                        r = "StringFormat";
                                        break
                                    }
                            if (!c && !a && !v)
                                throw new Error("Unexpected attribute Format metadata enumeration.");
                            break;
                        case "ImeMode":
                            r = "ImeMode";
                            break;
                        case "SecurityTypes":
                            r = "SecurityTypes"
                    }
                else
                    (typeof n == "string" || typeof n == "number" || typeof n == "boolean") && (r = typeof n == "number" ? "int" : typeof n);
                if (s = typeof n == "object" && typeof n.push == "function",
                    s && !o)
                    if (e = h.Arrays,
                        n.length > 0)
                        if (i = typeof n[0],
                            i == "string" || i == "number" || i == "boolean")
                            r = i == "number" ? "int" : i;
                        else
                            throw new Error("Cannot determine the type of items in an array passed as a value to a SDK.Metadata.Query.MetadataConditionExpression.");
                    else
                        throw new Error(y);
                s || o || (e = h.XMLSchema)
            }
            function l(n) {
                if (typeof n == "string")
                    f = n,
                        u != null && c(u);
                else
                    throw new Error(b);
            }
            function p(n) {
                for (var t in SDK.Metadata.Query.MetadataConditionOperator)
                    if (n == t)
                        return !0;
                return !1
            }
            function a(n) {
                if (n == null)
                    o = n;
                else if (p(n))
                    o = n;
                else
                    throw new Error(k);
            }
            function v(n) {
                if (n == null)
                    u = null,
                        r = "null";
                else if (n instanceof SDK.Metadata.Query.GuidValue)
                    u = n.value,
                        r = "guid",
                        e = h.Serialization;
                else {
                    if (typeof n == "undefined" || n == null || typeof n != "string" && typeof n != "number" && typeof n != "boolean" && typeof n != "object" || typeof n == "object" && typeof n.push == "undefined" || typeof n == "object" && typeof n.push == "function" && n.length == 0)
                        throw new Error(y);
                    c(n);
                    u = n
                }
            }
            if (!(this instanceof SDK.Metadata.Query.MetadataConditionExpression))
                return new SDK.Metadata.Query.MetadataConditionExpression(n, t, i);
            var o = null
                , f = null
                , u = null
                , r = null
                , s = !1
                , h = {
                    Serialization: '"http://schemas.microsoft.com/2003/10/Serialization/"',
                    Arrays: '"http://schemas.microsoft.com/2003/10/Serialization/Arrays"',
                    Metadata: '"http://schemas.microsoft.com/xrm/2011/Metadata"',
                    XMLSchema: '"http://www.w3.org/2001/XMLSchema"'
                }
                , e = null
                , w = "A SDK.Metadata.Query.MetadataConditionExpression has properties that are null."
                , b = "The propertyName parameter value must be a string."
                , k = "The conditionOperator parameter value must be an SDK.Metadata.Query.MetadataConditionOperator"
                , y = "The value parameter must be either an array, a string, a number, a boolean value, or null. If an array, it must have at least one item."
                , d = "The MetadataConditionExpression property name must be known to validate the MetadataConditionExpression value.";
            typeof n != undefined && l(n);
            typeof t != undefined && a(t);
            typeof i != undefined && v(i);
            this.getConditionOperator = function () {
                return o
            }
                ;
            this.setConditionOperator = function (n) {
                a(n)
            }
                ;
            this.getPropertyName = function () {
                return f
            }
                ;
            this.setPropertyName = function (n) {
                l(n)
            }
                ;
            this.getValue = function () {
                return u
            }
                ;
            this.setValue = function (n) {
                v(n)
            }
                ;
            this._toXml = function () {
                var n, t;
                if (o == null || f == null || r == null)
                    throw new Error(w);
                if (r == "null")
                    n = '<c:Value i:nil="true" />';
                else if (s) {
                    for (n = '<c:Value i:type="d:ArrayOf' + r + '" xmlns:d=' + e + ">",
                        t = 0; t < u.length; t++)
                        n += "<d:" + r + ">" + u[t] + "<\/d:" + r + ">";
                    n += "<\/c:Value>"
                } else
                    n = '<c:Value i:type="d:' + r + '" xmlns:d=' + e + ">" + u + "<\/c:Value>";
                return ["<c:MetadataConditionExpression>", "<c:ConditionOperator>" + o + "<\/c:ConditionOperator>", "<c:PropertyName>" + f + "<\/c:PropertyName>", n, "<\/c:MetadataConditionExpression>"].join("")
            }
        }
            ;
        this.MetadataConditionExpression.__class = !0;
        this.MetadataFilterExpression = function (n) {
            function f() {
                var u = [], n;
                return t.forEach(function (n) {
                    u.push(n._toXml())
                }),
                    n = [],
                    r.forEach(function (t) {
                        n.push("<c:MetadataFilterExpression>");
                        n.push(t._toXml());
                        n.push("<\/c:MetadataFilterExpression>")
                    }),
                    ["<c:Conditions>", u.join(""), "<\/c:Conditions>", "<c:FilterOperator>" + i + "<\/c:FilterOperator>", "<c:Filters>", n.join(""), "<\/c:Filters>",].join("")
            }
            function e(n) {
                if (n instanceof SDK.Metadata.Query.MetadataConditionExpressionCollection)
                    t = n;
                else
                    throw new Error(s);
            }
            function u(n) {
                if (n != null && (n == "Or" || n == "And"))
                    i = n;
                else
                    throw new Error(o);
            }
            if (!(this instanceof SDK.Metadata.Query.MetadataFilterExpression))
                return new SDK.Metadata.Query.MetadataFilterExpression(n);
            var i = SDK.Metadata.Query.LogicalOperator.And
                , t = new SDK.Metadata.Query.Collection(SDK.Metadata.Query.MetadataConditionExpression)
                , r = new SDK.Metadata.Query.Collection(SDK.Metadata.Query.MetadataFilterExpression)
                , o = "SDK.Metadata.Query.MetadataFilterExpression FilterOperator requires a SDK.Metadata.Query.LogicalOperator."
                , s = "SDK.Metadata.Query.MetadataFilterExpression Conditions requires a SDK.Metadata.Query.MetadataConditionExpressionCollection.";
            typeof n != "undefined" && u(n);
            this.addCondition = function (n, i, r) {
                n instanceof SDK.Metadata.Query.MetadataConditionExpression && i == null && r == null ? t.add(n) : t.add(new SDK.Metadata.Query.MetadataConditionExpression(n, i, r))
            }
                ;
            this.addConditions = function (n) {
                t.addRange(n)
            }
                ;
            this.addFilter = function (n) {
                if (!(n instanceof SDK.Metadata.Query.MetadataFilterExpression))
                    throw new Error("addFilter filter parameter requires a SDK.Metadata.Query.MetadataFilterExpression)");
                r.add(n)
            }
                ;
            this.getConditions = function () {
                return t
            }
                ;
            this.setConditions = function (n) {
                e(n)
            }
                ;
            this.getFilterOperator = function () {
                return i
            }
                ;
            this.setFilterOperator = function (n) {
                u(n)
            }
                ;
            this.getFilters = function () {
                return r
            }
                ;
            this._toXml = f
        }
            ;
        this.MetadataFilterExpression.__class = !0;
        this.MetadataPropertiesExpression = function (n, t) {
            function u(n) {
                if (typeof n == "boolean")
                    r = n;
                else
                    throw new Error(e);
            }
            function f(n) {
                if (typeof n.push != "undefined")
                    i = new SDK.Metadata.Query.Collection(String, n);
                else
                    throw new Error(o);
            }
            if (!(this instanceof SDK.Metadata.Query.MetadataPropertiesExpression))
                return new SDK.Metadata.Query.MetadataPropertiesExpression(n, t);
            var r = n
                , i = new SDK.Metadata.Query.Collection(String)
                , e = "The SDK.Metadata.Query.MetadataPropertiesExpression allProperties  must be an Boolean value."
                , o = "The SDK.Metadata.Query.MetadataPropertiesExpression propertyNames  must be an Array.";
            typeof n != "undefined" && u(n);
            typeof t != "undefined" && f(t);
            this.addProperty = function (n) {
                i.add(n)
            }
                ;
            this.addProperties = function (n) {
                i.addRange(n)
            }
                ;
            this.getAllProperties = function () {
                return r
            }
                ;
            this.setAllProperties = function (n) {
                u(n)
            }
                ;
            this.getPropertyNames = function () {
                return i
            }
                ;
            this.setPropertyNames = function (n) {
                f(n)
            }
                ;
            this._toXml = function () {
                var n = [];
                return i.forEach(function (t) {
                    n.push("<d:string>" + t + "<\/d:string>")
                }),
                    ["<c:AllProperties>" + r + "<\/c:AllProperties>", '<c:PropertyNames xmlns:d="http://schemas.microsoft.com/2003/10/Serialization/Arrays">', n.join(""), "<\/c:PropertyNames>"].join("")
            }
        }
            ;
        this.MetadataPropertiesExpression.__class = !0;
        this.MetadataQueryExpression = function (n, t) {
            function u(n) {
                if (n == null)
                    i = n;
                else if (n instanceof SDK.Metadata.Query.MetadataFilterExpression)
                    i = n;
                else
                    throw new Error(s);
            }
            function f(n) {
                if (n == null)
                    r = n;
                else if (n instanceof SDK.Metadata.Query.MetadataPropertiesExpression)
                    r = n;
                else
                    throw new Error(h);
            }
            if (!(this instanceof SDK.Metadata.Query.MetadataQueryExpression))
                return new SDK.Metadata.Query.MetadataQueryExpression(n, t);
            var i = null
                , r = null
                , e = "SDK.Metadata.Query.MetadataQueryExpression criteria  is null."
                , o = "SDK.Metadata.Query.MetadataQueryExpression properties  is null."
                , s = "SDK.Metadata.Query.MetadataQueryExpression criteria  must be an SDK.Metadata.Query.MetadataFilterExpression"
                , h = "SDK.Metadata.Query.MetadataQueryExpression properties  must be an SDK.Metadata.Query.MetadataPropertiesExpression";
            u(n);
            f(t);
            this.getCriteria = function () {
                return i
            }
                ;
            this.setCriteria = function (n) {
                u(n)
            }
                ;
            this.getProperties = function () {
                return r
            }
                ;
            this.setProperties = function (n) {
                f(n)
            }
                ;
            this._toXml = function () {
                if (i == null)
                    throw new Error(e);
                if (r == null)
                    throw new Error(o);
                return ["<c:Criteria>", i._toXml(), "<\/c:Criteria>", "<c:Properties>", r._toXml(), "<\/c:Properties>"].join("")
            }
        }
            ;
        this.MetadataQueryExpression.__class = !0;
        this.RelationshipQueryExpression = function (n, t) {
            function r(n) {
                try {
                    i.setCriteria(n)
                } catch (t) {
                    throw t;
                }
            }
            function u(n) {
                try {
                    i.setProperties(n)
                } catch (t) {
                    throw t;
                }
            }
            if (!(this instanceof SDK.Metadata.Query.RelationshipQueryExpression))
                return new SDK.Metadata.Query.RelationshipQueryExpression(n, t);
            var i = null
                , f = "SDK.Metadata.Query.RelationshipQueryExpression is not initialized.";
            if (typeof n == "undefined" || typeof t == "undefined" || n == null || t == null)
                throw new Error("SDK.Metadata.Query.RelationshipQueryExpression criteria and properties parameter values are required.");
            else {
                if (!(n instanceof SDK.Metadata.Query.MetadataFilterExpression))
                    throw new Error("SDK.Metadata.Query.RelationshipQueryExpression criteria must be an SDK.Metadata.Query.MetadataFilterExpression");
                if (!(t instanceof SDK.Metadata.Query.MetadataPropertiesExpression))
                    throw new Error("SDK.Metadata.Query.RelationshipQueryExpression properties must be an SDK.Metadata.Query.MetadataPropertiesExpression");
                i = new SDK.Metadata.Query.MetadataQueryExpression(n, t)
            }
            this.getCriteria = function () {
                return i.getCriteria()
            }
                ;
            this.setCriteria = function (n) {
                r(n)
            }
                ;
            this.getProperties = function () {
                return i.getProperties()
            }
                ;
            this.setProperties = function (n) {
                u(n)
            }
                ;
            this._toXml = function () {
                if (i == null)
                    throw new Error(f);
                return ["<c:RelationshipQuery>", i._toXml(), "<\/c:RelationshipQuery>"].join("")
            }
        }
            ;
        this.RelationshipQueryExpression.__class = !0;
        this.DeletedMetadataFilters = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.MetadataConditionOperator = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.LogicalOperator = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.SearchableEntityMetadataProperties = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.SearchableAttributeMetadataProperties = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.SearchableRelationshipMetadataProperties = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.EntityMetadataProperties = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.AttributeMetadataProperties = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.RelationshipMetadataProperties = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.RetrieveMetadataChangesRequest = function (n, t, i) {
            function e(n) {
                if (n == null)
                    f = n;
                else if (n instanceof SDK.Metadata.Query.EntityQueryExpression)
                    f = n;
                else
                    throw new Error(c);
            }
            function o(n) {
                if (n == null)
                    u = n;
                else if (typeof n == "string")
                    u = n;
                else
                    throw new Error(l);
            }
            function s(n) {
                if (n == null)
                    r = n;
                else if (n >= 1 && n <= 31)
                    r = n;
                else
                    throw new Error(a);
            }
            if (!(this instanceof SDK.Metadata.Query.RetrieveMetadataChangesRequest))
                return new SDK.Metadata.Query.RetrieveMetadataChangesRequest(n, t, i);
            var f = null
                , u = null
                , r = null
                , h = "SDK.Metadata.Query.RetrieveMetadataChangesRequest Query is null."
                , c = "SDK.Metadata.Query.RetrieveMetadataChangesRequest.Query requires a SDK.Metadata.Query.EntityQueryExpression."
                , l = "SDK.Metadata.Query.RetrieveMetadataChangesRequest ClientVersionStamp requires a string value."
                , a = "SDK.Metadata.Query.RetrieveMetadataChangesRequest DeletedMetadataFilters must be between 1 and 31.";
            e(n);
            o(t);
            s(i);
            this.getQuery = function () {
                return f
            }
                ;
            this.setQuery = function (n) {
                e(n)
            }
                ;
            this.getClientVersionStamp = function () {
                return u
            }
                ;
            this.setClientVersionStamp = function (n) {
                o(n)
            }
                ;
            this.getDeletedMetadataFilters = function () {
                return r
            }
                ;
            this.setDeletedMetadataFilters = function (n) {
                s(n)
            }
                ;
            this._toXml = function () {
                var t, i, n, e;
                if (f == null)
                    throw new Error(h);
                return t = "",
                    u != null && (t = ["<a:KeyValuePairOfstringanyType>", "<b:key>ClientVersionStamp<\/b:key>", '<b:value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">' + u + "<\/b:value>", "<\/a:KeyValuePairOfstringanyType>"].join("")),
                    i = "Entity",
                    r != null && (n = [],
                        (1 & r) == 1 && n.push("Entity"),
                        (2 & r) == 2 && n.push("Attribute"),
                        (4 & r) == 4 && n.push("Relationship"),
                        (8 & r) == 8 && n.push("Label"),
                        (16 & r) == 16 && n.push("OptionSet"),
                        i = n.join(" ")),
                    e = "",
                    u != null && r != null && (e = ["<a:KeyValuePairOfstringanyType>", "<b:key>DeletedMetadataFilters<\/b:key>", '<b:value i:type="c:DeletedMetadataFilters"', ' xmlns:c="http://schemas.microsoft.com/xrm/2011/Metadata/Query">' + i + "<\/b:value>", "<\/a:KeyValuePairOfstringanyType>"].join("")),
                    ['<request i:type="a:RetrieveMetadataChangesRequest" xmlns:a="http://schemas.microsoft.com/xrm/2011/Contracts">', '<a:Parameters xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic">', "<a:KeyValuePairOfstringanyType>", "<b:key>Query<\/b:key>", f._toXml(), "<\/a:KeyValuePairOfstringanyType>", t, e, "<\/a:Parameters>", '<a:RequestId i:nil="true" />', "<a:RequestName>RetrieveMetadataChanges<\/a:RequestName>", "<\/request>"].join("")
            }
        }
            ;
        this.RetrieveMetadataChangesResponse = function (n, t, i) {
            if (!(this instanceof SDK.Metadata.Query.RetrieveMetadataChangesResponse))
                return new SDK.Metadata.Query.RetrieveMetadataChangesResponse(n, t, i);
            var f = null
                , r = null
                , u = null;
            typeof n != "undefined" && (f = n);
            typeof r != "undefined" && (r = t);
            typeof u != "undefined" && (u = i);
            this.EntityMetadata = f;
            this.ServerVersionStamp = r;
            this.DeletedMetadata = u
        }
            ;
        this.RetrieveMetadataChanges = function (n, t, i, r) {
            if (!(n instanceof SDK.Metadata.Query.RetrieveMetadataChangesRequest))
                throw new Error("SDK.Metadata.Query.RetrieveMetadataChanges RetrieveMetadataChangesRequest parameter must be an SDK.Metadata.Query.RetrieveMetadataChangesRequest.");
            if (typeof t != "function")
                throw new Error("SDK.Metadata.Query.RetrieveMetadataChanges successCallBack parameter must be a function.");
            if (typeof i != "function")
                throw new Error("SDK.Metadata.Query.RetrieveMetadataChanges errorCallBack parameter must be a function.");
            var f = ['<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body>', '<Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">', n._toXml(), "<\/Execute><\/s:Body><\/s:Envelope>"].join("")
                , u = new XMLHttpRequest;
            u.open("POST", e() + "/XRMServices/2011/Organization.svc/web", !0);
            try {
                u.responseType = "msxml-document"
            } catch (s) { }
            u.setRequestHeader("Accept", "application/xml, text/xml, */*");
            u.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            u.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            u.onreadystatechange = function () {
                o(u, t, i, r)
            }
                ;
            u.send(f)
        }
            ;
        var f = ["Attributes", "ManyToManyRelationships", "ManyToOneRelationships", "OneToManyRelationships", "Privileges", "LocalizedLabels", "Options", "Targets"]
    }
        .call(SDK.Metadata.Query);
SDK.Metadata.Query.LogicalOperator.prototype = {
    And: "And",
    Or: "Or"
};
SDK.Metadata.Query.LogicalOperator.And = "And";
SDK.Metadata.Query.LogicalOperator.Or = "Or";
SDK.Metadata.Query.LogicalOperator.__enum = !0;
SDK.Metadata.Query.LogicalOperator.__flags = !0;
SDK.Metadata.Query.DeletedMetadataFilters.prototype = {
    Default: 1,
    Entity: 1,
    Attribute: 2,
    Relationship: 4,
    Label: 8,
    OptionSet: 16,
    All: 31
};
SDK.Metadata.Query.DeletedMetadataFilters.Default = 1;
SDK.Metadata.Query.DeletedMetadataFilters.Entity = 1;
SDK.Metadata.Query.DeletedMetadataFilters.Attribute = 2;
SDK.Metadata.Query.DeletedMetadataFilters.Relationship = 4;
SDK.Metadata.Query.DeletedMetadataFilters.Label = 8;
SDK.Metadata.Query.DeletedMetadataFilters.OptionSet = 16;
SDK.Metadata.Query.DeletedMetadataFilters.All = 31;
SDK.Metadata.Query.DeletedMetadataFilters.__enum = !0;
SDK.Metadata.Query.DeletedMetadataFilters.__flags = !0;
SDK.Metadata.Query.MetadataConditionOperator.prototype = {
    Equals: "Equals",
    NotEquals: "NotEquals",
    In: "In",
    NotIn: "NotIn",
    GreaterThan: "GreaterThan",
    LessThan: "LessThan"
};
SDK.Metadata.Query.MetadataConditionOperator.Equals = "Equals";
SDK.Metadata.Query.MetadataConditionOperator.NotEquals = "NotEquals";
SDK.Metadata.Query.MetadataConditionOperator.In = "In";
SDK.Metadata.Query.MetadataConditionOperator.NotIn = "NotIn";
SDK.Metadata.Query.MetadataConditionOperator.GreaterThan = "GreaterThan";
SDK.Metadata.Query.MetadataConditionOperator.LessThan = "LessThan";
SDK.Metadata.Query.MetadataConditionOperator.__enum = !0;
SDK.Metadata.Query.MetadataConditionOperator.__flags = !0;
SDK.Metadata.Query.SearchableEntityMetadataProperties.prototype = {
    ActivityTypeMask: "ActivityTypeMask",
    AutoRouteToOwnerQueue: "AutoRouteToOwnerQueue",
    CanBeInManyToMany: "CanBeInManyToMany",
    CanBePrimaryEntityInRelationship: "CanBePrimaryEntityInRelationship",
    CanBeRelatedEntityInRelationship: "CanBeRelatedEntityInRelationship",
    CanCreateAttributes: "CanCreateAttributes",
    CanCreateCharts: "CanCreateCharts",
    CanCreateForms: "CanCreateForms",
    CanCreateViews: "CanCreateViews",
    CanModifyAdditionalSettings: "CanModifyAdditionalSettings",
    CanTriggerWorkflow: "CanTriggerWorkflow",
    IconLargeName: "IconLargeName",
    IconMediumName: "IconMediumName",
    IconSmallName: "IconSmallName",
    IsActivity: "IsActivity",
    IsActivityParty: "IsActivityParty",
    IsAuditEnabled: "IsAuditEnabled",
    IsAvailableOffline: "IsAvailableOffline",
    IsChildEntity: "IsChildEntity",
    IsConnectionsEnabled: "IsConnectionsEnabled",
    IsCustomEntity: "IsCustomEntity",
    IsCustomizable: "IsCustomizable",
    IsDocumentManagementEnabled: "IsDocumentManagementEnabled",
    IsDuplicateDetectionEnabled: "IsDuplicateDetectionEnabled",
    IsEnabledForCharts: "IsEnabledForCharts",
    IsImportable: "IsImportable",
    IsIntersect: "IsIntersect",
    IsMailMergeEnabled: "IsMailMergeEnabled",
    IsManaged: "IsManaged",
    IsMappable: "IsMappable",
    IsReadingPaneEnabled: "IsReadingPaneEnabled",
    IsRenameable: "IsRenameable",
    IsValidForAdvancedFind: "IsValidForAdvancedFind",
    IsValidForQueue: "IsValidForQueue",
    IsVisibleInMobile: "IsVisibleInMobile",
    LogicalName: "LogicalName",
    MetadataId: "MetadataId",
    ObjectTypeCode: "ObjectTypeCode",
    OwnershipType: "OwnershipType",
    PrimaryIdAttribute: "PrimaryIdAttribute",
    PrimaryNameAttribute: "PrimaryNameAttribute",
    RecurrenceBaseEntityLogicalName: "RecurrenceBaseEntityLogicalName",
    ReportViewName: "ReportViewName",
    SchemaName: "SchemaName"
};
SDK.Metadata.Query.SearchableEntityMetadataProperties.ActivityTypeMask = "ActivityTypeMask";
SDK.Metadata.Query.SearchableEntityMetadataProperties.AutoRouteToOwnerQueue = "AutoRouteToOwnerQueue";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanBeInManyToMany = "CanBeInManyToMany";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanBePrimaryEntityInRelationship = "CanBePrimaryEntityInRelationship";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanBeRelatedEntityInRelationship = "CanBeRelatedEntityInRelationship";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanCreateAttributes = "CanCreateAttributes";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanCreateCharts = "CanCreateCharts";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanCreateForms = "CanCreateForms";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanCreateViews = "CanCreateViews";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanModifyAdditionalSettings = "CanModifyAdditionalSettings";
SDK.Metadata.Query.SearchableEntityMetadataProperties.CanTriggerWorkflow = "CanTriggerWorkflow";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IconLargeName = "IconLargeName";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IconMediumName = "IconMediumName";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IconSmallName = "IconSmallName";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsActivity = "IsActivity";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsActivityParty = "IsActivityParty";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsAuditEnabled = "IsAuditEnabled";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsAvailableOffline = "IsAvailableOffline";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsChildEntity = "IsChildEntity";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsConnectionsEnabled = "IsConnectionsEnabled";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsCustomEntity = "IsCustomEntity";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsCustomizable = "IsCustomizable";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsDocumentManagementEnabled = "IsDocumentManagementEnabled";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsDuplicateDetectionEnabled = "IsDuplicateDetectionEnabled";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsEnabledForCharts = "IsEnabledForCharts";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsImportable = "IsImportable";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsIntersect = "IsIntersect";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsMailMergeEnabled = "IsMailMergeEnabled";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsManaged = "IsManaged";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsMappable = "IsMappable";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsReadingPaneEnabled = "IsReadingPaneEnabled";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsRenameable = "IsRenameable";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsValidForAdvancedFind = "IsValidForAdvancedFind";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsValidForQueue = "IsValidForQueue";
SDK.Metadata.Query.SearchableEntityMetadataProperties.IsVisibleInMobile = "IsVisibleInMobile";
SDK.Metadata.Query.SearchableEntityMetadataProperties.LogicalName = "LogicalName";
SDK.Metadata.Query.SearchableEntityMetadataProperties.MetadataId = "MetadataId";
SDK.Metadata.Query.SearchableEntityMetadataProperties.ObjectTypeCode = "ObjectTypeCode";
SDK.Metadata.Query.SearchableEntityMetadataProperties.OwnershipType = "OwnershipType";
SDK.Metadata.Query.SearchableEntityMetadataProperties.PrimaryIdAttribute = "PrimaryIdAttribute";
SDK.Metadata.Query.SearchableEntityMetadataProperties.PrimaryNameAttribute = "PrimaryNameAttribute";
SDK.Metadata.Query.SearchableEntityMetadataProperties.RecurrenceBaseEntityLogicalName = "RecurrenceBaseEntityLogicalName";
SDK.Metadata.Query.SearchableEntityMetadataProperties.ReportViewName = "ReportViewName";
SDK.Metadata.Query.SearchableEntityMetadataProperties.SchemaName = "SchemaName";
SDK.Metadata.Query.SearchableEntityMetadataProperties.__enum = !0;
SDK.Metadata.Query.SearchableEntityMetadataProperties.__flags = !0;
SDK.Metadata.Query.SearchableAttributeMetadataProperties.prototype = {
    AttributeOf: "AttributeOf",
    AttributeType: "AttributeType",
    CalculationOf: "CalculationOf",
    CanBeSecuredForCreate: "CanBeSecuredForCreate",
    CanBeSecuredForRead: "CanBeSecuredForRead",
    CanBeSecuredForUpdate: "CanBeSecuredForUpdate",
    CanModifyAdditionalSettings: "CanModifyAdditionalSettings",
    ColumnNumber: "ColumnNumber",
    DefaultFormValue: "DefaultFormValue",
    DefaultValue: "DefaultValue",
    DeprecatedVersion: "DeprecatedVersion",
    EntityLogicalName: "EntityLogicalName",
    Format: "Format",
    ImeMode: "ImeMode",
    IsAuditEnabled: "IsAuditEnabled",
    IsCustomAttribute: "IsCustomAttribute",
    IsCustomizable: "IsCustomizable",
    IsManaged: "IsManaged",
    IsPrimaryId: "IsPrimaryId",
    IsPrimaryName: "IsPrimaryName",
    IsRenameable: "IsRenameable",
    IsSecured: "IsSecured",
    IsValidForAdvancedFind: "IsValidForAdvancedFind",
    IsValidForCreate: "IsValidForCreate",
    IsValidForRead: "IsValidForRead",
    IsValidForUpdate: "IsValidForUpdate",
    LinkedAttributeId: "LinkedAttributeId",
    LogicalName: "LogicalName",
    MaxLength: "MaxLength",
    MaxValue: "MaxValue",
    MetadataId: "MetadataId",
    MinValue: "MinValue",
    Precision: "Precision",
    PrecisionSource: "PrecisionSource",
    RequiredLevel: "RequiredLevel",
    SchemaName: "SchemaName",
    YomiOf: "YomiOf"
};
SDK.Metadata.Query.SearchableAttributeMetadataProperties.AttributeOf = "AttributeOf";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.AttributeType = "AttributeType";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.CalculationOf = "CalculationOf";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.CanBeSecuredForCreate = "CanBeSecuredForCreate";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.CanBeSecuredForRead = "CanBeSecuredForRead";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.CanBeSecuredForUpdate = "CanBeSecuredForUpdate";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.CanModifyAdditionalSettings = "CanModifyAdditionalSettings";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.ColumnNumber = "ColumnNumber";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.DefaultFormValue = "DefaultFormValue";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.DefaultValue = "DefaultValue";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.DeprecatedVersion = "DeprecatedVersion";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.EntityLogicalName = "EntityLogicalName";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.Format = "Format";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.ImeMode = "ImeMode";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsAuditEnabled = "IsAuditEnabled";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsCustomAttribute = "IsCustomAttribute";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsCustomizable = "IsCustomizable";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsManaged = "IsManaged";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsPrimaryId = "IsPrimaryId";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsPrimaryName = "IsPrimaryName";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsRenameable = "IsRenameable";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsSecured = "IsSecured";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsValidForAdvancedFind = "IsValidForAdvancedFind";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsValidForCreate = "IsValidForCreate";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsValidForRead = "IsValidForRead";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.IsValidForUpdate = "IsValidForUpdate";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.LinkedAttributeId = "LinkedAttributeId";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.LogicalName = "LogicalName";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.MaxLength = "MaxLength";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.MaxValue = "MaxValue";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.MetadataId = "MetadataId";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.MinValue = "MinValue";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.Precision = "Precision";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.PrecisionSource = "PrecisionSource";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.RequiredLevel = "RequiredLevel";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.SchemaName = "SchemaName";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.YomiOf = "YomiOf";
SDK.Metadata.Query.SearchableAttributeMetadataProperties.__enum = !0;
SDK.Metadata.Query.SearchableAttributeMetadataProperties.__flags = !0;
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.prototype = {
    Entity1IntersectAttribute: "Entity1IntersectAttribute",
    Entity1LogicalName: "Entity1LogicalName",
    Entity2IntersectAttribute: "Entity2IntersectAttribute",
    Entity2LogicalName: "Entity2LogicalName",
    IntersectEntityName: "IntersectEntityName",
    IsCustomizable: "IsCustomizable",
    IsCustomRelationship: "IsCustomRelationship",
    IsManaged: "IsManaged",
    IsValidForAdvancedFind: "IsValidForAdvancedFind",
    MetadataId: "MetadataId",
    ReferencedAttribute: "ReferencedAttribute",
    ReferencedEntity: "ReferencedEntity",
    ReferencingAttribute: "ReferencingAttribute",
    ReferencingEntity: "ReferencingEntity",
    RelationshipType: "RelationshipType",
    SchemaName: "SchemaName",
    SecurityTypes: "SecurityTypes"
};
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.Entity1IntersectAttribute = "Entity1IntersectAttribute";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.Entity1LogicalName = "Entity1LogicalName";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.Entity2IntersectAttribute = "Entity2IntersectAttribute";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.Entity2LogicalName = "Entity2LogicalName";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.IntersectEntityName = "IntersectEntityName";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.IsCustomizable = "IsCustomizable";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.IsCustomRelationship = "IsCustomRelationship";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.IsManaged = "IsManaged";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.IsValidForAdvancedFind = "IsValidForAdvancedFind";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.MetadataId = "MetadataId";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.ReferencedAttribute = "ReferencedAttribute";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.ReferencedEntity = "ReferencedEntity";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.ReferencingAttribute = "ReferencingAttribute";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.ReferencingEntity = "ReferencingEntity";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.RelationshipType = "RelationshipType";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.SchemaName = "SchemaName";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.SecurityTypes = "SecurityTypes";
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.__enum = !0;
SDK.Metadata.Query.SearchableRelationshipMetadataProperties.__flags = !0;
SDK.Metadata.Query.EntityMetadataProperties.prototype = {
    ActivityTypeMask: "ActivityTypeMask",
    Attributes: "Attributes",
    AutoRouteToOwnerQueue: "AutoRouteToOwnerQueue",
    CanBeInManyToMany: "CanBeInManyToMany",
    CanBePrimaryEntityInRelationship: "CanBePrimaryEntityInRelationship",
    CanBeRelatedEntityInRelationship: "CanBeRelatedEntityInRelationship",
    CanCreateAttributes: "CanCreateAttributes",
    CanCreateCharts: "CanCreateCharts",
    CanCreateForms: "CanCreateForms",
    CanCreateViews: "CanCreateViews",
    CanModifyAdditionalSettings: "CanModifyAdditionalSettings",
    CanTriggerWorkflow: "CanTriggerWorkflow",
    Description: "Description",
    DisplayCollectionName: "DisplayCollectionName",
    DisplayName: "DisplayName",
    IconLargeName: "IconLargeName",
    IconMediumName: "IconMediumName",
    IconSmallName: "IconSmallName",
    IsActivity: "IsActivity",
    IsActivityParty: "IsActivityParty",
    IsAuditEnabled: "IsAuditEnabled",
    IsAvailableOffline: "IsAvailableOffline",
    IsChildEntity: "IsChildEntity",
    IsConnectionsEnabled: "IsConnectionsEnabled",
    IsCustomEntity: "IsCustomEntity",
    IsCustomizable: "IsCustomizable",
    IsDocumentManagementEnabled: "IsDocumentManagementEnabled",
    IsDuplicateDetectionEnabled: "IsDuplicateDetectionEnabled",
    IsEnabledForCharts: "IsEnabledForCharts",
    IsImportable: "IsImportable",
    IsIntersect: "IsIntersect",
    IsMailMergeEnabled: "IsMailMergeEnabled",
    IsManaged: "IsManaged",
    IsMappable: "IsMappable",
    IsReadingPaneEnabled: "IsReadingPaneEnabled",
    IsRenameable: "IsRenameable",
    IsValidForAdvancedFind: "IsValidForAdvancedFind",
    IsValidForQueue: "IsValidForQueue",
    IsVisibleInMobile: "IsVisibleInMobile",
    LogicalName: "LogicalName",
    ManyToManyRelationships: "ManyToManyRelationships",
    ManyToOneRelationships: "ManyToOneRelationships",
    MetadataId: "MetadataId",
    ObjectTypeCode: "ObjectTypeCode",
    OneToManyRelationships: "OneToManyRelationships",
    OwnershipType: "OwnershipType",
    PrimaryIdAttribute: "PrimaryIdAttribute",
    PrimaryNameAttribute: "PrimaryNameAttribute",
    Privileges: "Privileges",
    RecurrenceBaseEntityLogicalName: "RecurrenceBaseEntityLogicalName",
    ReportViewName: "ReportViewName",
    SchemaName: "SchemaName"
};
SDK.Metadata.Query.EntityMetadataProperties.ActivityTypeMask = "ActivityTypeMask";
SDK.Metadata.Query.EntityMetadataProperties.Attributes = "Attributes";
SDK.Metadata.Query.EntityMetadataProperties.AutoRouteToOwnerQueue = "AutoRouteToOwnerQueue";
SDK.Metadata.Query.EntityMetadataProperties.CanBeInManyToMany = "CanBeInManyToMany";
SDK.Metadata.Query.EntityMetadataProperties.CanBePrimaryEntityInRelationship = "CanBePrimaryEntityInRelationship";
SDK.Metadata.Query.EntityMetadataProperties.CanBeRelatedEntityInRelationship = "CanBeRelatedEntityInRelationship";
SDK.Metadata.Query.EntityMetadataProperties.CanCreateAttributes = "CanCreateAttributes";
SDK.Metadata.Query.EntityMetadataProperties.CanCreateCharts = "CanCreateCharts";
SDK.Metadata.Query.EntityMetadataProperties.CanCreateForms = "CanCreateForms";
SDK.Metadata.Query.EntityMetadataProperties.CanCreateViews = "CanCreateViews";
SDK.Metadata.Query.EntityMetadataProperties.CanModifyAdditionalSettings = "CanModifyAdditionalSettings";
SDK.Metadata.Query.EntityMetadataProperties.CanTriggerWorkflow = "CanTriggerWorkflow";
SDK.Metadata.Query.EntityMetadataProperties.Description = "Description";
SDK.Metadata.Query.EntityMetadataProperties.DisplayCollectionName = "DisplayCollectionName";
SDK.Metadata.Query.EntityMetadataProperties.DisplayName = "DisplayName";
SDK.Metadata.Query.EntityMetadataProperties.IconLargeName = "IconLargeName";
SDK.Metadata.Query.EntityMetadataProperties.IconMediumName = "IconMediumName";
SDK.Metadata.Query.EntityMetadataProperties.IconSmallName = "IconSmallName";
SDK.Metadata.Query.EntityMetadataProperties.IsActivity = "IsActivity";
SDK.Metadata.Query.EntityMetadataProperties.IsActivityParty = "IsActivityParty";
SDK.Metadata.Query.EntityMetadataProperties.IsAuditEnabled = "IsAuditEnabled";
SDK.Metadata.Query.EntityMetadataProperties.IsAvailableOffline = "IsAvailableOffline";
SDK.Metadata.Query.EntityMetadataProperties.IsChildEntity = "IsChildEntity";
SDK.Metadata.Query.EntityMetadataProperties.IsConnectionsEnabled = "IsConnectionsEnabled";
SDK.Metadata.Query.EntityMetadataProperties.IsCustomEntity = "IsCustomEntity";
SDK.Metadata.Query.EntityMetadataProperties.IsCustomizable = "IsCustomizable";
SDK.Metadata.Query.EntityMetadataProperties.IsDocumentManagementEnabled = "IsDocumentManagementEnabled";
SDK.Metadata.Query.EntityMetadataProperties.IsDuplicateDetectionEnabled = "IsDuplicateDetectionEnabled";
SDK.Metadata.Query.EntityMetadataProperties.IsEnabledForCharts = "IsEnabledForCharts";
SDK.Metadata.Query.EntityMetadataProperties.IsImportable = "IsImportable";
SDK.Metadata.Query.EntityMetadataProperties.IsIntersect = "IsIntersect";
SDK.Metadata.Query.EntityMetadataProperties.IsMailMergeEnabled = "IsMailMergeEnabled";
SDK.Metadata.Query.EntityMetadataProperties.IsManaged = "IsManaged";
SDK.Metadata.Query.EntityMetadataProperties.IsMappable = "IsMappable";
SDK.Metadata.Query.EntityMetadataProperties.IsReadingPaneEnabled = "IsReadingPaneEnabled";
SDK.Metadata.Query.EntityMetadataProperties.IsRenameable = "IsRenameable";
SDK.Metadata.Query.EntityMetadataProperties.IsValidForAdvancedFind = "IsValidForAdvancedFind";
SDK.Metadata.Query.EntityMetadataProperties.IsValidForQueue = "IsValidForQueue";
SDK.Metadata.Query.EntityMetadataProperties.IsVisibleInMobile = "IsVisibleInMobile";
SDK.Metadata.Query.EntityMetadataProperties.LogicalName = "LogicalName";
SDK.Metadata.Query.EntityMetadataProperties.ManyToManyRelationships = "ManyToManyRelationships";
SDK.Metadata.Query.EntityMetadataProperties.ManyToOneRelationships = "ManyToOneRelationships";
SDK.Metadata.Query.EntityMetadataProperties.MetadataId = "MetadataId";
SDK.Metadata.Query.EntityMetadataProperties.ObjectTypeCode = "ObjectTypeCode";
SDK.Metadata.Query.EntityMetadataProperties.OneToManyRelationships = "OneToManyRelationships";
SDK.Metadata.Query.EntityMetadataProperties.OwnershipType = "OwnershipType";
SDK.Metadata.Query.EntityMetadataProperties.PrimaryIdAttribute = "PrimaryIdAttribute";
SDK.Metadata.Query.EntityMetadataProperties.PrimaryNameAttribute = "PrimaryNameAttribute";
SDK.Metadata.Query.EntityMetadataProperties.Privileges = "Privileges";
SDK.Metadata.Query.EntityMetadataProperties.RecurrenceBaseEntityLogicalName = "RecurrenceBaseEntityLogicalName";
SDK.Metadata.Query.EntityMetadataProperties.ReportViewName = "ReportViewName";
SDK.Metadata.Query.EntityMetadataProperties.SchemaName = "SchemaName";
SDK.Metadata.Query.EntityMetadataProperties.__enum = !0;
SDK.Metadata.Query.EntityMetadataProperties.__flags = !0;
SDK.Metadata.Query.AttributeMetadataProperties.prototype = {
    AttributeOf: "AttributeOf",
    AttributeType: "AttributeType",
    CalculationOf: "CalculationOf",
    CanBeSecuredForCreate: "CanBeSecuredForCreate",
    CanBeSecuredForRead: "CanBeSecuredForRead",
    CanBeSecuredForUpdate: "CanBeSecuredForUpdate",
    CanModifyAdditionalSettings: "CanModifyAdditionalSettings",
    ColumnNumber: "ColumnNumber",
    DefaultFormValue: "DefaultFormValue",
    DefaultValue: "DefaultValue",
    DeprecatedVersion: "DeprecatedVersion",
    Description: "Description",
    DisplayName: "DisplayName",
    EntityLogicalName: "EntityLogicalName",
    Format: "Format",
    ImeMode: "ImeMode",
    IsAuditEnabled: "IsAuditEnabled",
    IsCustomAttribute: "IsCustomAttribute",
    IsCustomizable: "IsCustomizable",
    IsManaged: "IsManaged",
    IsPrimaryId: "IsPrimaryId",
    IsPrimaryName: "IsPrimaryName",
    IsRenameable: "IsRenameable",
    IsSecured: "IsSecured",
    IsValidForAdvancedFind: "IsValidForAdvancedFind",
    IsValidForCreate: "IsValidForCreate",
    IsValidForRead: "IsValidForRead",
    IsValidForUpdate: "IsValidForUpdate",
    LinkedAttributeId: "LinkedAttributeId",
    LogicalName: "LogicalName",
    MaxLength: "MaxLength",
    MaxValue: "MaxValue",
    MetadataId: "MetadataId",
    MinValue: "MinValue",
    OptionSet: "OptionSet",
    Precision: "Precision",
    PrecisionSource: "PrecisionSource",
    RequiredLevel: "RequiredLevel",
    SchemaName: "SchemaName",
    Targets: "Targets",
    YomiOf: "YomiOf"
};
SDK.Metadata.Query.AttributeMetadataProperties.AttributeOf = "AttributeOf";
SDK.Metadata.Query.AttributeMetadataProperties.AttributeType = "AttributeType";
SDK.Metadata.Query.AttributeMetadataProperties.CalculationOf = "CalculationOf";
SDK.Metadata.Query.AttributeMetadataProperties.CanBeSecuredForCreate = "CanBeSecuredForCreate";
SDK.Metadata.Query.AttributeMetadataProperties.CanBeSecuredForRead = "CanBeSecuredForRead";
SDK.Metadata.Query.AttributeMetadataProperties.CanBeSecuredForUpdate = "CanBeSecuredForUpdate";
SDK.Metadata.Query.AttributeMetadataProperties.CanModifyAdditionalSettings = "CanModifyAdditionalSettings";
SDK.Metadata.Query.AttributeMetadataProperties.ColumnNumber = "ColumnNumber";
SDK.Metadata.Query.AttributeMetadataProperties.DefaultFormValue = "DefaultFormValue";
SDK.Metadata.Query.AttributeMetadataProperties.DefaultValue = "DefaultValue";
SDK.Metadata.Query.AttributeMetadataProperties.DeprecatedVersion = "DeprecatedVersion";
SDK.Metadata.Query.AttributeMetadataProperties.Description = "Description";
SDK.Metadata.Query.AttributeMetadataProperties.DisplayName = "DisplayName";
SDK.Metadata.Query.AttributeMetadataProperties.EntityLogicalName = "EntityLogicalName";
SDK.Metadata.Query.AttributeMetadataProperties.Format = "Format";
SDK.Metadata.Query.AttributeMetadataProperties.ImeMode = "ImeMode";
SDK.Metadata.Query.AttributeMetadataProperties.IsAuditEnabled = "IsAuditEnabled";
SDK.Metadata.Query.AttributeMetadataProperties.IsCustomAttribute = "IsCustomAttribute";
SDK.Metadata.Query.AttributeMetadataProperties.IsCustomizable = "IsCustomizable";
SDK.Metadata.Query.AttributeMetadataProperties.IsManaged = "IsManaged";
SDK.Metadata.Query.AttributeMetadataProperties.IsPrimaryId = "IsPrimaryId";
SDK.Metadata.Query.AttributeMetadataProperties.IsPrimaryName = "IsPrimaryName";
SDK.Metadata.Query.AttributeMetadataProperties.IsRenameable = "IsRenameable";
SDK.Metadata.Query.AttributeMetadataProperties.IsSecured = "IsSecured";
SDK.Metadata.Query.AttributeMetadataProperties.IsValidForAdvancedFind = "IsValidForAdvancedFind";
SDK.Metadata.Query.AttributeMetadataProperties.IsValidForCreate = "IsValidForCreate";
SDK.Metadata.Query.AttributeMetadataProperties.IsValidForRead = "IsValidForRead";
SDK.Metadata.Query.AttributeMetadataProperties.IsValidForUpdate = "IsValidForUpdate";
SDK.Metadata.Query.AttributeMetadataProperties.LinkedAttributeId = "LinkedAttributeId";
SDK.Metadata.Query.AttributeMetadataProperties.LogicalName = "LogicalName";
SDK.Metadata.Query.AttributeMetadataProperties.MaxLength = "MaxLength";
SDK.Metadata.Query.AttributeMetadataProperties.MaxValue = "MaxValue";
SDK.Metadata.Query.AttributeMetadataProperties.MetadataId = "MetadataId";
SDK.Metadata.Query.AttributeMetadataProperties.MinValue = "MinValue";
SDK.Metadata.Query.AttributeMetadataProperties.OptionSet = "OptionSet";
SDK.Metadata.Query.AttributeMetadataProperties.Precision = "Precision";
SDK.Metadata.Query.AttributeMetadataProperties.PrecisionSource = "PrecisionSource";
SDK.Metadata.Query.AttributeMetadataProperties.RequiredLevel = "RequiredLevel";
SDK.Metadata.Query.AttributeMetadataProperties.SchemaName = "SchemaName";
SDK.Metadata.Query.AttributeMetadataProperties.Targets = "Targets";
SDK.Metadata.Query.AttributeMetadataProperties.YomiOf = "YomiOf";
SDK.Metadata.Query.AttributeMetadataProperties.__enum = !0;
SDK.Metadata.Query.AttributeMetadataProperties.__flags = !0;
SDK.Metadata.Query.RelationshipMetadataProperties.prototype = {
    AssociatedMenuConfiguration: "AssociatedMenuConfiguration",
    CascadeConfiguration: "CascadeConfiguration",
    Entity1AssociatedMenuConfiguration: "Entity1AssociatedMenuConfiguration",
    Entity1IntersectAttribute: "Entity1IntersectAttribute",
    Entity1LogicalName: "Entity1LogicalName",
    Entity2AssociatedMenuConfiguration: "Entity2AssociatedMenuConfiguration",
    Entity2IntersectAttribute: "Entity2IntersectAttribute",
    Entity2LogicalName: "Entity2LogicalName",
    IntersectEntityName: "IntersectEntityName",
    IsCustomizable: "IsCustomizable",
    IsCustomRelationship: "IsCustomRelationship",
    IsManaged: "IsManaged",
    IsValidForAdvancedFind: "IsValidForAdvancedFind",
    MetadataId: "MetadataId",
    ReferencedAttribute: "ReferencedAttribute",
    ReferencedEntity: "ReferencedEntity",
    ReferencingAttribute: "ReferencingAttribute",
    ReferencingEntity: "ReferencingEntity",
    RelationshipType: "RelationshipType",
    SchemaName: "SchemaName",
    SecurityTypes: "SecurityTypes"
};
SDK.Metadata.Query.RelationshipMetadataProperties.AssociatedMenuConfiguration = "AssociatedMenuConfiguration";
SDK.Metadata.Query.RelationshipMetadataProperties.CascadeConfiguration = "CascadeConfiguration";
SDK.Metadata.Query.RelationshipMetadataProperties.Entity1AssociatedMenuConfiguration = "Entity1AssociatedMenuConfiguration";
SDK.Metadata.Query.RelationshipMetadataProperties.Entity1IntersectAttribute = "Entity1IntersectAttribute";
SDK.Metadata.Query.RelationshipMetadataProperties.Entity1LogicalName = "Entity1LogicalName";
SDK.Metadata.Query.RelationshipMetadataProperties.Entity2AssociatedMenuConfiguration = "Entity2AssociatedMenuConfiguration";
SDK.Metadata.Query.RelationshipMetadataProperties.Entity2IntersectAttribute = "Entity2IntersectAttribute";
SDK.Metadata.Query.RelationshipMetadataProperties.Entity2LogicalName = "Entity2LogicalName";
SDK.Metadata.Query.RelationshipMetadataProperties.IntersectEntityName = "IntersectEntityName";
SDK.Metadata.Query.RelationshipMetadataProperties.IsCustomizable = "IsCustomizable";
SDK.Metadata.Query.RelationshipMetadataProperties.IsCustomRelationship = "IsCustomRelationship";
SDK.Metadata.Query.RelationshipMetadataProperties.IsManaged = "IsManaged";
SDK.Metadata.Query.RelationshipMetadataProperties.IsValidForAdvancedFind = "IsValidForAdvancedFind";
SDK.Metadata.Query.RelationshipMetadataProperties.MetadataId = "MetadataId";
SDK.Metadata.Query.RelationshipMetadataProperties.ReferencedAttribute = "ReferencedAttribute";
SDK.Metadata.Query.RelationshipMetadataProperties.ReferencedEntity = "ReferencedEntity";
SDK.Metadata.Query.RelationshipMetadataProperties.ReferencingAttribute = "ReferencingAttribute";
SDK.Metadata.Query.RelationshipMetadataProperties.ReferencingEntity = "ReferencingEntity";
SDK.Metadata.Query.RelationshipMetadataProperties.RelationshipType = "RelationshipType";
SDK.Metadata.Query.RelationshipMetadataProperties.SchemaName = "SchemaName";
SDK.Metadata.Query.RelationshipMetadataProperties.SecurityTypes = "SecurityTypes";
SDK.Metadata.Query.RelationshipMetadataProperties.__enum = !0;
SDK.Metadata.Query.RelationshipMetadataProperties.__flags = !0,
    function () {
        this.OwnershipType = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.AttributeTypeCode = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.RelationshipType = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.AttributeRequiredLevel = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.DateTimeFormat = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.ImeMode = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.IntegerFormat = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.SecurityTypes = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
            ;
        this.StringFormat = function () {
            throw new Error("Constructor not implemented this is a static enum.");
        }
    }
        .call(SDK.Metadata.Query.ValueEnums);
SDK.Metadata.Query.ValueEnums.OwnershipType.prototype = {
    None: "None",
    OrganizationOwned: "OrganizationOwned",
    TeamOwned: "TeamOwned",
    UserOwned: "UserOwned"
};
SDK.Metadata.Query.ValueEnums.OwnershipType.None = "None";
SDK.Metadata.Query.ValueEnums.OwnershipType.OrganizationOwned = "OrganizationOwned";
SDK.Metadata.Query.ValueEnums.OwnershipType.TeamOwned = "TeamOwned";
SDK.Metadata.Query.ValueEnums.OwnershipType.UserOwned = "UserOwned";
SDK.Metadata.Query.ValueEnums.OwnershipType.__enum = !0;
SDK.Metadata.Query.ValueEnums.OwnershipType.__flags = !0;
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.prototype = {
    BigInt: "BigInt",
    Boolean: "Boolean",
    CalendarRules: "CalendarRules",
    Customer: "Customer",
    DateTime: "DateTime",
    Decimal: "Decimal",
    Double: "Double",
    EntityName: "EntityName",
    Integer: "Integer",
    Lookup: "Lookup",
    ManagedProperty: "ManagedProperty",
    Memo: "Memo",
    Money: "Money",
    Owner: "Owner",
    PartyList: "PartyList",
    Picklist: "Picklist",
    State: "State",
    Status: "Status",
    String: "String",
    Uniqueidentifier: "Uniqueidentifier",
    Virtual: "Virtual"
};
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.BigInt = "BigInt";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Boolean = "Boolean";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.CalendarRules = "CalendarRules";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Customer = "Customer";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.DateTime = "DateTime";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Decimal = "Decimal";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Double = "Double";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.EntityName = "EntityName";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Integer = "Integer";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Lookup = "Lookup";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.ManagedProperty = "ManagedProperty";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Memo = "Memo";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Money = "Money";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Owner = "Owner";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.PartyList = "PartyList";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Picklist = "Picklist";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.State = "State";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Status = "Status";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.String = "String";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Uniqueidentifier = "Uniqueidentifier";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.Virtual = "Virtual";
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.__enum = !0;
SDK.Metadata.Query.ValueEnums.AttributeTypeCode.__flags = !0;
SDK.Metadata.Query.ValueEnums.RelationshipType.prototype = {
    Default: "Default",
    ManyToManyRelationship: "ManyToManyRelationship",
    OneToManyRelationship: "OneToManyRelationship"
};
SDK.Metadata.Query.ValueEnums.RelationshipType.Default = "Default";
SDK.Metadata.Query.ValueEnums.RelationshipType.ManyToManyRelationship = "ManyToManyRelationship";
SDK.Metadata.Query.ValueEnums.RelationshipType.OneToManyRelationship = "OneToManyRelationship";
SDK.Metadata.Query.ValueEnums.OwnershipType.__enum = !0;
SDK.Metadata.Query.ValueEnums.OwnershipType.__flags = !0;
SDK.Metadata.Query.ValueEnums.AttributeRequiredLevel.prototype = {
    ApplicationRequired: "ApplicationRequired",
    None: "None",
    Recommended: "Recommended",
    SystemRequired: "SystemRequired"
};
SDK.Metadata.Query.ValueEnums.AttributeRequiredLevel.ApplicationRequired = "ApplicationRequired";
SDK.Metadata.Query.ValueEnums.AttributeRequiredLevel.None = "None";
SDK.Metadata.Query.ValueEnums.AttributeRequiredLevel.Recommended = "Recommended";
SDK.Metadata.Query.ValueEnums.AttributeRequiredLevel.SystemRequired = "SystemRequired";
SDK.Metadata.Query.ValueEnums.AttributeRequiredLevel.__enum = !0;
SDK.Metadata.Query.ValueEnums.AttributeRequiredLevel.__flags = !0;
SDK.Metadata.Query.ValueEnums.DateTimeFormat.prototype = {
    DateAndTime: "DateAndTime",
    DateOnly: "DateOnly"
};
SDK.Metadata.Query.ValueEnums.DateTimeFormat.DateAndTime = "DateAndTime";
SDK.Metadata.Query.ValueEnums.DateTimeFormat.DateOnly = "DateOnly";
SDK.Metadata.Query.ValueEnums.DateTimeFormat.__enum = !0;
SDK.Metadata.Query.ValueEnums.DateTimeFormat.__flags = !0;
SDK.Metadata.Query.ValueEnums.ImeMode.prototype = {
    Active: "Active",
    Auto: "Auto",
    Disabled: "Disabled",
    Inactive: "Inactive"
};
SDK.Metadata.Query.ValueEnums.ImeMode.Active = "Active";
SDK.Metadata.Query.ValueEnums.ImeMode.Auto = "Auto";
SDK.Metadata.Query.ValueEnums.ImeMode.Disabled = "Disabled";
SDK.Metadata.Query.ValueEnums.ImeMode.Inactive = "Inactive";
SDK.Metadata.Query.ValueEnums.ImeMode.__enum = !0;
SDK.Metadata.Query.ValueEnums.ImeMode.__flags = !0;
SDK.Metadata.Query.ValueEnums.IntegerFormat.prototype = {
    Duration: "Duration",
    Language: "Language",
    Locale: "Locale",
    None: "None",
    TimeZone: "TimeZone"
};
SDK.Metadata.Query.ValueEnums.IntegerFormat.Duration = "Duration";
SDK.Metadata.Query.ValueEnums.IntegerFormat.Language = "Language";
SDK.Metadata.Query.ValueEnums.IntegerFormat.Locale = "Locale";
SDK.Metadata.Query.ValueEnums.IntegerFormat.None = "None";
SDK.Metadata.Query.ValueEnums.IntegerFormat.TimeZone = "TimeZone";
SDK.Metadata.Query.ValueEnums.IntegerFormat.__enum = !0;
SDK.Metadata.Query.ValueEnums.IntegerFormat.__flags = !0;
SDK.Metadata.Query.ValueEnums.SecurityTypes.prototype = {
    Append: "Append",
    Inheritance: "Inheritance",
    None: "None",
    ParentChild: "ParentChild",
    Pointer: "Pointer"
};
SDK.Metadata.Query.ValueEnums.SecurityTypes.Append = "Append";
SDK.Metadata.Query.ValueEnums.SecurityTypes.Inheritance = "Inheritance";
SDK.Metadata.Query.ValueEnums.SecurityTypes.None = "None";
SDK.Metadata.Query.ValueEnums.SecurityTypes.ParentChild = "ParentChild";
SDK.Metadata.Query.ValueEnums.SecurityTypes.Pointer = "Pointer";
SDK.Metadata.Query.ValueEnums.SecurityTypes.__enum = !0;
SDK.Metadata.Query.ValueEnums.SecurityTypes.__flags = !0;
SDK.Metadata.Query.ValueEnums.StringFormat.prototype = {
    Email: "Email",
    PhoneticGuide: "PhoneticGuide",
    Text: "Text",
    TextArea: "TextArea",
    TickerSymbol: "TickerSymbol",
    Url: "Url",
    VersionNumber: "VersionNumber"
};
SDK.Metadata.Query.ValueEnums.StringFormat.Email = "Email";
SDK.Metadata.Query.ValueEnums.StringFormat.PhoneticGuide = "PhoneticGuide";
SDK.Metadata.Query.ValueEnums.StringFormat.Text = "Text";
SDK.Metadata.Query.ValueEnums.StringFormat.TextArea = "TextArea";
SDK.Metadata.Query.ValueEnums.StringFormat.TickerSymbol = "TickerSymbol";
SDK.Metadata.Query.ValueEnums.StringFormat.Url = "Url";
SDK.Metadata.Query.ValueEnums.StringFormat.VersionNumber = "VersionNumber";
SDK.Metadata.Query.ValueEnums.StringFormat.__enum = !0;
SDK.Metadata.Query.ValueEnums.StringFormat.__flags = !0;