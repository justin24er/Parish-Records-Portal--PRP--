import { appendErrors, get, set } from "./react-hook-form.js";
import { _i as parseAsync, gi as parse, vi as $ZodError } from "./core-B-oL8TD4.js";
//#region node_modules/@hookform/resolvers/dist/resolvers.mjs
var r = (t, r, o) => {
	if (t && "reportValidity" in t) {
		const s = get(o, r);
		t.setCustomValidity(s && s.message || ""), t.reportValidity();
	}
}, o = (e, t) => {
	for (const o in t.fields) {
		const s = t.fields[o];
		s && s.ref && "reportValidity" in s.ref ? r(s.ref, o, e) : s && s.refs && s.refs.forEach((t) => r(t, o, e));
	}
}, s$1 = (r, s) => {
	s.shouldUseNativeValidation && o(r, s);
	const n = {};
	for (const o in r) {
		const c = get(s.fields, o), f = Object.assign(r[o] || {}, { ref: c && c.ref });
		if (i$1(s.names || Object.keys(r), o)) {
			const r = Object.assign({}, get(n, o));
			set(r, "root", f), set(n, o, r);
		} else set(n, o, f);
	}
	return n;
}, i$1 = (e, t) => {
	const r = n(t).replace(/[.*+?^${}()|\\]/g, "\\$&");
	return e.some((e) => n(e).match(`^${r}\\.\\d+`));
};
function n(e) {
	return e.replace(/[\[\]]/g, "");
}
//#endregion
//#region node_modules/@hookform/resolvers/zod/dist/zod.mjs
function t() {
	return t = Object.assign ? Object.assign.bind() : function(r) {
		for (var e = 1; e < arguments.length; e++) {
			var n = arguments[e];
			for (var o in n) ({}).hasOwnProperty.call(n, o) && (r[o] = n[o]);
		}
		return r;
	}, t.apply(null, arguments);
}
function s(r, e) {
	try {
		var n = r();
	} catch (r) {
		return e(r);
	}
	return n && n.then ? n.then(void 0, e) : n;
}
function i(r, e) {
	for (var o = {}; r.length;) {
		var t = r[0], s = t.code, i = t.message, a = t.path.join(".");
		if (!o[a]) if ("unionErrors" in t) {
			var u = t.unionErrors[0].errors[0];
			o[a] = {
				message: u.message,
				type: u.code
			};
		} else o[a] = {
			message: i,
			type: s
		};
		if ("unionErrors" in t && t.unionErrors.forEach(function(e) {
			return e.errors.forEach(function(e) {
				return r.push(e);
			});
		}), e) {
			var c = o[a].types, f = c && c[t.code];
			o[a] = appendErrors(a, e, o, s, f ? [].concat(f, t.message) : t.message);
		}
		r.shift();
	}
	return o;
}
function a(r, e) {
	for (var o = {}, s = function() {
		var s = r[0], i = s.code, a = s.message, u = s.path.join(".");
		if (!o[u]) if ("invalid_union" === s.code && s.errors.length > 0) {
			var c = s.errors[0][0];
			o[u] = {
				message: c.message,
				type: c.code
			};
		} else o[u] = {
			message: a,
			type: i
		};
		if ("invalid_union" === s.code && s.errors.forEach(function(e) {
			return e.forEach(function(e) {
				return r.push(t({}, e, { path: [].concat(s.path, e.path) }));
			});
		}), e) {
			var f = o[u].types, l = f && f[s.code];
			o[u] = appendErrors(u, e, o, i, l ? [].concat(l, s.message) : s.message);
		}
		r.shift();
	}; r.length;) s();
	return o;
}
function u(n, t, u) {
	if (void 0 === u && (u = {}), function(r) {
		return "_def" in r && "object" == typeof r._def && "typeName" in r._def;
	}(n)) return function(o$1, a, c) {
		try {
			return Promise.resolve(s(function() {
				return Promise.resolve(n["sync" === u.mode ? "parse" : "parseAsync"](o$1, t)).then(function(e) {
					return c.shouldUseNativeValidation && o({}, c), {
						errors: {},
						values: u.raw ? Object.assign({}, o$1) : e
					};
				});
			}, function(r) {
				if (function(r) {
					return Array.isArray(null == r ? void 0 : r.issues);
				}(r)) return {
					values: {},
					errors: s$1(i(r.errors, !c.shouldUseNativeValidation && "all" === c.criteriaMode), c)
				};
				throw r;
			}));
		} catch (r) {
			return Promise.reject(r);
		}
	};
	if (function(r) {
		return "_zod" in r && "object" == typeof r._zod;
	}(n)) return function(i, c, f) {
		try {
			return Promise.resolve(s(function() {
				return Promise.resolve(("sync" === u.mode ? parse : parseAsync)(n, i, t)).then(function(e) {
					return f.shouldUseNativeValidation && o({}, f), {
						errors: {},
						values: u.raw ? Object.assign({}, i) : e
					};
				});
			}, function(r) {
				if (function(r) {
					return r instanceof $ZodError;
				}(r)) return {
					values: {},
					errors: s$1(a(r.issues, !f.shouldUseNativeValidation && "all" === f.criteriaMode), f)
				};
				throw r;
			}));
		} catch (r) {
			return Promise.reject(r);
		}
	};
	throw new Error("Invalid input: not a Zod schema");
}
//#endregion
export { u as zodResolver };
