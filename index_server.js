/**
 * @author perry.chouteau@epitech.eu
 * @copyright MIT
 * @version 1.0
 * @description express to grpc
 **/

/* REQUIRED */

'use strict' // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

const colors = require('chalk');
/* grpc-js */
const grpc = require('@grpc/grpc-js'); // node_modules/@grpc/grpc-js/build/src/server.d.ts
const protoLoader = require('@grpc/proto-loader');

/* CODE */
const GRPC_PORT = 2063;

const SIGN_PROTO_PATH = __dirname + '/proto/sign.proto';
var packageDefinition = protoLoader.loadSync(
    SIGN_PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var list = [
    {name: 'user', password: 'password'},
];

var signProto = grpc.loadPackageDefinition(packageDefinition).sign;


//signProto.sign(req, res);

/**
 * @description wrong adress
 * @param {string} req
 * @param {string} res
 * @returns {string} 404
 * @example http://localhost:3001/wrong_adress
 *
 */

/* Function setup */

function signIn(call, callback) {
    console.log(`SignIn) ${call.request.name} ${call.request.password}`);
    for (var i = 0; i < list.length; i++) {
        if (list[i].name == call.request.name && list[i].password == call.request.password) {
            callback(null, {message: `SignIn, ${call.request.name}`, status: 200});
            return;
        }
    }
    callback(null, {message: `SignIn went wrong, ${call.request.name}`, status: 500});
}

function signUp(call, callback) {
    console.log(`SignUp) ${call.request.name} ${call.request.password}`);
    for (var i = 0; i < list.length; i++) {
        if (list[i].name == call.request.name) {
            callback(null, {message: `SignUp went wrong, ${call.request.name}`, status: 500});
            return;
        }
    }
    list.push({name: call.request.name, password: call.request.password});
    callback(null, {message: `SignUp, ${call.request.name}`, status: 200});
}

function signOut(call, callback) {
    console.log(`SignOut) ${call.request.name}`);
    for (var i = 0; i < list.length; i++) {
        if (list[i].name == call.request.name) {
            callback(null, {message: `SignOut, ${call.request.name}`, status: 200});
            return;
        }
    }
    callback(null, {message: `SignOut went wrong, ${call.request.name}`, status: 500});
}
/* Server setup */
var server = new grpc.Server();
server.addService(signProto.SignService.service,
                  { signUp: signUp,
                    signIn: signIn,
                    signOut: signOut });

server.bindAsync(`0.0.0.0:${GRPC_PORT}`,
                    grpc.ServerCredentials.createInsecure(),
                    () => {
                        server.start();
                        console.log('Server running on port ' + colors.redBright(`${GRPC_PORT}`) + `.`);
                    });