(() => {
var exports = {};
exports.id = 888;
exports.ids = [888,405];
exports.modules = {

/***/ 531:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Im": () => (/* binding */ ConfettiProvider)
});

// UNUSED EXPORTS: Confetti, useConfetti

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(689);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: external "canvas-confetti"
const external_canvas_confetti_namespaceObject = require("canvas-confetti");
var external_canvas_confetti_default = /*#__PURE__*/__webpack_require__.n(external_canvas_confetti_namespaceObject);
;// CONCATENATED MODULE: ./components/confetti.tsx

// @ts-nocheck


const ConfettiContext = /*#__PURE__*/ external_react_default().createContext(null);
const ConfettiProvider = ({ children =null  })=>{
    const canvasRef = (0,external_react_.useRef)();
    const confettiRef = (0,external_react_.useRef)();
    const dropConfetti = (0,external_react_.useMemo)(()=>{
        return ()=>{
            if (confettiRef.current && canvasRef.current) {
                var ref;
                canvasRef.current.style.visibility = 'visible';
                (ref = confettiRef.current({
                    particleCount: 400,
                    spread: 160,
                    origin: {
                        y: 0.3
                    }
                })) === null || ref === void 0 ? void 0 : ref.finally(()=>{
                    if (canvasRef.current) {
                        canvasRef.current.style.visibility = 'hidden';
                    }
                });
            }
        };
    }, []);
    (0,external_react_.useEffect)(()=>{
        if (canvasRef.current && !confettiRef.current) {
            canvasRef.current.style.visibility = 'hidden';
            confettiRef.current = external_canvas_confetti_default().create(canvasRef.current, {
                resize: true,
                useWorker: true
            });
        }
    }, []);
    const canvasStyle = {
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        zIndex: 1,
        top: 0,
        left: 0
    };
    return(/*#__PURE__*/ (0,jsx_runtime_.jsxs)(ConfettiContext.Provider, {
        value: {
            dropConfetti
        },
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("canvas", {
                ref: canvasRef,
                style: canvasStyle
            }),
            children
        ]
    }));
};
const Confetti = ()=>{
    const { dropConfetti  } = useConfetti();
    useEffect(()=>{
        dropConfetti();
    }, [
        dropConfetti
    ]);
    return(/*#__PURE__*/ _jsx(_Fragment, {
    }));
};
const useConfetti = ()=>{
    const context = useContext(ConfettiContext);
    return context;
};


/***/ }),

/***/ 656:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "App": () => (/* binding */ App),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(75);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(247);
/* harmony import */ var _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(364);
/* harmony import */ var _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(280);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(831);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(24);
/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_project_serum_anchor__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _solana_wallet_adapter_material_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(74);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(130);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _components_confetti__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(531);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_3__, _index__WEBPACK_IMPORTED_MODULE_1__, _solana_wallet_adapter_material_ui__WEBPACK_IMPORTED_MODULE_8__, _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_5__, _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_4__]);
([_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_3__, _index__WEBPACK_IMPORTED_MODULE_1__, _solana_wallet_adapter_material_ui__WEBPACK_IMPORTED_MODULE_8__, _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_5__, _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);














// Default styles that can be overridden by your app
__webpack_require__(121);
const theme = (0,_material_ui_core__WEBPACK_IMPORTED_MODULE_9__.createTheme)({
    palette: {
        type: 'dark'
    }
});
const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID ? new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_7__.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID) : undefined;
const fairLaunchId = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_7__.web3.PublicKey("3e4X7HFK7nVycvoKc3SgHMj5XtYndEQNAtwv6KtJEfSz");
const network1 = process.env.REACT_APP_SOLANA_NETWORK;
const rpcHost = "https://solana--devnet.datahub.figment.io/apikey/24c64e276fc5db6ff73da2f59bac40f2";
const connection = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_7__.web3.Connection(rpcHost);
const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE, 10);
const txTimeout = 30000; // milliseconds (confirm this works for your project)
const App = ()=>{
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_4__.WalletAdapterNetwork.Devnet;
    // You can also provide a custom RPC endpoint.
    const endpoint = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(()=>(0,_solana_web3_js__WEBPACK_IMPORTED_MODULE_6__.clusterApiUrl)(network)
    , [
        network
    ]);
    var tokenBonding = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_6__.PublicKey("3nN2iNpJcgurQxN2V6P7TQMiSCQw3ENPeqqwfZ2pxpTT");
    console.log(tokenBonding.toBase58());
    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(()=>[
            new _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_5__.PhantomWalletAdapter(),
            new _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_5__.SlopeWalletAdapter(),
            new _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_5__.LedgerWalletAdapter()
        ]
    , [
        network
    ]);
    const children = /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_solana_wallet_adapter_material_ui__WEBPACK_IMPORTED_MODULE_8__.WalletDialogProvider, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_confetti__WEBPACK_IMPORTED_MODULE_10__/* .ConfettiProvider */ .Im, {
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_index__WEBPACK_IMPORTED_MODULE_1__["default"], {
                candyMachineId: candyMachineId,
                fairLaunchId: fairLaunchId,
                connection: connection,
                startDate: startDateSeed,
                txTimeout: txTimeout
            })
        })
    });
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_3__.ConnectionProvider, {
                endpoint: endpoint,
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_3__.WalletProvider, {
                    wallets: wallets,
                    autoConnect: true,
                    children: children
                })
            }),
            ");   "
        ]
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

});

/***/ }),

/***/ 121:
/***/ (() => {



/***/ }),

/***/ 242:
/***/ ((module) => {

"use strict";
module.exports = require("@glasseaters/hydra-sdk");

/***/ }),

/***/ 130:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core");

/***/ }),

/***/ 610:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core/Button");

/***/ }),

/***/ 961:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core/Dialog");

/***/ }),

/***/ 856:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core/DialogContent");

/***/ }),

/***/ 400:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core/DialogTitle");

/***/ }),

/***/ 266:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core/Grid");

/***/ }),

/***/ 640:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core/Paper");

/***/ }),

/***/ 104:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core/Typography");

/***/ }),

/***/ 308:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/core/styles");

/***/ }),

/***/ 501:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/icons/Close");

/***/ }),

/***/ 61:
/***/ ((module) => {

"use strict";
module.exports = require("@material-ui/lab/Alert");

/***/ }),

/***/ 24:
/***/ ((module) => {

"use strict";
module.exports = require("@project-serum/anchor");

/***/ }),

/***/ 874:
/***/ ((module) => {

"use strict";
module.exports = require("@solana/spl-token");

/***/ }),

/***/ 831:
/***/ ((module) => {

"use strict";
module.exports = require("@solana/web3.js");

/***/ }),

/***/ 689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 449:
/***/ ((module) => {

"use strict";
module.exports = require("react-countdown");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 518:
/***/ ((module) => {

"use strict";
module.exports = require("styled-components");

/***/ }),

/***/ 364:
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-base");;

/***/ }),

/***/ 74:
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-material-ui");;

/***/ }),

/***/ 247:
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react");;

/***/ }),

/***/ 280:
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-wallets");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [75], () => (__webpack_exec__(656)));
module.exports = __webpack_exports__;

})();