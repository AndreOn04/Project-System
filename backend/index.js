require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

const { authenticateToken } = require("./utilities");

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Criar Conta
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if ( !fullName || !email || !password ) {
        return res
            .status(400)
            .json( { error: true, message: " Preencha todos os campos... " } );
    }

    const isUser = await User.findOne( { email } );
    if ( isUser ) {
        return res
            .status(400)
            .json( { error: true, message: " Usuário já existente... " } );
    }

    const hashedPassword = await bcrypt.hash( password, 10 );

    const user = new User ( { 

        fullName,
        email,
        password: hashedPassword,

     } );

     await user.save();

     const accessToken = jwt.sign( 

          { userId: user._id },
          
          process.env.ACCESS_TOKEN_SECRET,
          {

            expiresIn: "72h", 
            
          }

      );

      return res.status( 201 ).json( {

        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: " Parabéns, usuário cadastrado com sucesso... ",

      } );

});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if ( !email || !password ) {
        return res.status(400).json( { message: "Os campos E-mail e senha são obrigatórios..." } );
    }

    const user = await User.findOne({ email });

    if ( !user ) {
        return res.status(404).json( { message: "Usuário não encontrado..." } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if ( !isPasswordValid ) {

        return res.status(400).json({ message: "Opps.. Credenciais Incorretas..." });

    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.json({ 

        error: false,
        message: " Login feito com sucesso... ",
        user: { fullName: user.fullName, email: user.email },
        accessToken,

     }); 
});

// Usuário
app.get("/get-user", authenticateToken, async ( req, res ) => {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });

    if ( !isUser ) {
        return res.sendStatus(401);
    }

    return res.json ({
        user: isUser,
        message: "",
     });
} );
 
// Adicionar Histórico de Viagem
app.post("/add-travel-story", authenticateToken, async (req, res) =>  {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;

    const { userId } = req.user;

    if ( !title || !story || !visitedLocation || !imageUrl || !visitedDate )  {

        return res.status(400).json({ 

            error: true, 
            message: " Todos os campos são obrigatórios... ",

         });

    }
    
    // Converter visitedDate para Date Object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
      const travelStory = new TravelStory({ 

        title,
        story,
        visitedLocation,
        userId,
        imageUrl,
        visitedDate: parsedVisitedDate,

       });

       await travelStory.save();
       res.status(201).json({ 

            story: travelStory, 
            message: "Adicionado com Sucesso...",

        });


    } catch ( error ) {

        res.status(400).json({ 

            error: true, message: error.message

         });

    }

});

// Obter todos os stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {

    const { userId } = req.user;

    try {

        const travelStories = await TravelStory.find({ 

            userId: userId

         }).sort({

            isFavourite: -1,

         });
         res.status(200).json({

            stories: travelStories,

         });
    } catch(error) {

        res.status(500).json({

            error: true, 
            message: error.message,

        });

    }
}); 

// Criando rotas para upload das imagens.
app.post("/image-upload",  upload.single("image"), async ( req, res ) => {

    try {

        if ( !req.file ) {

            return res 
                .status(400)
                .json({ error: true, message: " Nenhuma imagem foi enviada. ",})

        }

        const imageUrl = ` http://localhost:8000/uploads/${req.file.filename} `;

        res.status(201).json({ imageUrl });

    } catch (error) {

       res.status(500).json({ error: true, message: error.message });

    }

})

app.listen(8000);
module.exports = app;
