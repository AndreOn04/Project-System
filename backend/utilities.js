const jwt = require('jsonwebtoken')

function authenticateToken( req, res, next ) {

    const authHeader = req.headers["authorization"];
    // console.log('Authorization Header:', authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if ( !token ){
        // console.log('Token não enviado ou inválido');
        return res.sendStatus(401);
    } 

    jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, ( err, user ) => {

        if ( err ) {
            // console.log('Erro ao verificar o token:', err.message);
            return res.sendStatus(401);
        }
        req.user = user;
        // console.log('Token autenticado...:', user);
        next();

    } );

}

module.exports = {
    authenticateToken,
};