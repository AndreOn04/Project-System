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
        return res.status(404).json( { message: " Não foi possível localizar o usuário... " } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if ( !isPasswordValid ) {

        return res.status(400).json({ message: "Opss.. Email ou Senha está incorreto... " });

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

// Deletar imagem
app.delete("/delete-image", async ( req, res ) => {

    const { imageUrl } = req.query;

    if ( !imageUrl ) {
        return res.status(400).json({

            error: true,
            message: " O parâmetro imageUrl é obrigatório "

         });
    }

    try {
        // Extraindo o nome do arquivo da URL da imagem
        const filename = path.basename(imageUrl);

        // Definindo o caminho do arquivo
        const filePath = path.join(__dirname, 'uploads', filename );

        // Verificando se há arquivos existentes...

        if ( fs.existsSync(filePath) ) {
            // Deletando o arquivo da pasta uploads
            fs.unlinkSync(filePath);
            res.status(200).json({ message: " Imagem deletada com sucesso! " });
        } else {
            res.status(200).json({ error: true, message: " Image não encontrada " });
        }

    } catch ( error ) {
        res.status(500).json({ error: true, message: error.message });
    }

});


// Arquivos estáticos do servidor do diretório uploads e assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")) );
app.use("/assets", express.static(path.join(__dirname, "assets")) );
 
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

// Editar
app.put("/get-story/:id", authenticateToken, async (req, res) =>{

    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    // Validar campos obrigatórios
    if ( !title || !story || !visitedLocation || !imageUrl || !visitedDate )  {

        return res.status(400).json({ 

            error: true, 
            message: " Todos os campos são obrigatórios... ",

         });

    }
    
    // Converter visitedDate para Date Object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        // Obtento o histórico do ID
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if ( !travelStory ) {
            return res.status(400).json({ error: true, message: " Não foi possível encontrar o histórico... " });
        }

        const placeholderImgUrl = ` http://localhost:8000/assets/placeholder.png `;

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImgUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: " Editado com sucesso... " });
    } catch ( error ) {
        res.status(500).json({ error: true, message: error.message });
    }

})

// Deletar
app.delete("/delete-story/:id", authenticateToken, async (req, res) =>{

    const { id } = req.params;
    const { userId } = req.user;


    try {
         // Obtento o histórico do ID
         const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

         if ( !travelStory ) {
             return res.status(400).json({ error: true, message: " Não foi possível encontrar o histórico... " });
         }

         // Deletar do Database (Banco de dados);
         await travelStory.deleteOne({ _id: id, userId: userId });

         // Extraindo a URL
         const imageUrl = travelStory.imageUrl;
         const filename = path.basename(imageUrl);

         // Define the file path
         const filePath = path.join(__dirname, 'uploads', filename );

         // Deletando a imagem da pasta UPLOADS
         fs.unlink(filePath, (err) => {
            console.error(" Falha ao tentar deletar o arquivo... ", err);
         });

         res.status(200).json({ message: " Deletado com sucesso... " });

    } catch ( error ) {
        res.status(500).json({ error: true, message: error.message });
    }
})

// Atualizar os favoritos
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) =>{
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if ( !travelStory ) {
            return res.status(404).json({ error: true, message: " Não encontramos... " });
        }

        travelStory.isFavourite = isFavourite;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: " Atualizado com sucesso... " });

        
    } catch ( error ) {
        res.status(500).json({ error: true, message: error.message });
    }
})

// Pesquisar por histórico de viagem
app.get("/search", authenticateToken, async (req, res) =>{

    const { query } = req.query;
    const { userId } = req.user;

    if ( !query ) {

        return res.status(400).json({ error: true, message: " Por favor, informe o parâmetro query... " });

    }

    try {
        const searchResults = await TravelStory.find({

            userId: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { story: { $regex: query, $options: 'i' } },
                { visitedLocation: { $regex: query, $options: 'i' } },
            ],

         }).sort({ isFavourite: -1 });

         res.status(200).json({ stories: searchResults });
    } catch ( error ) {
        res.status(500).json({ error: true, message: error.message });
    }

})

// Filtros
app.get("/travel-stories/filter", authenticateToken, async (req, res) =>{

    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {

        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        const filteredStories = await TravelStory.find({

            userId: userId,
            visitedDate: { $gte: start, $lte: end },

         }).sort({ isFavourite: -1 });

         res.status(200).json({ stories: filteredStories });
    } catch ( error ) {
        res.status(500).json({ error: true, message: error.message });
    }

})

app.listen(8000);
module.exports = app;