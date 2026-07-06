"use client";
import { r as __toESM } from "./rolldown-runtime-B-1-B7_t.js";
import { t as require_react } from "./react.js";
//#region node_modules/goober/dist/goober.modern.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1), e = { data: "" }, t = (t) => {
	if ("object" == typeof window) {
		let e = (t ? t.querySelector("#_goober") : window._goober) || Object.assign(document.createElement("style"), {
			innerHTML: " ",
			id: "_goober"
		});
		return e.nonce = window.__nonce__, e.parentNode || (t || document.head).appendChild(e), e.firstChild;
	}
	return t || e;
}, a = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g, l = /\/\*[^]*?\*\/|  +/g, n$1 = /\n+/g, o = (e, t) => {
	let r = "", a = "", l = "";
	for (let n in e) {
		let c = e[n];
		"@" == n[0] ? "i" == n[1] ? r = n + " " + c + ";" : a += "f" == n[1] ? o(c, n) : n + "{" + o(c, "k" == n[1] ? "" : t) + "}" : "object" == typeof c ? a += o(c, t ? t.replace(/([^,])+/g, (e) => n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (t) => /&/.test(t) ? t.replace(/&/g, e) : e ? e + " " + t : t)) : n) : null != c && (n = "-" == n[1] ? n : n.replace(/[A-Z]/g, "-$&").toLowerCase(), l += o.p ? o.p(n, c) : n + ":" + c + ";");
	}
	return r + (t && l ? t + "{" + l + "}" : l) + a;
}, c = {}, i = (e) => {
	if ("object" == typeof e) {
		let t = "";
		for (let r in e) t += r + i(e[r]);
		return t;
	}
	return e;
}, s = (e, t, r, s, p) => {
	let u = i(e), d = c[u] || (c[u] = ((e) => {
		let t = 0, r = 11;
		for (; t < e.length;) r = 101 * r + e.charCodeAt(t++) >>> 0;
		return "go" + r;
	})(u));
	if (!c[d]) {
		let t = u !== e ? e : ((e) => {
			let t, r, o = [{}];
			for (; t = a.exec(e.replace(l, ""));) t[4] ? o.shift() : t[3] ? (r = t[3].replace(n$1, " ").trim(), o.unshift(o[0][r] = o[0][r] || {})) : o[0][t[1]] = t[2].replace(n$1, " ").trim();
			return o[0];
		})(e);
		c[d] = o(p ? { ["@keyframes " + d]: t } : t, r ? "" : "." + d);
	}
	let f = r && c.g;
	return r && (c.g = c[d]), ((e, t, r, a) => {
		a ? t.data = t.data.replace(a, e) : -1 === t.data.indexOf(e) && (t.data = r ? e + t.data : t.data + e);
	})(c[d], t, s, f), d;
}, p = (e, t, r) => e.reduce((e, a, l) => {
	let n = t[l];
	if (n && n.call) {
		let e = n(r), t = e && e.props && e.props.className || /^go/.test(e) && e;
		n = t ? "." + t : e && "object" == typeof e ? e.props ? "" : o(e, "") : !1 === e ? "" : e;
	}
	return e + a + (null == n ? "" : n);
}, "");
function u(e) {
	let r = this || {}, a = e.call ? e(r.p) : e;
	return s(a.unshift ? a.raw ? p(a, [].slice.call(arguments, 1), r.p) : a.reduce((e, t) => Object.assign(e, t && t.call ? t(r.p) : t), {}) : a, t(r.target), r.g, r.o, r.k);
}
var d, f$1, g;
u.bind({ g: 1 });
var h$1 = u.bind({ k: 1 });
function m(e, t, r, a) {
	o.p = t, d = e, f$1 = r, g = a;
}
function w$1(e, t) {
	let r = this || {};
	return function() {
		let a = arguments;
		function l(n, o) {
			let c = Object.assign({}, n), i = c.className || l.className;
			r.p = Object.assign({ theme: f$1 && f$1() }, c), r.o = /go\d/.test(i), c.className = u.apply(r, a) + (i ? " " + i : ""), t && (c.ref = o);
			let s = e;
			return e[0] && (s = c.as || e, delete c.as), g && s[0] && g(c), d(s, c);
		}
		return t ? t(l) : l;
	};
}
//#endregion
//#region node_modules/react-hot-toast/dist/index.mjs
var Z = (e) => typeof e == "function", h = (e, t) => Z(e) ? e(t) : e;
var W = (() => {
	let e = 0;
	return () => (++e).toString();
})(), E = (() => {
	let e;
	return () => {
		if (e === void 0 && typeof window < "u") {
			let t = matchMedia("(prefers-reduced-motion: reduce)");
			e = !t || t.matches;
		}
		return e;
	};
})();
var re = 20, k = "default";
var H = (e, t) => {
	let { toastLimit: o } = e.settings;
	switch (t.type) {
		case 0: return {
			...e,
			toasts: [t.toast, ...e.toasts].slice(0, o)
		};
		case 1: return {
			...e,
			toasts: e.toasts.map((r) => r.id === t.toast.id ? {
				...r,
				...t.toast
			} : r)
		};
		case 2:
			let { toast: s } = t;
			return H(e, {
				type: e.toasts.find((r) => r.id === s.id) ? 1 : 0,
				toast: s
			});
		case 3:
			let { toastId: a } = t;
			return {
				...e,
				toasts: e.toasts.map((r) => r.id === a || a === void 0 ? {
					...r,
					dismissed: !0,
					visible: !1
				} : r)
			};
		case 4: return t.toastId === void 0 ? {
			...e,
			toasts: []
		} : {
			...e,
			toasts: e.toasts.filter((r) => r.id !== t.toastId)
		};
		case 5: return {
			...e,
			pausedAt: t.time
		};
		case 6:
			let i = t.time - (e.pausedAt || 0);
			return {
				...e,
				pausedAt: void 0,
				toasts: e.toasts.map((r) => ({
					...r,
					pauseDuration: r.pauseDuration + i
				}))
			};
	}
}, v = [], j = {
	toasts: [],
	pausedAt: void 0,
	settings: { toastLimit: re }
}, f = {}, Y = (e, t = k) => {
	f[t] = H(f[t] || j, e), v.forEach(([o, s]) => {
		o === t && s(f[t]);
	});
}, _ = (e) => Object.keys(f).forEach((t) => Y(e, t)), Q = (e) => Object.keys(f).find((t) => f[t].toasts.some((o) => o.id === e)), S = (e = k) => (t) => {
	Y(t, e);
}, se = {
	blank: 4e3,
	error: 4e3,
	success: 2e3,
	loading: Infinity,
	custom: 4e3
}, V = (e = {}, t = k) => {
	let [o, s] = (0, import_react.useState)(f[t] || j), a = (0, import_react.useRef)(f[t]);
	(0, import_react.useEffect)(() => (a.current !== f[t] && s(f[t]), v.push([t, s]), () => {
		let r = v.findIndex(([l]) => l === t);
		r > -1 && v.splice(r, 1);
	}), [t]);
	let i = o.toasts.map((r) => {
		var l, g, T;
		return {
			...e,
			...e[r.type],
			...r,
			removeDelay: r.removeDelay || ((l = e[r.type]) == null ? void 0 : l.removeDelay) || (e == null ? void 0 : e.removeDelay),
			duration: r.duration || ((g = e[r.type]) == null ? void 0 : g.duration) || (e == null ? void 0 : e.duration) || se[r.type],
			style: {
				...e.style,
				...(T = e[r.type]) == null ? void 0 : T.style,
				...r.style
			}
		};
	});
	return {
		...o,
		toasts: i
	};
};
var ie = (e, t = "blank", o) => ({
	createdAt: Date.now(),
	visible: !0,
	dismissed: !1,
	type: t,
	ariaProps: {
		role: "status",
		"aria-live": "polite"
	},
	message: e,
	pauseDuration: 0,
	...o,
	id: (o == null ? void 0 : o.id) || W()
}), P = (e) => (t, o) => {
	let s = ie(t, e, o);
	return S(s.toasterId || Q(s.id))({
		type: 2,
		toast: s
	}), s.id;
}, n = (e, t) => P("blank")(e, t);
n.error = P("error");
n.success = P("success");
n.loading = P("loading");
n.custom = P("custom");
n.dismiss = (e, t) => {
	let o = {
		type: 3,
		toastId: e
	};
	t ? S(t)(o) : _(o);
};
n.dismissAll = (e) => n.dismiss(void 0, e);
n.remove = (e, t) => {
	let o = {
		type: 4,
		toastId: e
	};
	t ? S(t)(o) : _(o);
};
n.removeAll = (e) => n.remove(void 0, e);
n.promise = (e, t, o) => {
	let s = n.loading(t.loading, {
		...o,
		...o == null ? void 0 : o.loading
	});
	return typeof e == "function" && (e = e()), e.then((a) => {
		let i = t.success ? h(t.success, a) : void 0;
		return i ? n.success(i, {
			id: s,
			...o,
			...o == null ? void 0 : o.success
		}) : n.dismiss(s), a;
	}).catch((a) => {
		let i = t.error ? h(t.error, a) : void 0;
		i ? n.error(i, {
			id: s,
			...o,
			...o == null ? void 0 : o.error
		}) : n.dismiss(s);
	}), e;
};
var ce = 1e3, w = (e, t = "default") => {
	let { toasts: o, pausedAt: s } = V(e, t), a = (0, import_react.useRef)(/* @__PURE__ */ new Map()).current, i = (0, import_react.useCallback)((c, m = ce) => {
		if (a.has(c)) return;
		let p = setTimeout(() => {
			a.delete(c), r({
				type: 4,
				toastId: c
			});
		}, m);
		a.set(c, p);
	}, []);
	(0, import_react.useEffect)(() => {
		if (s) return;
		let c = Date.now(), m = o.map((p) => {
			if (p.duration === Infinity) return;
			let R = (p.duration || 0) + p.pauseDuration - (c - p.createdAt);
			if (R < 0) {
				p.visible && n.dismiss(p.id);
				return;
			}
			return setTimeout(() => n.dismiss(p.id, t), R);
		});
		return () => {
			m.forEach((p) => p && clearTimeout(p));
		};
	}, [
		o,
		s,
		t
	]);
	let r = (0, import_react.useCallback)(S(t), [t]), l = (0, import_react.useCallback)(() => {
		r({
			type: 5,
			time: Date.now()
		});
	}, [r]), g = (0, import_react.useCallback)((c, m) => {
		r({
			type: 1,
			toast: {
				id: c,
				height: m
			}
		});
	}, [r]), T = (0, import_react.useCallback)(() => {
		s && r({
			type: 6,
			time: Date.now()
		});
	}, [s, r]), d = (0, import_react.useCallback)((c, m) => {
		let { reverseOrder: p = !1, gutter: R = 8, defaultPosition: z } = m || {}, O = o.filter((u) => (u.position || z) === (c.position || z) && u.height), K = O.findIndex((u) => u.id === c.id), B = O.filter((u, I) => I < K && u.visible).length;
		return O.filter((u) => u.visible).slice(...p ? [B + 1] : [0, B]).reduce((u, I) => u + (I.height || 0) + R, 0);
	}, [o]);
	return (0, import_react.useEffect)(() => {
		o.forEach((c) => {
			if (c.dismissed) i(c.id, c.removeDelay);
			else {
				let m = a.get(c.id);
				m && (clearTimeout(m), a.delete(c.id));
			}
		});
	}, [o, i]), {
		toasts: o,
		handlers: {
			updateHeight: g,
			startPause: l,
			endPause: T,
			calculateOffset: d
		}
	};
};
var de = h$1`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`, me = h$1`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`, le = h$1`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`, C = w$1("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e) => e.primary || "#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${de} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${me} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${(e) => e.secondary || "#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${le} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;
var Te = h$1`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`, F = w$1("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${(e) => e.secondary || "#e0e0e0"};
  border-right-color: ${(e) => e.primary || "#616161"};
  animation: ${Te} 1s linear infinite;
`;
var ge = h$1`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`, he = h$1`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`, L = w$1("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e) => e.primary || "#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ge} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${he} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${(e) => e.secondary || "#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`;
var be = w$1("div")`
  position: absolute;
`, Se = w$1("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`, Ae = h$1`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`, Pe = w$1("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ae} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`, $ = ({ toast: e }) => {
	let { icon: t, type: o, iconTheme: s } = e;
	return t !== void 0 ? typeof t == "string" ? import_react.createElement(Pe, null, t) : t : o === "blank" ? null : import_react.createElement(Se, null, import_react.createElement(F, { ...s }), o !== "loading" && import_react.createElement(be, null, o === "error" ? import_react.createElement(C, { ...s }) : import_react.createElement(L, { ...s })));
};
var Re = (e) => `
0% {transform: translate3d(0,${e * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`, Ee = (e) => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e * -150}%,-1px) scale(.6); opacity:0;}
`, ve = "0%{opacity:0;} 100%{opacity:1;}", De = "0%{opacity:1;} 100%{opacity:0;}", Oe = w$1("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`, Ie = w$1("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`, ke = (e, t) => {
	let s = e.includes("top") ? 1 : -1, [a, i] = E() ? [ve, De] : [Re(s), Ee(s)];
	return { animation: t ? `${h$1(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards` : `${h$1(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)` };
}, N = import_react.memo(({ toast: e, position: t, style: o, children: s }) => {
	let a = e.height ? ke(e.position || t || "top-center", e.visible) : { opacity: 0 }, i = import_react.createElement($, { toast: e }), r = import_react.createElement(Ie, { ...e.ariaProps }, h(e.message, e));
	return import_react.createElement(Oe, {
		className: e.className,
		style: {
			...a,
			...o,
			...e.style
		}
	}, typeof s == "function" ? s({
		icon: i,
		message: r
	}) : import_react.createElement(import_react.Fragment, null, i, r));
});
m(import_react.createElement);
var we = ({ id: e, className: t, style: o, onHeightUpdate: s, children: a }) => {
	let i = import_react.useCallback((r) => {
		if (r) {
			let l = () => {
				let g = r.getBoundingClientRect().height;
				s(e, g);
			};
			l(), new MutationObserver(l).observe(r, {
				subtree: !0,
				childList: !0,
				characterData: !0
			});
		}
	}, [e, s]);
	return import_react.createElement("div", {
		ref: i,
		className: t,
		style: o
	}, a);
}, Me = (e, t) => {
	let o = e.includes("top"), s = o ? { top: 0 } : { bottom: 0 }, a = e.includes("center") ? { justifyContent: "center" } : e.includes("right") ? { justifyContent: "flex-end" } : {};
	return {
		left: 0,
		right: 0,
		display: "flex",
		position: "absolute",
		transition: E() ? void 0 : "all 230ms cubic-bezier(.21,1.02,.73,1)",
		transform: `translateY(${t * (o ? 1 : -1)}px)`,
		...s,
		...a
	};
}, Ce = u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`, D = 16, Fe = ({ reverseOrder: e, position: t = "top-center", toastOptions: o, gutter: s, children: a, toasterId: i, containerStyle: r, containerClassName: l }) => {
	let { toasts: g, handlers: T } = w(o, i);
	return import_react.createElement("div", {
		"data-rht-toaster": i || "",
		style: {
			position: "fixed",
			zIndex: 9999,
			top: D,
			left: D,
			right: D,
			bottom: D,
			pointerEvents: "none",
			...r
		},
		className: l,
		onMouseEnter: T.startPause,
		onMouseLeave: T.endPause
	}, g.map((d) => {
		let c = d.position || t, p = Me(c, T.calculateOffset(d, {
			reverseOrder: e,
			gutter: s,
			defaultPosition: t
		}));
		return import_react.createElement(we, {
			id: d.id,
			key: d.id,
			onHeightUpdate: T.updateHeight,
			className: d.visible ? Ce : "",
			style: p
		}, d.type === "custom" ? h(d.message, d) : a ? a(d) : import_react.createElement(N, {
			toast: d,
			position: c
		}));
	}));
};
var zt = n;
//#endregion
export { L as CheckmarkIcon, C as ErrorIcon, F as LoaderIcon, N as ToastBar, $ as ToastIcon, Fe as Toaster, zt as default, h as resolveValue, n as toast, w as useToaster, V as useToasterStore };
