const admin = require("firebase-admin");

/**
 * Created by root on 7/14/17.
 */
 function firebaseStrategy(req, res, next) {
   const idToken = extractToken(req);

   if (idToken) {
     admin.auth().verifyIdToken(idToken)
       .then(function (decodedToken) {
         logger.debug('firebase', decodedToken);
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
             logger.warn(`cant decode ${idToken}`, e);
           }
           logger.warn(`error veryfing token OID : ${oid} IAT: ${iat} EXP: ${exp}`, error);
         } else {
           logger.error('can\'t verify token', error);
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


       app.use(gameApiPaths, firebaseStrategy);
   }
 };
