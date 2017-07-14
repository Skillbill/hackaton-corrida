const admin = require("firebase-admin");

/**
 * Created by root on 7/14/17.
 */

 const authorization = (req) => {
   return req.get('Authorization');
 }

 const extractToken = (req) => {
   const header = authorization(req);
   const prefix = 'Bearer ';
   if (header && header.startsWith(prefix)) {
     return header.substr(prefix.length);
   } else {
     return undefined;
   }
 };

 function firebaseStrategy(req, res, next) {
   const idToken = extractToken(req);

   if (idToken) {
     admin.auth().verifyIdToken(idToken)
       .then(function (decodedToken) {
         console.log('firebase', decodedToken);
         const uid = decodedToken.uid;

         req.user = {oid: uid};
         next();

       }).catch(function (error) {
         if(error && error.errorInfo && error.errorInfo.code == 'auth/argument-error') {
           let iat;
           let exp;
           let oid;
           try {
             const decoded = jwtDecode(idToken);
             if (decoded) {
               oid = decoded.user_id;
               iat = new Date(0);
               iat.setUTCSeconds(decoded.iat);
               exp = new Date(0);
               exp.setUTCSeconds(decoded.exp);
             }
           } catch (e) {
             console.log(`cant decode ${idToken}`, e);
           }
           console.log(`error veryfing token OID : ${oid} IAT: ${iat} EXP: ${exp}`, error);
         } else {
           console.log('can\'t verify token', error);
         }
         const header = authorization(req)
         res.status(401).send({msg: `wrong token [${header}]`});
     });
   } else {
     const header = authorization(req)
     res.status(401).send({msg: `wrong Authorization HEADER [${header}]`});
   }
 }


 module.exports = {
   init: function(path, app) {
       const serviceAccount = require(`./skb-corrida-73fa64c64c0c.json`);
       admin.initializeApp({
         credential: admin.credential.cert(serviceAccount)
       });


       app.use(path, firebaseStrategy);
   }
 };
