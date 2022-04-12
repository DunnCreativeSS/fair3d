"use strict";
exports.id = 75;
exports.ids = [75];
exports.modules = {

/***/ 285:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vg": () => (/* binding */ awaitTransactionSignatureConfirmation),
/* harmony export */   "Qk": () => (/* binding */ getCandyMachineState),
/* harmony export */   "CI": () => (/* binding */ mintOneToken)
/* harmony export */ });
/* unused harmony exports CANDY_MACHINE_PROGRAM, shortenAddress */
/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(874);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(831);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(661);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(759);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_connection__WEBPACK_IMPORTED_MODULE_3__]);
_connection__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];
// @ts-nocheck





const CANDY_MACHINE_PROGRAM = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey('cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ');
const TOKEN_METADATA_PROGRAM_ID = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const awaitTransactionSignatureConfirmation = async (txid, timeout, connection, commitment = 'recent', queryStatus = false)=>{
    let done = false;
    let status = {
        slot: 0,
        confirmations: 0,
        err: null
    };
    let subId = 0;
    status = await new Promise(async (resolve, reject)=>{
        setTimeout(()=>{
            if (done) {
                return;
            }
            done = true;
            console.log('Rejecting for timeout...');
            reject({
                timeout: true
            });
        }, timeout);
        while(!done && queryStatus){
            // eslint-disable-next-line no-loop-func
            (async ()=>{
                try {
                    const signatureStatuses = await connection.getSignatureStatuses([
                        txid, 
                    ]);
                    status = signatureStatuses && signatureStatuses.value[0];
                    if (!done) {
                        if (!status) {
                            console.log('REST null result for', txid, status);
                        } else if (status.err) {
                            console.log('REST error for', txid, status);
                            done = true;
                            reject(status.err);
                        } else if (!status.confirmations) {
                            console.log('REST no confirmations for', txid, status);
                        } else {
                            console.log('REST confirmation for', txid, status);
                            done = true;
                            resolve(status);
                        }
                    }
                } catch (e) {
                    if (!done) {
                        console.log('REST connection error: txid', txid, e);
                    }
                }
            })();
            await sleep(2000);
        }
    });
    //@ts-ignore
    if (connection._signatureSubscriptions[subId]) {
        connection.removeSignatureListener(subId);
    }
    done = true;
    console.log('Returning status', status);
    return status;
};
/* export */ const createAssociatedTokenAccountInstruction = (associatedTokenAddress, payer, walletAddress, splTokenMintAddress)=>{
    const keys = [
        {
            pubkey: payer,
            isSigner: true,
            isWritable: true
        },
        {
            pubkey: associatedTokenAddress,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: walletAddress,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: splTokenMintAddress,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false
        }, 
    ];
    return new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.TransactionInstruction({
        keys,
        programId: _utils__WEBPACK_IMPORTED_MODULE_4__/* .SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID */ .Tb,
        data: Buffer.from([])
    });
};
const getCandyMachineState = async (anchorWallet, candyMachineId, connection)=>{
    const provider = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.Provider(connection, anchorWallet, {
        preflightCommitment: 'recent'
    });
    const idl = await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
    const program = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.Program(idl, CANDY_MACHINE_PROGRAM, provider);
    const state = await program.account.candyMachine.fetch(candyMachineId);
    const itemsAvailable = state.data.itemsAvailable.toNumber();
    const itemsRedeemed = state.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;
    return {
        id: candyMachineId,
        program,
        state: {
            itemsAvailable,
            itemsRedeemed,
            itemsRemaining,
            isSoldOut: itemsRemaining === 0,
            isActive: state.data.goLiveDate.toNumber() < new Date().getTime() / 1000,
            goLiveDate: state.data.goLiveDate,
            treasury: state.wallet,
            tokenMint: state.tokenMint,
            config: state.config,
            price: state.data.price
        }
    };
};
const getMasterEdition = async (mint)=>{
    return (await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey.findProgramAddress([
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'), 
    ], TOKEN_METADATA_PROGRAM_ID))[0];
};
const getMetadata = async (mint)=>{
    return (await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey.findProgramAddress([
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(), 
    ], TOKEN_METADATA_PROGRAM_ID))[0];
};
const mintOneToken = async (candyMachine, payer)=>{
    const mint = _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.Keypair.generate();
    const userTokenAccountAddress = (await (0,_utils__WEBPACK_IMPORTED_MODULE_4__/* .getAtaForMint */ .w2)(mint.publicKey, payer))[0];
    const userPayingAccountAddress = (await (0,_utils__WEBPACK_IMPORTED_MODULE_4__/* .getAtaForMint */ .w2)(candyMachine.state.tokenMint, payer))[0];
    const candyMachineAddress = candyMachine.id;
    const remainingAccounts = [];
    const signers = [
        mint
    ];
    const instructions = [
        _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mint.publicKey,
            space: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.MintLayout.span,
            lamports: await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.MintLayout.span),
            programId: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID
        }),
        _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.Token.createInitMintInstruction(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, mint.publicKey, 0, payer, payer),
        createAssociatedTokenAccountInstruction(userTokenAccountAddress, payer, payer, mint.publicKey),
        _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.Token.createMintToInstruction(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, mint.publicKey, userTokenAccountAddress, payer, [], 1), 
    ];
    let tokenAccount;
    if (candyMachine.state.tokenMint) {
        const transferAuthority = _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.Keypair.generate();
        signers.push(transferAuthority);
        remainingAccounts.push({
            pubkey: userPayingAccountAddress,
            isWritable: true,
            isSigner: false
        });
        remainingAccounts.push({
            pubkey: transferAuthority.publicKey,
            isWritable: false,
            isSigner: true
        });
        instructions.push(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.Token.createApproveInstruction(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, userPayingAccountAddress, transferAuthority.publicKey, payer, [], candyMachine.state.price.toNumber()));
    }
    const metadataAddress = await getMetadata(mint.publicKey);
    const masterEdition = await getMasterEdition(mint.publicKey);
    instructions.push(await candyMachine.program.instruction.mintNft({
        accounts: {
            config: candyMachine.state.config,
            candyMachine: candyMachineAddress,
            payer,
            wallet: candyMachine.state.treasury,
            mint: mint.publicKey,
            metadata: metadataAddress,
            masterEdition,
            mintAuthority: payer,
            updateAuthority: payer,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            tokenProgram: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID,
            systemProgram: _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.SystemProgram.programId,
            rent: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SYSVAR_RENT_PUBKEY,
            clock: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SYSVAR_CLOCK_PUBKEY
        },
        remainingAccounts: remainingAccounts.length > 0 ? remainingAccounts : undefined
    }));
    if (tokenAccount) {
        instructions.push(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.Token.createRevokeInstruction(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, userPayingAccountAddress, payer, []));
    }
    try {
        return (await (0,_connection__WEBPACK_IMPORTED_MODULE_3__/* .sendTransactionWithRetry */ .bX)(candyMachine.program.provider.connection, candyMachine.program.provider.wallet, instructions, signers)).txid;
    } catch (e) {
        console.log(e);
    }
    return 'j';
};
const shortenAddress = (address, chars = 4)=>{
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
const sleep = (ms)=>{
    return new Promise((resolve)=>setTimeout(resolve, ms)
    );
};

});

/***/ }),

/***/ 661:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bX": () => (/* binding */ sendTransactionWithRetry)
/* harmony export */ });
/* unused harmony exports getErrorForTransaction, SequenceType, sendTransactionsWithManualRetry, sendTransactions, sendTransaction, getUnixTs, sendSignedTransaction, sleep */
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(831);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(364);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_1__]);
_solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];


const getErrorForTransaction = async (connection, txid)=>{
    // wait for all confirmation before geting transaction
    await connection.confirmTransaction(txid, 'max');
    const tx = await connection.getParsedConfirmedTransaction(txid);
    const errors = [];
    if ((tx === null || tx === void 0 ? void 0 : tx.meta) && tx.meta.logMessages) {
        tx.meta.logMessages.forEach((log)=>{
            const regex = /Error: (.*)/gm;
            let m;
            while((m = regex.exec(log)) !== null){
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (m.length > 1) {
                    errors.push(m[1]);
                }
            }
        });
    }
    return errors;
};
var SequenceType1;

(function(SequenceType) {
    SequenceType[SequenceType["Sequential"] = 0] = "Sequential";
    SequenceType[SequenceType["Parallel"] = 1] = "Parallel";
    SequenceType[SequenceType["StopOnFailure"] = 2] = "StopOnFailure";
})(SequenceType1 || (SequenceType1 = {
}));
async function sendTransactionsWithManualRetry(connection, wallet, instructions, signers) {
    let stopPoint = 0;
    let tries = 0;
    let lastInstructionsLength = null;
    let toRemoveSigners = {
    };
    instructions = instructions.filter((instr, i)=>{
        if (instr.length > 0) {
            return true;
        } else {
            toRemoveSigners[i] = true;
            return false;
        }
    });
    let filteredSigners = signers.filter((_, i)=>!toRemoveSigners[i]
    );
    while(stopPoint < instructions.length && tries < 3){
        instructions = instructions.slice(stopPoint, instructions.length);
        filteredSigners = filteredSigners.slice(stopPoint, filteredSigners.length);
        if (instructions.length === lastInstructionsLength) tries = tries + 1;
        else tries = 0;
        try {
            if (instructions.length === 1) {
                await sendTransactionWithRetry(connection, wallet, instructions[0], filteredSigners[0], 'single');
                stopPoint = 1;
            } else {
                stopPoint = await sendTransactions(connection, wallet, instructions, filteredSigners, SequenceType1.StopOnFailure, 'single');
            }
        } catch (e) {
            console.error(e);
        }
        console.log('Died on ', stopPoint, 'retrying from instruction', instructions[stopPoint], 'instructions length is', instructions.length);
        lastInstructionsLength = instructions.length;
    }
}
const sendTransactions = async (connection, wallet, instructionSet, signersSet, sequenceType = SequenceType1.Parallel, commitment = 'singleGossip', successCallback = (txid, ind)=>{
}, failCallback = (txid, ind)=>false
, block)=>{
    if (!wallet.publicKey) throw new WalletNotConnectedError();
    const unsignedTxns = [];
    if (!block) {
        block = await connection.getRecentBlockhash(commitment);
    }
    for(let i = 0; i < instructionSet.length; i++){
        const instructions = instructionSet[i];
        const signers = signersSet[i];
        if (instructions.length === 0) {
            continue;
        }
        let transaction = new Transaction();
        instructions.forEach((instruction)=>transaction.add(instruction)
        );
        transaction.recentBlockhash = block.blockhash;
        transaction.setSigners(// fee payed by the wallet owner
        wallet.publicKey, ...signers.map((s)=>s.publicKey
        ));
        if (signers.length > 0) {
            transaction.partialSign(...signers);
        }
        unsignedTxns.push(transaction);
    }
    const signedTxns = await wallet.signAllTransactions(unsignedTxns);
    const pendingTxns = [];
    let breakEarlyObject = {
        breakEarly: false,
        i: 0
    };
    console.log('Signed txns length', signedTxns.length, 'vs handed in length', instructionSet.length);
    for(let i1 = 0; i1 < signedTxns.length; i1++){
        const signedTxnPromise = sendSignedTransaction({
            connection,
            signedTransaction: signedTxns[i1]
        });
        signedTxnPromise.then(({ txid , slot  })=>{
            successCallback(txid, i1);
        }).catch((reason)=>{
            // @ts-ignore
            failCallback(signedTxns[i1], i1);
            if (sequenceType === SequenceType1.StopOnFailure) {
                breakEarlyObject.breakEarly = true;
                breakEarlyObject.i = i1;
            }
        });
        if (sequenceType !== SequenceType1.Parallel) {
            try {
                await signedTxnPromise;
            } catch (e) {
                console.log('Caught failure', e);
                if (breakEarlyObject.breakEarly) {
                    console.log('Died on ', breakEarlyObject.i);
                    return breakEarlyObject.i; // Return the txn we failed on by index
                }
            }
        } else {
            pendingTxns.push(signedTxnPromise);
        }
    }
    if (sequenceType !== SequenceType1.Parallel) {
        await Promise.all(pendingTxns);
    }
    return signedTxns.length;
};
const sendTransaction = async (connection, wallet, instructions, signers, awaitConfirmation = true, commitment = 'singleGossip', includesFeePayer = false, block)=>{
    if (!wallet.publicKey) throw new WalletNotConnectedError();
    let transaction = new Transaction();
    instructions.forEach((instruction)=>transaction.add(instruction)
    );
    transaction.recentBlockhash = (block || await connection.getRecentBlockhash(commitment)).blockhash;
    if (includesFeePayer) {
        transaction.setSigners(...signers.map((s)=>s.publicKey
        ));
    } else {
        transaction.setSigners(// fee payed by the wallet owner
        wallet.publicKey, ...signers.map((s)=>s.publicKey
        ));
    }
    if (signers.length > 0) {
        transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
        transaction = await wallet.signTransaction(transaction);
    }
    const rawTransaction = transaction.serialize();
    let options = {
        skipPreflight: true,
        commitment
    };
    const txid = await connection.sendRawTransaction(rawTransaction, options);
    let slot = 0;
    if (awaitConfirmation) {
        const confirmation = await awaitTransactionSignatureConfirmation(txid, DEFAULT_TIMEOUT, connection, commitment);
        if (!confirmation) throw new Error('Timed out awaiting confirmation on transaction');
        slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
        if (confirmation === null || confirmation === void 0 ? void 0 : confirmation.err) {
            const errors = await getErrorForTransaction(connection, txid);
            console.log(errors);
            throw new Error(`Raw transaction ${txid} failed`);
        }
    }
    return {
        txid,
        slot
    };
};
const sendTransactionWithRetry = async (connection, wallet, instructions, signers, commitment = 'singleGossip', includesFeePayer = false, block, beforeSend)=>{
    if (!wallet.publicKey) throw new _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_1__.WalletNotConnectedError();
    let transaction = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.Transaction();
    instructions.forEach((instruction)=>transaction.add(instruction)
    );
    transaction.recentBlockhash = (block || await connection.getRecentBlockhash(commitment)).blockhash;
    if (includesFeePayer) {
        transaction.setSigners(...signers.map((s)=>s.publicKey
        ));
    } else {
        transaction.setSigners(// fee payed by the wallet owner
        wallet.publicKey, ...signers.map((s)=>s.publicKey
        ));
    }
    if (signers.length > 0) {
        transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
        transaction = await wallet.signTransaction(transaction);
    }
    if (beforeSend) {
        beforeSend();
    }
    const { txid , slot  } = await sendSignedTransaction({
        connection,
        signedTransaction: transaction
    });
    return {
        txid,
        slot
    };
};
const getUnixTs = ()=>{
    return new Date().getTime() / 1000;
};
const DEFAULT_TIMEOUT = 15000;
async function sendSignedTransaction({ signedTransaction , connection , timeout =DEFAULT_TIMEOUT  }) {
    const rawTransaction = signedTransaction.serialize();
    const startTime = getUnixTs();
    let slot = 0;
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true
    });
    console.log('Started awaiting confirmation for', txid);
    let done = false;
    (async ()=>{
        while(!done && getUnixTs() - startTime < timeout){
            connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true
            });
            await sleep(500);
        }
    })();
    try {
        const confirmation = await awaitTransactionSignatureConfirmation(txid, timeout, connection, 'recent', true);
        if (!confirmation) throw new Error('Timed out awaiting confirmation on transaction');
        if (confirmation.err) {
            console.error(confirmation.err);
            throw new Error('Transaction failed: Custom instruction error');
        }
        slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
    } catch (err) {
        console.error('Timeout Error caught', err);
        if (err.timeout) {
            throw new Error('Timed out awaiting confirmation on transaction');
        }
        let simulateResult = null;
        try {
            simulateResult = (await simulateTransaction(connection, signedTransaction, 'single')).value;
        } catch (e) {
        }
        if (simulateResult && simulateResult.err) {
            if (simulateResult.logs) {
                for(let i = simulateResult.logs.length - 1; i >= 0; --i){
                    const line = simulateResult.logs[i];
                    if (line.startsWith('Program log: ')) {
                        throw new Error('Transaction failed: ' + line.slice('Program log: '.length));
                    }
                }
            }
            throw new Error(JSON.stringify(simulateResult.err));
        }
    // throw new Error('Transaction failed');
    } finally{
        done = true;
    }
    console.log('Latency', txid, getUnixTs() - startTime);
    return {
        txid,
        slot
    };
}
async function simulateTransaction(connection, transaction, commitment) {
    // @ts-ignore
    transaction.recentBlockhash = await connection._recentBlockhash(// @ts-ignore
    connection._disableBlockhashCaching);
    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString('base64');
    const config = {
        encoding: 'base64',
        commitment
    };
    const args = [
        encodedTransaction,
        config
    ];
    // @ts-ignore
    const res = await connection._rpcRequest('simulateTransaction', args);
    if (res.error) {
        throw new Error('failed to simulate transaction: ' + res.error.message);
    }
    return res.result;
}
async function awaitTransactionSignatureConfirmation(txid, timeout, connection, commitment = 'recent', queryStatus = false) {
    let done = false;
    let status = {
        slot: 0,
        confirmations: 0,
        err: null
    };
    let subId = 0;
    status = await new Promise(async (resolve, reject)=>{
        setTimeout(()=>{
            if (done) {
                return;
            }
            done = true;
            console.log('Rejecting for timeout...');
            reject({
                timeout: true
            });
        }, timeout);
        try {
            subId = connection.onSignature(txid, (result, context)=>{
                done = true;
                status = {
                    err: result.err,
                    slot: context.slot,
                    confirmations: 0
                };
                if (result.err) {
                    console.log('Rejected via websocket', result.err);
                    reject(status);
                } else {
                    console.log('Resolved via websocket', result);
                    resolve(status);
                }
            }, commitment);
        } catch (e1) {
            done = true;
            console.error('WS error in setup', txid, e1);
        }
        while(!done && queryStatus){
            // eslint-disable-next-line no-loop-func
            (async ()=>{
                try {
                    const signatureStatuses = await connection.getSignatureStatuses([
                        txid, 
                    ]);
                    status = signatureStatuses && signatureStatuses.value[0];
                    if (!done) {
                        if (!status) {
                            console.log('REST null result for', txid, status);
                        } else if (status.err) {
                            console.log('REST error for', txid, status);
                            done = true;
                            reject(status.err);
                        } else if (!status.confirmations) {
                            console.log('REST no confirmations for', txid, status);
                        } else {
                            console.log('REST confirmation for', txid, status);
                            done = true;
                            resolve(status);
                        }
                    }
                } catch (e) {
                    if (!done) {
                        console.log('REST connection error: txid', txid, e);
                    }
                }
            })();
            await sleep(2000);
        }
    });
    //@ts-ignore
    if (connection._signatureSubscriptions[subId]) connection.removeSignatureListener(subId);
    done = true;
    console.log('Returning status', status);
    return status;
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms)
    );
}

});

/***/ }),

/***/ 233:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ PhaseCountdown)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(130);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_countdown__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(449);
/* harmony import */ var react_countdown__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_countdown__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(308);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);





const useStyles = (0,_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_3__.makeStyles)((theme)=>(0,_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_3__.createStyles)({
        root: {
            display: 'flex',
            padding: theme.spacing(0),
            '& > *': {
                margin: theme.spacing(0.5),
                marginRight: 0,
                width: theme.spacing(6),
                height: theme.spacing(6),
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#384457',
                color: 'white',
                borderRadius: 5,
                fontSize: 10
            }
        },
        done: {
            display: 'flex',
            margin: theme.spacing(1),
            marginRight: 0,
            padding: theme.spacing(1),
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#384457',
            color: 'white',
            borderRadius: 5,
            fontWeight: 'bold',
            fontSize: 18
        },
        item: {
            fontWeight: 'bold',
            fontSize: 18
        }
    })
);
const PhaseCountdown = ({ date , status , style , start , end , onComplete ,  })=>{
    const classes = useStyles();
    const { 0: isFixed , 1: setIsFixed  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(start && end && date ? start.getTime() - Date.now() < 0 : false);
    const renderCountdown = ({ days , hours , minutes , seconds , completed  })=>{
        hours += days * 24;
        if (completed) {
            return status ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                className: classes.done,
                children: status
            }) : null;
        } else {
            return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: classes.root,
                style: style,
                children: [
                    isFixed && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Paper, {
                        elevation: 0,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                            className: classes.item,
                            children: "+"
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Paper, {
                        elevation: 0,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: classes.item,
                                children: hours < 10 ? `0${hours}` : hours
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                children: "hrs"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Paper, {
                        elevation: 0,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: classes.item,
                                children: minutes < 10 ? `0${minutes}` : minutes
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                children: "mins"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Paper, {
                        elevation: 0,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: classes.item,
                                children: seconds < 10 ? `0${seconds}` : seconds
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                children: "secs"
                            })
                        ]
                    })
                ]
            }));
        }
    };
    if (date && start && end) {
        if (isFixed) {
            // @ts-ignore
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react_countdown__WEBPACK_IMPORTED_MODULE_2___default()), {
                date: start,
                now: ()=>end.getTime()
                ,
                onComplete: ()=>setIsFixed(false)
                ,
                renderer: renderCountdown
            });
        }
    }
    if (date) {
        return(// @ts-ignore
        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react_countdown__WEBPACK_IMPORTED_MODULE_2___default()), {
            date: date,
            onComplete: onComplete,
            renderer: renderCountdown
        }));
    } else {
        return null;
    }
};


/***/ }),

/***/ 598:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "kE": () => (/* binding */ getFairLaunchState),
/* harmony export */   "lL": () => (/* binding */ punchTicket),
/* harmony export */   "iS": () => (/* binding */ receiveRefund),
/* harmony export */   "XY": () => (/* binding */ purchaseTicket)
/* harmony export */ });
/* unused harmony exports FAIR_LAUNCH_PROGRAM, LotteryState, getLotteryState, getFairLaunchTicket, getFairLaunchLotteryBitmap, withdrawFunds */
/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(874);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(831);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(759);
// @ts-nocheck




const FAIR_LAUNCH_PROGRAM = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey('knGjLrbC9CBfMmfUzPkBM5ceXUNar2Ape13ZvkuXGzW');
var LotteryState1;

(function(LotteryState) {
    LotteryState["Brewing"] = 'Brewing';
    LotteryState["Finished"] = 'Finished';
    LotteryState["PastDue"] = 'Past Due';
})(LotteryState1 || (LotteryState1 = {
}));
const getLotteryState = (phaseThree, lottery, lotteryDuration, phaseTwoEnd)=>{
    if (!phaseThree && (!lottery || lottery.length === 0) && phaseTwoEnd.add(lotteryDuration).lt(new anchor.BN(Date.now() / 1000))) {
        return LotteryState1.PastDue;
    } else if (phaseThree) {
        return LotteryState1.Finished;
    } else {
        return LotteryState1.Brewing;
    }
};
const getFairLaunchState = async (anchorWallet, fairLaunchId, connection)=>{
    const provider = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.Provider(connection, anchorWallet, {
        preflightCommitment: 'recent'
    });
    const idl = await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.Program.fetchIdl(FAIR_LAUNCH_PROGRAM, provider);
    // @ts-ignore
    const program = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.Program(idl, FAIR_LAUNCH_PROGRAM, provider);
    const state = await program.account.fairLaunch.fetch(fairLaunchId);
    console.log(state);
    const [fairLaunchTicket, bump] = await getFairLaunchTicket(//@ts-ignore
    state.tokenMint, anchorWallet.publicKey);
    let fairLaunchData;
    try {
        fairLaunchData = await program.account.fairLaunchTicket.fetch(fairLaunchTicket);
    } catch  {
        console.log('No ticket');
    }
    const treasury = await program.provider.connection.getBalance(state.treasury);
    let lotteryData = new Uint8Array([]);
    let fairLaunchLotteryBitmap = (await getFairLaunchLotteryBitmap(//@ts-ignore
    state.tokenMint))[0];
    try {
        const fairLaunchLotteryBitmapObj = await program.provider.connection.getAccountInfo(fairLaunchLotteryBitmap);
        lotteryData = new Uint8Array((fairLaunchLotteryBitmapObj === null || fairLaunchLotteryBitmapObj === void 0 ? void 0 : fairLaunchLotteryBitmapObj.data) || []);
    } catch (e) {
        console.log('Could not find fair launch lottery.');
        console.log(e);
    }
    return {
        id: fairLaunchId,
        state,
        program,
        ticket: {
            pubkey: fairLaunchTicket,
            bump,
            data: fairLaunchData
        },
        lottery: {
            pubkey: fairLaunchLotteryBitmap,
            data: lotteryData
        },
        treasury
    };
};
const punchTicket = async (anchorWallet, fairLaunch)=>{
    const fairLaunchTicket = (await getFairLaunchTicket(//@ts-ignore
    fairLaunch.state.tokenMint, anchorWallet.publicKey))[0];
    const ticket = fairLaunch.ticket.data;
    const fairLaunchLotteryBitmap = (await getFairLaunchLotteryBitmap(fairLaunch.state.tokenMint))[0];
    const buyerTokenAccount = (await (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .getAtaForMint */ .w2)(//@ts-ignore
    fairLaunch.state.tokenMint, anchorWallet.publicKey))[0];
    if (ticket === null || ticket === void 0 ? void 0 : ticket.amount.gt(fairLaunch.state.currentMedian)) {
        console.log('Adjusting down...', ticket === null || ticket === void 0 ? void 0 : ticket.amount.toNumber(), fairLaunch.state.currentMedian.toNumber());
        const { remainingAccounts , instructions , signers  } = await getSetupForTicketing(fairLaunch.program, fairLaunch.state.currentMedian.toNumber(), anchorWallet, fairLaunch, fairLaunchTicket);
        await fairLaunch.program.rpc.adjustTicket(fairLaunch.state.currentMedian, {
            accounts: {
                fairLaunchTicket,
                fairLaunch: fairLaunch.id,
                fairLaunchLotteryBitmap,
                //@ts-ignore
                treasury: fairLaunch.state.treasury,
                systemProgram: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SystemProgram.programId,
                clock: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SYSVAR_CLOCK_PUBKEY
            },
            // @ts-ignore
            __private: {
                logAccounts: true
            },
            instructions: instructions.length > 0 ? instructions : undefined,
            remainingAccounts: [
                {
                    pubkey: anchorWallet.publicKey,
                    isSigner: true,
                    isWritable: true
                },
                ...remainingAccounts, 
            ],
            signers
        });
    }
    const accountExists = await fairLaunch.program.provider.connection.getAccountInfo(buyerTokenAccount);
    const instructions = !accountExists ? [
        (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .createAssociatedTokenAccountInstruction */ .Ek)(buyerTokenAccount, anchorWallet.publicKey, anchorWallet.publicKey, //@ts-ignore
        fairLaunch.state.tokenMint), 
    ] : [];
    await fairLaunch.program.rpc.punchTicket({
        accounts: {
            fairLaunchTicket,
            fairLaunch: fairLaunch.id,
            fairLaunchLotteryBitmap,
            payer: anchorWallet.publicKey,
            buyerTokenAccount,
            //@ts-ignore
            tokenMint: fairLaunch.state.tokenMint,
            tokenProgram: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID
        },
        instructions: instructions.length > 0 ? instructions : undefined
    });
};
const getFairLaunchTicket = async (tokenMint, buyer)=>{
    return await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey.findProgramAddress([
        Buffer.from('fair_launch'),
        tokenMint.toBuffer(),
        buyer.toBuffer()
    ], FAIR_LAUNCH_PROGRAM);
};
const getFairLaunchLotteryBitmap = async (tokenMint)=>{
    return await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey.findProgramAddress([
        Buffer.from('fair_launch'),
        tokenMint.toBuffer(),
        Buffer.from('lottery')
    ], FAIR_LAUNCH_PROGRAM);
};
const getSetupForTicketing = async (anchorProgram, amount, anchorWallet, fairLaunch, ticketKey)=>{
    if (!fairLaunch) {
        return {
            remainingAccounts: [],
            instructions: [],
            signers: [],
            amountLamports: 0
        };
    }
    const ticket = fairLaunch.ticket;
    const remainingAccounts = [];
    const instructions = [];
    const signers = [];
    let amountLamports = 0;
    //@ts-ignore
    if (!fairLaunch.state.treasuryMint) {
        console.log(1);
        if (!ticket && amount === 0) {
            amountLamports = fairLaunch.state.data.priceRangeStart.toNumber();
        } else {
            amountLamports = Math.ceil(amount * _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.LAMPORTS_PER_SOL);
        }
    } else {
        console.log(2);
        const transferAuthority = _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.Keypair.generate();
        signers.push(transferAuthority);
        // NOTE this token impl will not work till you get decimal mantissa and multiply...
        /// ex from cli wont work since you dont have a Signer, but an anchor.Wallet
        /*
    const token = new Token(
        anchorProgram.provider.connection,
        //@ts-ignore
        fairLaunchObj.treasuryMint,
        TOKEN_PROGRAM_ID,
        walletKeyPair,
      );
      const mintInfo = await token.getMintInfo();
      amountNumber = Math.ceil(amountNumber * 10 ** mintInfo.decimals);
    */ instructions.push(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.Token.createApproveInstruction(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, //@ts-ignore
        fairLaunch.state.treasuryMint, transferAuthority.publicKey, anchorWallet.publicKey, [], //@ts-ignore
        // TODO: get mint decimals
        amountNumber + fairLaunch.state.data.fees.toNumber()));
        remainingAccounts.push({
            //@ts-ignore
            pubkey: fairLaunch.state.treasuryMint,
            isWritable: true,
            isSigner: false
        });
        remainingAccounts.push({
            pubkey: (await (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .getAtaForMint */ .w2)(//@ts-ignore
            fairLaunch.state.treasuryMint, anchorWallet.publicKey))[0],
            isWritable: true,
            isSigner: false
        });
        remainingAccounts.push({
            pubkey: transferAuthority.publicKey,
            isWritable: false,
            isSigner: true
        });
        remainingAccounts.push({
            pubkey: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID,
            isWritable: false,
            isSigner: false
        });
    }
    console.log(ticket);
    if (ticket.data) {
        var ref;
        const [fairLaunchTicketSeqLookup, seqBump] = await (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .getFairLaunchTicketSeqLookup */ .Xb)(fairLaunch.state.tokenMint, (ref = ticket.data) === null || ref === void 0 ? void 0 : ref.seq);
        const seq = await anchorProgram.provider.connection.getAccountInfo(fairLaunchTicketSeqLookup);
        if (!seq) {
            instructions.push(await anchorProgram.instruction.createTicketSeq(seqBump, {
                accounts: {
                    fairLaunchTicketSeqLookup,
                    fairLaunch: fairLaunch.id,
                    fairLaunchTicket: ticketKey,
                    payer: anchorWallet.publicKey,
                    systemProgram: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SystemProgram.programId,
                    rent: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SYSVAR_RENT_PUBKEY
                },
                signers: []
            }));
        }
    }
    return {
        remainingAccounts,
        instructions,
        signers,
        amountLamports
    };
};
const receiveRefund = async (anchorWallet, fairLaunch)=>{
    if (!fairLaunch) {
        return;
    }
    const buyerTokenAccount = (await (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .getAtaForMint */ .w2)(fairLaunch.state.tokenMint, anchorWallet.publicKey))[0];
    const transferAuthority = _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.Keypair.generate();
    const signers = [
        transferAuthority
    ];
    const instructions = [
        _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.Token.createApproveInstruction(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, buyerTokenAccount, transferAuthority.publicKey, anchorWallet.publicKey, [], 1), 
    ];
    const remainingAccounts = [];
    if (fairLaunch.state.treasuryMint) {
        remainingAccounts.push({
            pubkey: fairLaunch.state.treasuryMint,
            isWritable: true,
            isSigner: false
        });
        remainingAccounts.push({
            pubkey: (await (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .getAtaForMint */ .w2)(fairLaunch.state.treasuryMint, anchorWallet.publicKey))[0],
            isWritable: true,
            isSigner: false
        });
    }
    console.log('tfr', fairLaunch.state.treasury.toBase58(), anchorWallet.publicKey.toBase58(), buyerTokenAccount.toBase58());
    await fairLaunch.program.rpc.receiveRefund({
        accounts: {
            fairLaunch: fairLaunch.id,
            treasury: fairLaunch.state.treasury,
            buyer: anchorWallet.publicKey,
            buyerTokenAccount,
            transferAuthority: transferAuthority.publicKey,
            tokenMint: fairLaunch.state.tokenMint,
            tokenProgram: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID,
            systemProgram: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SystemProgram.programId,
            clock: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SYSVAR_CLOCK_PUBKEY
        },
        // @ts-ignore
        __private: {
            logAccounts: true
        },
        remainingAccounts,
        instructions,
        signers
    });
};
const fairLaunchId1 = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey("3e4X7HFK7nVycvoKc3SgHMj5XtYndEQNAtwv6KtJEfSz");
const purchaseTicket = async (amount, anchorWallet, fairLaunch)=>{
    if (!fairLaunch) {
        return;
    }
    const ticket = fairLaunch.ticket.data;
    const [fairLaunchTicket, bump] = await getFairLaunchTicket(//@ts-ignore
    fairLaunch.state.tokenMint, anchorWallet.publicKey);
    const { remainingAccounts , instructions , signers , amountLamports  } = await getSetupForTicketing(fairLaunch.program, amount, anchorWallet, fairLaunch, fairLaunchTicket);
    console.log(instructions);
    try {
        console.log('Amount', amountLamports);
        await fairLaunch.program.rpc.purchaseTicket(bump, new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.BN(amountLamports), {
            // @ts-ignore
            accounts: {
                //@ts-ignore
                fairLaunch: fairLaunch.id,
                //@ts-ignore
                treasury: fairLaunch.state.treasury,
                //@ts-ignore
                buyer: anchorWallet.publicKey,
                //@ts-ignore
                payer: anchorWallet.publicKey,
                //@ts-ignore
                systemProgram: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SystemProgram.programId,
                //@ts-ignore
                rent: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SYSVAR_RENT_PUBKEY,
                //@ts-ignore
                clock: _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.SYSVAR_CLOCK_PUBKEY
            },
            //__private: { logAccounts: true },
            // @ts-ignore
            remainingAccounts,
            // @ts-ignore
            signers,
            instructions: instructions.length > 0 ? instructions : undefined
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
};
const withdrawFunds = async (anchorWallet, fairLaunch)=>{
    if (!fairLaunch) {
        return;
    }
    // TODO: create sequence ticket
    const remainingAccounts = [];
    //@ts-ignore
    if (fairLaunch.state.treasuryMint) {
        remainingAccounts.push({
            //@ts-ignore
            pubkey: fairLaunch.state.treasuryMint,
            isWritable: true,
            isSigner: false
        });
        remainingAccounts.push({
            pubkey: (await getAtaForMint(//@ts-ignore
            fairLaunch.state.treasuryMint, anchorWallet.publicKey))[0],
            isWritable: true,
            isSigner: false
        });
        remainingAccounts.push({
            pubkey: TOKEN_PROGRAM_ID,
            isWritable: false,
            isSigner: false
        });
    }
    await fairLaunch.program.rpc.withdrawFunds({
        accounts: {
            fairLaunch: fairLaunch.id,
            // @ts-ignore
            treasury: fairLaunch.state.treasury,
            authority: anchorWallet.publicKey,
            // @ts-ignore
            tokenMint: fairLaunch.state.tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId
        },
        remainingAccounts
    });
};


/***/ }),

/***/ 759:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZU": () => (/* binding */ toDate),
/* harmony export */   "uf": () => (/* binding */ formatNumber),
/* harmony export */   "Tb": () => (/* binding */ SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID),
/* harmony export */   "Xb": () => (/* binding */ getFairLaunchTicketSeqLookup),
/* harmony export */   "w2": () => (/* binding */ getAtaForMint),
/* harmony export */   "Ek": () => (/* binding */ createAssociatedTokenAccountInstruction)
/* harmony export */ });
/* unused harmony exports FAIR_LAUNCH_PROGRAM_ID, getFairLaunchTicket */
/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(874);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_solana_spl_token__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(831);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__);




const FAIR_LAUNCH_PROGRAM_ID = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey('knGjLrbC9CBfMmfUzPkBM5ceXUNar2Ape13ZvkuXGzW');
const toDate = (value)=>{
    if (!value) {
        return;
    }
    return new Date(value.toNumber() * 1000);
};
const numberFormater = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
const formatNumber = {
    format: (val)=>{
        if (!val) {
            return '--';
        }
        return numberFormater.format(val);
    },
    asNumber: (val)=>{
        if (!val) {
            return undefined;
        }
        return val.toNumber() / _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.LAMPORTS_PER_SOL;
    }
};
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const getFairLaunchTicketSeqLookup = async (tokenMint, seq)=>{
    return await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey.findProgramAddress([
        Buffer.from('fair_launch'),
        tokenMint.toBuffer(),
        seq.toArrayLike(Buffer, 'le', 8), 
    ], FAIR_LAUNCH_PROGRAM_ID);
};
const getAtaForMint = async (mint, buyer)=>{
    return await _project_serum_anchor__WEBPACK_IMPORTED_MODULE_0__.web3.PublicKey.findProgramAddress([
        buyer.toBuffer(),
        _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
    ], SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID);
};
const getFairLaunchTicket = async (tokenMint, buyer)=>{
    return await anchor.web3.PublicKey.findProgramAddress([
        Buffer.from('fair_launch'),
        tokenMint.toBuffer(),
        buyer.toBuffer()
    ], FAIR_LAUNCH_PROGRAM_ID);
};
function createAssociatedTokenAccountInstruction(associatedTokenAddress, payer, walletAddress, splTokenMintAddress) {
    const keys = [
        {
            pubkey: payer,
            isSigner: true,
            isWritable: true
        },
        {
            pubkey: associatedTokenAddress,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: walletAddress,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: splTokenMintAddress,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.SystemProgram.programId,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false
        }, 
    ];
    return new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.TransactionInstruction({
        keys,
        programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        data: Buffer.from([])
    });
}


/***/ }),

/***/ 75:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(518);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(831);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(130);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _glasseaters_hydra_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(242);
/* harmony import */ var _glasseaters_hydra_sdk__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_glasseaters_hydra_sdk__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(610);
/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(640);
/* harmony import */ var _material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(104);
/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(266);
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(308);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _components_countdown__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(233);
/* harmony import */ var _material_ui_core_Dialog__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(961);
/* harmony import */ var _material_ui_core_Dialog__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Dialog__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _material_ui_core_DialogTitle__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(400);
/* harmony import */ var _material_ui_core_DialogTitle__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_DialogTitle__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _material_ui_core_DialogContent__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(856);
/* harmony import */ var _material_ui_core_DialogContent__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_DialogContent__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _material_ui_icons_Close__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(501);
/* harmony import */ var _material_ui_icons_Close__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Close__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(61);
/* harmony import */ var _material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(247);
/* harmony import */ var _solana_wallet_adapter_material_ui__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(74);
/* harmony import */ var _components_candy_machine__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(285);
/* harmony import */ var _components_fair_launch__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(598);
/* harmony import */ var _components_utils__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(759);
/* harmony import */ var react_countdown__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(449);
/* harmony import */ var react_countdown__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(react_countdown__WEBPACK_IMPORTED_MODULE_22__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_candy_machine__WEBPACK_IMPORTED_MODULE_19__, _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_17__, _solana_wallet_adapter_material_ui__WEBPACK_IMPORTED_MODULE_18__]);
([_components_candy_machine__WEBPACK_IMPORTED_MODULE_19__, _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_17__, _solana_wallet_adapter_material_ui__WEBPACK_IMPORTED_MODULE_18__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);
























const ConnectButton = styled_components__WEBPACK_IMPORTED_MODULE_2___default()(_solana_wallet_adapter_material_ui__WEBPACK_IMPORTED_MODULE_18__.WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 2px;
  margin-bottom: 1px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
const MintContainer = (styled_components__WEBPACK_IMPORTED_MODULE_2___default().div)``; // add your styles here
const MintButton = styled_components__WEBPACK_IMPORTED_MODULE_2___default()((_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_6___default()))`
  width: 100%;
  height: 60px;
  margin-top: 2px;
  margin-bottom: 1px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`; // add your styles here
const dialogStyles = (theme)=>(0,_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_10__.createStyles)({
        root: {
            margin: 0,
            padding: theme.spacing(2)
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500]
        }
    })
;
const ValueSlider = styled_components__WEBPACK_IMPORTED_MODULE_2___default()(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Slider)({
    color: '#C0D5FE',
    height: 8,
    '& > *': {
        height: 4
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 4
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        marginTop: -10,
        background: 'linear-gradient(180deg, #604AE5 0%, #813EEE 100%)',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit'
        },
        '&:before': {
            display: 'none'
        }
    },
    '& .MuiSlider-valueLabel': {
        '& > *': {
            background: 'linear-gradient(180deg, #604AE5 0%, #813EEE 100%)'
        },
        lineHeight: 1.2,
        fontSize: 12,
        padding: 0,
        width: 32,
        height: 32,
        marginLeft: 9
    }
});
const ValueSlider2 = styled_components__WEBPACK_IMPORTED_MODULE_2___default()(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Slider)({
    color: '#C0D5FE',
    height: 8,
    '& > *': {
        height: 4
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 4
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        marginTop: -10,
        background: 'linear-gradient(180deg, #604AE5 0%, #813EEE 100%)',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit'
        },
        '&:before': {
            display: 'none'
        }
    },
    '& .MuiSlider-valueLabel': {
        '& > *': {
            background: 'linear-gradient(180deg, #604AE5 0%, #813EEE 100%)'
        },
        lineHeight: 1.2,
        fontSize: 12,
        padding: 0,
        width: 32,
        height: 32,
        marginLeft: 9
    }
});
const ValueSlider3 = styled_components__WEBPACK_IMPORTED_MODULE_2___default()(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Slider)({
    color: '#C0D5FE',
    height: 8,
    '& > *': {
        height: 4
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 4
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        marginTop: -10,
        background: 'linear-gradient(180deg, #604AE5 0%, #813EEE 100%)',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit'
        },
        '&:before': {
            display: 'none'
        }
    },
    '& .MuiSlider-valueLabel': {
        '& > *': {
            background: 'linear-gradient(180deg, #604AE5 0%, #813EEE 100%)'
        },
        lineHeight: 1.2,
        fontSize: 12,
        padding: 0,
        width: 32,
        height: 32,
        marginLeft: 9
    }
});
const ValueSlider4 = styled_components__WEBPACK_IMPORTED_MODULE_2___default()(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Slider)({
    color: '#C0D5FE',
    height: 8,
    '& > *': {
        height: 4
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 4
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        marginTop: -10,
        background: 'linear-gradient(180deg, #604AE5 0%, #813EEE 100%)',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit'
        },
        '&:before': {
            display: 'none'
        }
    },
    '& .MuiSlider-valueLabel': {
        '& > *': {
            background: 'linear-gradient(180deg, #604AE5 0%, #813EEE 100%)'
        },
        lineHeight: 1.2,
        fontSize: 12,
        padding: 0,
        width: 32,
        height: 32,
        marginLeft: 9
    }
});
var Phase1;
(function(Phase) {
    Phase[Phase["Phase0"] = 0] = "Phase0";
    Phase[Phase["Phase1"] = 1] = "Phase1";
    Phase[Phase["Phase2"] = 2] = "Phase2";
    Phase[Phase["Lottery"] = 3] = "Lottery";
    Phase[Phase["Phase3"] = 4] = "Phase3";
    Phase[Phase["Phase4"] = 5] = "Phase4";
    Phase[Phase["Unknown"] = 6] = "Unknown";
})(Phase1 || (Phase1 = {
}));
const Header = (props)=>{
    const { phaseName , desc , date , status  } = props;
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
        container: true,
        justifyContent: "center",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                xs: 6,
                justifyContent: "center",
                direction: "column",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                        variant: "h5",
                        style: {
                            fontWeight: 600
                        },
                        children: phaseName
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                        variant: "body1",
                        color: "textSecondary",
                        children: desc
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                xs: 6,
                container: true,
                justifyContent: "flex-end",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_countdown__WEBPACK_IMPORTED_MODULE_11__/* .PhaseCountdown */ .a, {
                    date: (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(date),
                    style: {
                        justifyContent: 'flex-end'
                    },
                    status: status || 'COMPLETE'
                })
            })
        ]
    }));
};
function getPhase(fairLaunch, candyMachine) {
    var ref, ref1, ref2, ref3;
    const curr = new Date().getTime();
    const phaseOne = (ref = (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseOneStart)) === null || ref === void 0 ? void 0 : ref.getTime();
    const phaseOneEnd = (ref1 = (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseOneEnd)) === null || ref1 === void 0 ? void 0 : ref1.getTime();
    const phaseTwoEnd = (ref2 = (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseTwoEnd)) === null || ref2 === void 0 ? void 0 : ref2.getTime();
    const candyMachineGoLive = (ref3 = (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.state.goLiveDate)) === null || ref3 === void 0 ? void 0 : ref3.getTime();
    return Phase1.Phase1;
}
const FAIR_LAUNCH_LOTTERY_SIZE = 8 + 32 + 1 + 8; // size of bitmask ones
const isWinner1 = (fairLaunch, fairLaunchBalance)=>{
    var ref, ref4, ref5;
    if (fairLaunchBalance > 0) return true;
    if (!(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.lottery.data) || !(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.lottery.data.length) || !((ref = fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) === null || ref === void 0 ? void 0 : ref.seq) || !(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.phaseThreeStarted)) {
        return false;
    }
    const myByte = fairLaunch.lottery.data[FAIR_LAUNCH_LOTTERY_SIZE + Math.floor(((ref4 = fairLaunch.ticket.data) === null || ref4 === void 0 ? void 0 : ref4.seq.toNumber()) / 8)];
    const positionFromRight = 7 - ((ref5 = fairLaunch.ticket.data) === null || ref5 === void 0 ? void 0 : ref5.seq.toNumber()) % 8;
    const mask = Math.pow(2, positionFromRight);
    const isWinner = myByte & mask;
    return isWinner > 0;
};
let first = true;
const Home = (props)=>{
    var ref34, ref6, ref7, ref8, ref9, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref28, ref29, ref30, ref31, ref32, ref33;
    var tokenBondingKey = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey("3nN2iNpJcgurQxN2V6P7TQMiSCQw3ENPeqqwfZ2pxpTT");
    const { 0: fairLaunchBalance1 , 1: setFairLaunchBalance  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const { 0: yourSOLBalance , 1: setYourSOLBalance  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: isMinting , 1: setIsMinting  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false); // true when user got to press MINT
    const { 0: contributed , 1: setContributed  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const { 0: contributed2 , 1: setContributed2  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const { 0: contributed3 , 1: setContributed3  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const { 0: contributed4 , 1: setContributed4  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const wallet = (0,_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_17__.useWallet)();
    const anchorWallet = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{
        if (!wallet || !wallet.publicKey || !wallet.signAllTransactions || !wallet.signTransaction) {
            return;
        }
        return {
            publicKey: wallet.publicKey,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction
        };
    }, [
        wallet
    ]);
    const { 0: alertState , 1: setAlertState  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        open: false,
        message: '',
        severity: undefined
    });
    const { 0: fairLaunch , 1: setFairLaunch  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
    const { 0: candyMachine , 1: setCandyMachine  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
    const { 0: howToOpen , 1: setHowToOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: refundExplainerOpen , 1: setRefundExplainerOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: antiRugPolicyOpen , 1: setAnitRugPolicyOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const onMint = async ()=>{
        try {
            setIsMinting(true);
            if (wallet.connected && (candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.program) && wallet.publicKey) {
                var ref;
                if (((ref = fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) === null || ref === void 0 ? void 0 : ref.state.unpunched) && isWinner1(fairLaunch, fairLaunchBalance1)) {
                    await onPunchTicket();
                }
                const mintTxId = await (0,_components_candy_machine__WEBPACK_IMPORTED_MODULE_19__/* .mintOneToken */ .CI)(candyMachine, wallet.publicKey);
                const status = await (0,_components_candy_machine__WEBPACK_IMPORTED_MODULE_19__/* .awaitTransactionSignatureConfirmation */ .Vg)(mintTxId, props.txTimeout, props.connection, 'singleGossip', false);
                // @ts-ignore
                if (!(status === null || status === void 0 ? void 0 : status.err)) {
                    setAlertState({
                        open: true,
                        message: 'Congratulations! Mint succeeded!',
                        severity: 'success'
                    });
                } else {
                    setAlertState({
                        open: true,
                        message: 'Mint failed! Please try again!',
                        severity: 'error'
                    });
                }
            }
        } catch (error) {
            // TODO: blech:
            let message = error.msg || 'Minting failed! Please try again!';
            if (!error.msg) {
                if (!error.message) {
                    message = 'Transaction Timeout! Please try again.';
                } else if (error.message.indexOf('0x138')) {
                } else if (error.message.indexOf('0x137')) {
                    message = `SOLD OUT!`;
                } else if (error.message.indexOf('0x135')) {
                    message = `Insufficient funds to mint. Please fund your wallet.`;
                }
            } else {
                if (error.code === 311) {
                    message = `SOLD OUT!`;
                    window.location.reload();
                } else if (error.code === 312) {
                    message = `Minting period hasn't started yet.`;
                }
            }
            setAlertState({
                open: true,
                message,
                severity: 'error'
            });
        } finally{
            setIsMinting(false);
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        (async ()=>{
            if (!anchorWallet) {
                return;
            }
            try {
                const balance = await props.connection.getBalance(anchorWallet.publicKey);
                setYourSOLBalance(balance);
                const state = await (0,_components_fair_launch__WEBPACK_IMPORTED_MODULE_20__/* .getFairLaunchState */ .kE)(anchorWallet, props.fairLaunchId, props.connection);
                setFairLaunch(state);
                try {
                    if (state.state.tokenMint) {
                        const fairLaunchBalance = await props.connection.getTokenAccountBalance((await (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .getAtaForMint */ .w2)(state.state.tokenMint, anchorWallet.publicKey))[0]);
                        if (fairLaunchBalance.value) {
                            setFairLaunchBalance(fairLaunchBalance.value.uiAmount || 0);
                        }
                    }
                } catch (e) {
                    console.log('Problem getting fair launch token balance');
                    console.log(e);
                }
            } catch (e) {
                console.log('Problem getting fair launch state');
                console.log(e);
            }
            if (props.candyMachineId) {
                try {
                    const cndy = await (0,_components_candy_machine__WEBPACK_IMPORTED_MODULE_19__/* .getCandyMachineState */ .Qk)(anchorWallet, props.candyMachineId, props.connection);
                    setCandyMachine(cndy);
                } catch (e) {
                    console.log('Problem getting candy machine state');
                    console.log(e);
                }
            } else {
                console.log('No candy machine detected in configuration.');
            }
        })();
    }, [
        anchorWallet,
        props.candyMachineId,
        props.connection,
        props.fairLaunchId, 
    ]);
    var min, max, fee, step, median;
    var phaseOneEnd = (ref34 = (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseOneEnd)) === null || ref34 === void 0 ? void 0 : ref34.getTime();
    console.log(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state);
    // @ts-ignore
    var min = _components_utils__WEBPACK_IMPORTED_MODULE_21__/* .formatNumber.asNumber */ .uf.asNumber(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.last) + 0.0138;
    console.log(min);
    // @ts-ignore
    var fee = _components_utils__WEBPACK_IMPORTED_MODULE_21__/* .formatNumber.asNumber */ .uf.asNumber(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.fee);
    // @ts-ignore
    var max = min + 0.0138 * 10;
    // @ts-ignore
    var step = 0.0138;
    // @ts-ignore
    var median = _components_utils__WEBPACK_IMPORTED_MODULE_21__/* .formatNumber.asNumber */ .uf.asNumber(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.currentMedian);
    let highest = min * 10;
    const marks = [
        // TODO:L
        {
            value: min || 0.0138,
            label: `${min} SOL`
        },
        // display user comitted value
        // {
        //   value: 37,
        //   label: '37°C',
        // },
        {
            value: min * 10 || 0,
            label: `${max} SOL`
        }, 
    ].filter((_)=>_ !== undefined && _.value !== 0
    );
    const onDeposit = async ()=>{
        if (!anchorWallet) {
            return;
        }
        console.log('deposit');
        setIsMinting(true);
        try {
            if (// @ts-ignore
            new Date().getTime() < phaseOneEnd) {
                await (0,_components_fair_launch__WEBPACK_IMPORTED_MODULE_20__/* .purchaseTicket */ .XY)(contributed, anchorWallet, fairLaunch);
            } else {
                await (0,_components_fair_launch__WEBPACK_IMPORTED_MODULE_20__/* .purchaseTicket */ .XY)(0, anchorWallet, fairLaunch);
            }
            setIsMinting(false);
            setAlertState({
                open: true,
                message: `Congratulations! contribution ${(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) ? 'updated' : 'inserted'}!`,
                severity: 'success'
            });
        } catch (e) {
            console.log(e);
            setIsMinting(false);
            setAlertState({
                open: true,
                message: 'Something went wrong.',
                severity: 'error'
            });
        }
    };
    const onRugRefund = async ()=>{
        if (!anchorWallet) {
            return;
        }
        console.log('refund');
        try {
            setIsMinting(true);
            await (0,_components_fair_launch__WEBPACK_IMPORTED_MODULE_20__/* .receiveRefund */ .iS)(anchorWallet, fairLaunch);
            setIsMinting(false);
            setAlertState({
                open: true,
                message: 'Congratulations! You have received a refund. This is an irreversible action.',
                severity: 'success'
            });
        } catch (e) {
            console.log(e);
            setIsMinting(false);
            setAlertState({
                open: true,
                message: 'Something went wrong.',
                severity: 'error'
            });
        }
    };
    const onRefundTicket = async ()=>{
    };
    const onPunchTicket = async ()=>{
        if (!anchorWallet || !fairLaunch || !fairLaunch.ticket) {
            return;
        }
        console.log('punch');
        setIsMinting(true);
        try {
            await (0,_components_fair_launch__WEBPACK_IMPORTED_MODULE_20__/* .punchTicket */ .lL)(anchorWallet, fairLaunch);
            setIsMinting(false);
            setAlertState({
                open: true,
                message: 'Congratulations! Ticket punched!',
                severity: 'success'
            });
        } catch (e) {
            console.log(e);
            setIsMinting(false);
            setAlertState({
                open: true,
                message: 'Something went wrong.',
                severity: 'error'
            });
        }
    };
    var mintPublicKey2 = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey("5NhF3kUzzuVuuYooJoJjZNQtzjPNdGfGdfUL4dojL7UL");
    var mintPublicKey = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey("DwyrS41AcCcfjRXeCMnGHtkr84Yij6VCzhac5pJM9Ejm");
    var connection2 = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.Connection('https://solana--devnet.datahub.figment.io/apikey/24c64e276fc5db6ff73da2f59bac40f2', "confirmed");
    //var wallet = useAnchorWallet()
    async function claim() {
        if (wallet) {
            var fanoutSdk;
            fanoutSdk = new _glasseaters_hydra_sdk__WEBPACK_IMPORTED_MODULE_5__.FanoutClient(connection2, // @ts-ignore
            wallet);
            var fanout = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey("8QPuyqUQuZANiiB5H3Rx2tLny4zVmpMANFVseoAm4fFh");
            var ix = await fanoutSdk.distributeTokenMemberInstructions({
                distributeForMint: true,
                fanout: fanout,
                fanoutMint: mintPublicKey,
                membershipMint: mintPublicKey,
                // @ts-ignore
                member: wallet.publicKey,
                // @ts-ignore
                payer: wallet.publicKey
            });
            var ix3 = await fanoutSdk.distributeTokenMemberInstructions({
                distributeForMint: true,
                fanout: fanout,
                fanoutMint: mintPublicKey2,
                membershipMint: mintPublicKey,
                // @ts-ignore
                member: wallet.publicKey,
                // @ts-ignore
                payer: wallet.publicKey
            });
            var tx2 = await fanoutSdk.sendInstructions([
                ...ix.instructions,
                ...ix3.instructions
            ], [], // @ts-ignore
            wallet.publicKey);
        }
    }
    async function doit() {
        if (wallet) {
            var fanoutSdk;
            fanoutSdk = new _glasseaters_hydra_sdk__WEBPACK_IMPORTED_MODULE_5__.FanoutClient(connection2, // @ts-ignore
            wallet);
            var fanout = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey("8QPuyqUQuZANiiB5H3Rx2tLny4zVmpMANFVseoAm4fFh");
            console.log(parseFloat(shares) * 10 ** 9);
            var ixs = await fanoutSdk.stakeTokenMemberInstructions({
                shares: parseFloat(shares) * 10 ** 9,
                fanout: fanout,
                membershipMint: mintPublicKey,
                // @ts-ignore
                member: wallet.publicKey,
                // @ts-ignore
                payer: wallet.publicKey
            });
            var tx = await fanoutSdk.sendInstructions(ixs.instructions, [], // @ts-ignore
            wallet.publicKey);
        }
    }
    async function us() {
        if (wallet) {
            var fanoutSdk;
            fanoutSdk = new _glasseaters_hydra_sdk__WEBPACK_IMPORTED_MODULE_5__.FanoutClient(connection2, // @ts-ignore
            wallet);
            var fanout = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey("8QPuyqUQuZANiiB5H3Rx2tLny4zVmpMANFVseoAm4fFh");
            await fanoutSdk.unstakeTokenMember({
                fanout: fanout,
                // @ts-ignore
                member: wallet.publicKey,
                // @ts-ignore
                payer: wallet.publicKey
            });
        }
    }
    const phase = getPhase(fairLaunch, candyMachine);
    const candyMachinePredatesFairLaunch = (candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.state.goLiveDate) && (fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseTwoEnd) && (candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.state.goLiveDate.lt(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseTwoEnd));
    const notEnoughSOL = false;
    async function onChange(e) {
        e.preventDefault();
        console.log(e.target.value);
        setShares(e.target.value);
    }
    var { 0: shares , 1: setShares  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("1.38");
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Container, {
        style: {
            marginTop: 0
        },
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                children: "Ayyy"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Link, {
                href: "/swap",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                    children: "Swap"
                })
            }),
            "Shares:",
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Input, {
                style: {
                    color: "white",
                    backgroundColor: "grey"
                },
                type: "text",
                onInput: onChange,
                value: shares
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_6___default()), {
                style: {
                    color: "white"
                },
                type: "submit",
                onClick: doit,
                children: "STAKEme"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_6___default()), {
                style: {
                    color: "white"
                },
                type: "submit",
                onClick: us,
                children: "UNSTAKEALLme"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_6___default()), {
                style: {
                    color: "white"
                },
                type: "submit",
                onClick: claim,
                children: "meCLAIM"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Container, {
                maxWidth: "xs",
                style: {
                    position: 'relative'
                },
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_7___default()), {
                    style: {
                        padding: 24,
                        backgroundColor: '#151A1F',
                        borderRadius: 6
                    },
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                        container: true,
                        justifyContent: "center",
                        direction: "column",
                        children: [
                            phase === Phase1.Phase0 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                                phaseName: 'Phase 0',
                                desc: 'Anticipation Phase',
                                date: fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseOneStart
                            }),
                            phase === Phase1.Phase1 && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                style: {
                                    color: "white"
                                },
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                                        phaseName: 'lorum ipsum!',
                                        desc: '"I do not say blah blah blah" - the count"',
                                        date: fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseOneEnd
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                                        variant: "h5",
                                        style: {
                                            fontWeight: 900
                                        },
                                        children: [
                                            (fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.authority.toBase58().slice(0, 3)) + '...' + (fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.authority.toBase58().slice((fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.authority.toBase58().length) - 3, fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.authority.toBase58().length)),
                                            ' ',
                                            "is Going to Win 1st Prize of ◎",
                                            '',
                                            _components_utils__WEBPACK_IMPORTED_MODULE_21__/* .formatNumber.format */ .uf.format((fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.treasury) * 0.8 / _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.LAMPORTS_PER_SOL),
                                            "! If nobody outcontributions 'em _soon_"
                                        ]
                                    })
                                ]
                            }),
                            phase === Phase1.Phase2 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                                phaseName: 'Hey press the mint $',
                                desc: 'It\'ll pay the winner, you pay sol fees, then restart this game:)',
                                date: fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseTwoEnd
                            }),
                            phase === Phase1.Lottery && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                                phaseName: 'Phase 3',
                                desc: 'Raffle in progress',
                                date: fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseTwoEnd.add(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.lotteryDuration)
                            }),
                            phase === Phase1.Phase3 && !candyMachine && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                                phaseName: 'Phase 3',
                                desc: 'Raffle finished!',
                                date: fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.phaseTwoEnd
                            }),
                            phase === Phase1.Phase3 && candyMachine && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                                phaseName: 'Phase 3',
                                desc: 'Minting starts in...',
                                date: candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.state.goLiveDate
                            }),
                            phase === Phase1.Phase4 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Header, {
                                phaseName: candyMachinePredatesFairLaunch ? 'Phase 3' : 'Phase 4',
                                desc: 'Candy Time 🍬 🍬 🍬',
                                date: candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.state.goLiveDate,
                                status: "LIVE"
                            }),
                            fairLaunch && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                children: [
                                    [
                                        Phase1.Phase1,
                                        Phase1.Phase2,
                                        Phase1.Phase3,
                                        Phase1.Lottery, 
                                    ].includes(phase) && (fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref6 = fairLaunch.ticket) === null || ref6 === void 0 ? void 0 : (ref7 = ref6.data) === null || ref7 === void 0 ? void 0 : ref7.state.withdrawn) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        style: {
                                            paddingTop: '15px'
                                        },
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_16___default()), {
                                            severity: "error",
                                            children: "Your contribution was withdrawn and cannot be adjusted or re-inserted."
                                        })
                                    }),
                                    [
                                        Phase1.Phase1,
                                        Phase1.Phase2
                                    ].includes(phase) && fairLaunch.state.currentMedian && (fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref8 = fairLaunch.ticket) === null || ref8 === void 0 ? void 0 : (ref9 = ref8.data) === null || ref9 === void 0 ? void 0 : ref9.amount) && !(fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref10 = fairLaunch.ticket) === null || ref10 === void 0 ? void 0 : (ref11 = ref10.data) === null || ref11 === void 0 ? void 0 : ref11.state.withdrawn) && fairLaunch.state.currentMedian.gt(fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref12 = fairLaunch.ticket) === null || ref12 === void 0 ? void 0 : (ref13 = ref12.data) === null || ref13 === void 0 ? void 0 : ref13.amount) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        style: {
                                            paddingTop: '15px'
                                        },
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_16___default()), {
                                            severity: "warning",
                                            children: "Your contribution is currently below the median and will not be eligible for the raffle."
                                        })
                                    }),
                                    [
                                        Phase1.Phase3,
                                        Phase1.Lottery
                                    ].includes(phase) && fairLaunch.state.currentMedian && (fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref14 = fairLaunch.ticket) === null || ref14 === void 0 ? void 0 : (ref15 = ref14.data) === null || ref15 === void 0 ? void 0 : ref15.amount) && !(fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref16 = fairLaunch.ticket) === null || ref16 === void 0 ? void 0 : (ref17 = ref16.data) === null || ref17 === void 0 ? void 0 : ref17.state.withdrawn) && fairLaunch.state.currentMedian.gt(fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref18 = fairLaunch.ticket) === null || ref18 === void 0 ? void 0 : (ref19 = ref18.data) === null || ref19 === void 0 ? void 0 : ref19.amount) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        style: {
                                            paddingTop: '15px'
                                        },
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_16___default()), {
                                            severity: "error",
                                            children: [
                                                "Your contribution was below the median and was not included in the raffle. You may click ",
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("em", {
                                                    children: "Withdraw"
                                                }),
                                                " when the raffle ends or you will be automatically issued one when the Fair Launch authority withdraws from the treasury."
                                            ]
                                        })
                                    }),
                                    notEnoughSOL && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_16___default()), {
                                        severity: "error",
                                        children: "You do not have enough SOL in your account to place this contribution."
                                    })
                                ]
                            }),
                            [
                                Phase1.Phase1,
                                Phase1.Phase2
                            ].includes(phase) && tokenBondingKey && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                                    style: {
                                        marginTop: 40,
                                        marginBottom: 20
                                    },
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(ValueSlider, {
                                        min: min,
                                        marks: marks,
                                        max: max,
                                        step: step,
                                        value: contributed,
                                        onChange: (ev, val)=>setContributed(val)
                                        ,
                                        valueLabelDisplay: "auto",
                                        style: {
                                            width: 'calc(100% - 40px)',
                                            marginLeft: 20,
                                            height: 30
                                        }
                                    })
                                })
                            }),
                            !wallet.connected ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(ConnectButton, {
                                children: [
                                    "Connect",
                                    ' ',
                                    [
                                        Phase1.Phase1
                                    ].includes(phase) ? 'to contribution' : 'to see status'
                                ]
                            }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                children: [
                                    [
                                        Phase1.Phase1,
                                        Phase1.Phase2
                                    ].includes(phase) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(MintButton, {
                                            onClick: onDeposit,
                                            variant: "contained",
                                            disabled: false,
                                            children: isMinting ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.CircularProgress, {
                                            }) : !(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) ? 'Place contribution' : 'New contributions != adjusting.'
                                        })
                                    }),
                                    [
                                        Phase1.Phase3
                                    ].includes(phase) && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                        children: [
                                            isWinner1(fairLaunch, fairLaunchBalance1) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(MintButton, {
                                                onClick: onPunchTicket,
                                                variant: "contained",
                                                disabled: ((ref20 = fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) === null || ref20 === void 0 ? void 0 : ref20.state.punched) !== undefined,
                                                children: isMinting ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.CircularProgress, {
                                                }) : 'Punch Ticket'
                                            }),
                                            !isWinner1(fairLaunch, fairLaunchBalance1) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(MintButton, {
                                                onClick: onRefundTicket,
                                                variant: "contained",
                                                disabled: isMinting || (fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) === undefined || ((ref21 = fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) === null || ref21 === void 0 ? void 0 : ref21.state.withdrawn) !== undefined,
                                                children: isMinting ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.CircularProgress, {
                                                }) : 'Withdraw'
                                            })
                                        ]
                                    }),
                                    phase === Phase1.Phase4 && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                        children: [
                                            (!fairLaunch || isWinner1(fairLaunch, fairLaunchBalance1)) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(MintContainer, {
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(MintButton, {
                                                    disabled: (candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.state.isSoldOut) || isMinting || !(candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.state.isActive) || (fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref22 = fairLaunch.ticket) === null || ref22 === void 0 ? void 0 : (ref23 = ref22.data) === null || ref23 === void 0 ? void 0 : ref23.state.punched) && fairLaunchBalance1 === 0,
                                                    onClick: onMint,
                                                    variant: "contained",
                                                    children: (fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref24 = fairLaunch.ticket) === null || ref24 === void 0 ? void 0 : (ref25 = ref24.data) === null || ref25 === void 0 ? void 0 : ref25.state.punched) && fairLaunchBalance1 === 0 ? 'MINTED' : (candyMachine === null || candyMachine === void 0 ? void 0 : candyMachine.state.isSoldOut) ? 'SOLD OUT' : isMinting ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.CircularProgress, {
                                                    }) : 'MINT'
                                                })
                                            }),
                                            !isWinner1(fairLaunch, fairLaunchBalance1) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(MintButton, {
                                                onClick: onRefundTicket,
                                                variant: "contained",
                                                disabled: isMinting || (fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) === undefined || ((ref26 = fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.ticket.data) === null || ref26 === void 0 ? void 0 : ref26.state.withdrawn) !== undefined,
                                                children: isMinting ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.CircularProgress, {
                                                }) : 'Withdraw'
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                                container: true,
                                justifyContent: "space-between",
                                color: "textSecondary",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Link, {
                                    component: "button",
                                    variant: "body2",
                                    color: "textSecondary",
                                    align: "left",
                                    onClick: ()=>{
                                        setHowToOpen(true);
                                    },
                                    children: "Wat is this"
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Dialog__WEBPACK_IMPORTED_MODULE_12___default()), {
                                open: refundExplainerOpen,
                                onClose: ()=>setRefundExplainerOpen(false)
                                ,
                                PaperProps: {
                                    style: {
                                        backgroundColor: '#222933',
                                        borderRadius: 6
                                    }
                                },
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_DialogContent__WEBPACK_IMPORTED_MODULE_14___default()), {
                                    style: {
                                        padding: 24
                                    },
                                    children: "During raffle phases, or if you are a winner, or if this website is not configured to be a fair launch but simply a candy machine, refunds are disallowed."
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Dialog__WEBPACK_IMPORTED_MODULE_12___default()), {
                                open: antiRugPolicyOpen,
                                onClose: ()=>{
                                    setAnitRugPolicyOpen(false);
                                },
                                PaperProps: {
                                    style: {
                                        backgroundColor: '#222933',
                                        borderRadius: 6
                                    }
                                },
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_DialogContent__WEBPACK_IMPORTED_MODULE_14___default()), {
                                    style: {
                                        padding: 24
                                    },
                                    children: [
                                        !(fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.antiRugSetting) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            children: "This Fair Launch has no anti-rug settings."
                                        }),
                                        (fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.data.antiRugSetting) && fairLaunch.state.data.antiRugSetting.selfDestructDate && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                    children: "Anti-Rug Policy"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    children: "This raffle is governed by a smart contract to prevent the artist from running away with your money."
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    children: "How it works:"
                                                }),
                                                "This project will retain",
                                                ' ',
                                                fairLaunch.state.data.antiRugSetting.reserveBp / 100,
                                                "% (◎",
                                                ' ',
                                                (fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.treasury) * fairLaunch.state.data.antiRugSetting.reserveBp / (_solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.LAMPORTS_PER_SOL * 10000),
                                                ") of the pledged amount in a locked state until all but",
                                                ' ',
                                                fairLaunch.state.data.antiRugSetting.tokenRequirement.toNumber(),
                                                ' ',
                                                "NFTs (out of up to",
                                                ' ',
                                                fairLaunch.state.data.numberOfTokens.toNumber(),
                                                ") have been minted.",
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                    children: [
                                                        "If more than",
                                                        ' ',
                                                        fairLaunch.state.data.antiRugSetting.tokenRequirement.toNumber(),
                                                        ' ',
                                                        "NFTs remain as of",
                                                        ' ',
                                                        (ref27 = (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(fairLaunch.state.data.antiRugSetting.selfDestructDate)) === null || ref27 === void 0 ? void 0 : ref27.toLocaleDateString(),
                                                        ' ',
                                                        "at",
                                                        ' ',
                                                        (ref28 = (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(fairLaunch.state.data.antiRugSetting.selfDestructDate)) === null || ref28 === void 0 ? void 0 : ref28.toLocaleTimeString(),
                                                        ", you will have the option to get a refund of",
                                                        ' ',
                                                        fairLaunch.state.data.antiRugSetting.reserveBp / 100,
                                                        "% of the cost of your token."
                                                    ]
                                                }),
                                                (fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref29 = fairLaunch.ticket) === null || ref29 === void 0 ? void 0 : ref29.data) && !(fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref30 = fairLaunch.ticket) === null || ref30 === void 0 ? void 0 : ref30.data.state.withdrawn) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(MintButton, {
                                                    onClick: onRugRefund,
                                                    variant: "contained",
                                                    disabled: !!!fairLaunch.ticket.data || !fairLaunch.ticket.data.state.punched || Date.now() / 1000 < fairLaunch.state.data.antiRugSetting.selfDestructDate.toNumber(),
                                                    children: isMinting ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.CircularProgress, {
                                                    }) : Date.now() / 1000 < fairLaunch.state.data.antiRugSetting.selfDestructDate.toNumber() ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                        children: [
                                                            "Refund in...",
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(// @ts-ignore
                                                            (react_countdown__WEBPACK_IMPORTED_MODULE_22___default()), {
                                                                date: (0,_components_utils__WEBPACK_IMPORTED_MODULE_21__/* .toDate */ .ZU)(fairLaunch.state.data.antiRugSetting.selfDestructDate)
                                                            })
                                                        ]
                                                    }) : 'Refund'
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                    style: {
                                                        textAlign: 'center',
                                                        marginTop: '-5px'
                                                    },
                                                    children: (fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref31 = fairLaunch.ticket) === null || ref31 === void 0 ? void 0 : ref31.data) && !(fairLaunch === null || fairLaunch === void 0 ? void 0 : (ref32 = fairLaunch.ticket) === null || ref32 === void 0 ? void 0 : (ref33 = ref32.data) === null || ref33 === void 0 ? void 0 : ref33.state.punched) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("small", {
                                                        children: "You currently have a ticket but it has not been punched yet, so cannot be refunded."
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Dialog__WEBPACK_IMPORTED_MODULE_12___default()), {
                                open: howToOpen,
                                onClose: ()=>setHowToOpen(false)
                                ,
                                PaperProps: {
                                    style: {
                                        backgroundColor: '#222933',
                                        borderRadius: 6
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_DialogTitle__WEBPACK_IMPORTED_MODULE_13___default()), {
                                        disableTypography: true,
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        },
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Link, {
                                                component: "button",
                                                variant: "h6",
                                                color: "textSecondary",
                                                onClick: ()=>{
                                                    setHowToOpen(true);
                                                },
                                                children: "How it works"
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
                                                "aria-label": "close",
                                                className: dialogStyles.closeButton,
                                                onClick: ()=>setHowToOpen(false)
                                                ,
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_icons_Close__WEBPACK_IMPORTED_MODULE_15___default()), {
                                                })
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_DialogContent__WEBPACK_IMPORTED_MODULE_14___default()), {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                                            variant: "h4",
                                            children: "TL;DR: Any contribution above the previous highest one (in SOL) will let you win, if nobody else contributes before the timer runs out. Glhf."
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            fairLaunch && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Container, {
                maxWidth: "xs",
                style: {
                    position: 'relative',
                    marginTop: 10
                },
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    style: {
                        margin: 20
                    },
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                        container: true,
                        direction: "row",
                        wrap: "nowrap",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                                container: true,
                                md: 4,
                                direction: "column",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                                        variant: "body2",
                                        color: "textSecondary",
                                        children: "contributions"
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                                        variant: "h6",
                                        color: "textPrimary",
                                        style: {
                                            fontWeight: 'bold'
                                        },
                                        children: (fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.state.numberTicketsSold.toNumber()) || 0
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                                container: true,
                                md: 4,
                                direction: "column",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                                        variant: "body2",
                                        color: "textSecondary",
                                        children: "With love by"
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                                        variant: "h6",
                                        color: "textPrimary",
                                        style: {
                                            fontWeight: 'bold'
                                        },
                                        children: "Jare :)"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9___default()), {
                                container: true,
                                md: 4,
                                direction: "column",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                                        variant: "body2",
                                        color: "textSecondary",
                                        children: "Total raised"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_8___default()), {
                                        variant: "h6",
                                        color: "textPrimary",
                                        style: {
                                            fontWeight: 'bold'
                                        },
                                        children: [
                                            "◎",
                                            ' ',
                                            _components_utils__WEBPACK_IMPORTED_MODULE_21__/* .formatNumber.format */ .uf.format(((fairLaunch === null || fairLaunch === void 0 ? void 0 : fairLaunch.treasury) || 0) / _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.LAMPORTS_PER_SOL)
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__.Snackbar, {
                open: alertState.open,
                autoHideDuration: 6000,
                onClose: ()=>setAlertState({
                        ...alertState,
                        open: false
                    })
                ,
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_material_ui_lab_Alert__WEBPACK_IMPORTED_MODULE_16___default()), {
                    onClose: ()=>setAlertState({
                            ...alertState,
                            open: false
                        })
                    ,
                    severity: alertState.severity,
                    children: alertState.message
                })
            })
        ]
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);

});

/***/ })

};
;