'use strict';

const prisma = require('../prismaClient');

exports.post = (req, res) =>{

    const data = req.body;

    const {firebaseUrl} = req.file ? req.file : "";

    prisma.tbl_crianca.create({

        data:{
            nome: data.nome,
            foto: firebaseUrl,
            data_nascimento: new Date( data.data_nascimento)  ,
            id_genero: parseInt(data.id_genero),
            id_nivel_autismo: parseInt(data.id_nivel_autismo),
            id_responsavel: parseInt(data.id_responsavel)
        },
        select:{
            id: true,
            foto: true
        },
  
    }).then(

        (crianca) => {

            res.status(201).json(crianca)
        }
    
    ).catch(

        (error) =>{

            if(error.code == 'P2003'){

                res.status(400).json({message: `Chave estrangeira inválida no campo ${error.meta.field_name}`})
            
            }else if(error.code == "P2000"){
    
                res.status(500).json({message: `A quantidade máxima de caracteres foi ultrapassada no campo ${error.meta.column_name}.`})

            }else{

                const argument = error.message.split('Argument')[1]

                if(argument){

                    const err = argument.split('\n')[0]

                    res.status(400).json({"message" : err});

                }else{

                    res.status(500).json({"message" : error});

                }   
            }
        }
    )
}

exports.get = (req, res) =>{

    prisma.tbl_crianca.findMany({

        include:{

            tbl_genero: true,
            tbl_nivel_autismo: true,
            tbl_responsavel: true
            
        }

    }).then(

        (data) => {

            res.status(200).json(data)
        }
    
    ).catch(

        (error) =>{

            res.status(500).json({"message" : error})
        }
    )
}

exports.getById = (req, res) =>{

    const id = req.params.id;

    prisma.tbl_crianca.findUnique({

        where:{

            id: parseInt(id)

        },
        include:{

            tbl_genero: true,
            tbl_nivel_autismo: true,
            tbl_responsavel: true

        }
    
    }).then(

        (data) => {

            res.status(200).json(data)
        }
    
    ).catch(

        (error) => {

            const argument = error.message.split('Argument')[1]
    
            if(argument){

                const err = argument.split('\n')[0]

                res.status(400).json({"message" : err});

            }else{

                res.status(500).json({"message" : error});

            }
        }
    )
}

exports.put = (req, res) =>{

    const id = req.params.id;
    const data = req.body;
    const {firebaseUrl} = req.file ? req.file : "";

    prisma.tbl_crianca.update({

        where:{

            id: parseInt(id)

        },
        data:{

            nome: data.nome,
            foto: firebaseUrl,
            data_nascimento: new Date( data.data_nascimento)  ,
            id_genero: parseInt(data.id_genero),
            id_nivel_autismo: parseInt(data.id_nivel_autismo),
            id_responsavel: parseInt(data.id_responsavel)

        }
    
    }).then(

        () => {

            res.status(200).json({
                message: "Registro atualizado com sucesso!"
            });

        }
    
    ).catch(

        (error) => {

           if(error.code == "P2000"){

                res.status(400).json({message: `A quantidade máxima de caracteres foi ultrapassada no campo ${error.meta.column_name}.`})

            
            }else if(error.code == "P2025"){

                res.status(400).send({message: "ID não encontrado na base de dados."});
            
            
            }else if(error.code == 'P2003'){

                res.status(400).json({message: `Chave estrangeira inválida no campo ${error.meta.field_name}`})
            
            }else{

                const argument = error.message.split('Argument')[1]

                if(argument){

                    const err = argument.split('\n')[0]

                    res.status(400).json({"message" : err});

                }else{

                    res.status(500).json({"message" : error});

                }   
            }
        }
    )
}

exports.delete = async(req, res, next) =>{

    const id = req.params.id;

    prisma.tbl_crianca.delete({

        where:{
            
            id: parseInt(id)
        
        },
    
    }).then(

        async(data) => {

            res.status(200).json({message: "Registro excluído com sucesso."})
        }
    
    ).catch(

        (error) => {

            if(error.code == "P2025"){

                res.status(400).send({message: "ID não encontrado na base de dados."});
            
            
            }else{

                const argument = error.message.split('Argument')[1]

                if(argument){

                    const err = argument.split('\n')[0]

                    res.status(400).json({"message" : err});

                }else{

                    res.status(500).json({"message" : error});

                }  
            }
        }
    )
}