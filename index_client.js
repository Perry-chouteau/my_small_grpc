/**
 * @author perry.chouteau@epitech.eu
 * @copyright MIT
 * @version 1.0
 * @description express to grpc
 **/

/* REQUIRED */

'use strict' // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const colors = require('chalk');

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

var signProto = grpc.loadPackageDefinition(packageDefinition).sign;

var client = new signProto.SignService(`localhost:${GRPC_PORT}`,
                                       grpc.credentials.createInsecure());

//SignIn
var TestSignin_Error = {name : 'error', password : 'error'};
var TestSignin_Success = {name : 'user', password : 'password'};

client.signIn(TestSignin_Error, function(err, response) {
  console.log(`${colors.red("Test SignIn")}`);
  console.log('\tSignInError:', response.message);
});
client.signIn(TestSignin_Success, function(err, response) {
  console.log('\tSignInSuccess:', response.message);
});

//SignUp
var TestSignup_Error = {name : 'user', password : 'password'};
var TestSignup_Succes = {name : 'newuser', password : 'newpassword'};
var TestSignup_in_Succes = {name : 'newuser', password : 'newpassword'};

client.signUp(TestSignup_Error, function(err, response) {
  console.log(`${colors.green("Test SignUp")}`);
  console.log('\tSignUpError:', response.message);
});
client.signUp(TestSignup_Succes, function(err, response) {
  console.log('\tSignUpSuccess:', response.message);
});
client.signIn(TestSignup_in_Succes, function(err, response) {
  console.log('\tSignInSuccess:', response.message);
});


//SignOut
var TestSignOut_Error = {name : 'error'};
var TestSignOut_Succes = {name : 'user'};

client.signOut(TestSignOut_Error, function(err, response) {
  console.log(`${colors.cyan("Test SignOut")}`);
  console.log('\tSignOutError:', response.message);
});
client.signOut(TestSignOut_Succes, function(err, response) {
  console.log('\tSignOutSuccess:', response.message);
});