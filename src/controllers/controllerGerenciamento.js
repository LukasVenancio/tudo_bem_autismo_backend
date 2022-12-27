'use strict'

const prisma = require('../prismaClient');

exports.post = async (req, res) => {

    const data = req.body;

    const restricaoExiste = await prisma.tbl_restricao.findFirst({

        where:{
           id_crianca: parseInt(data.id_crianca),
           id_mini_jogo: parseInt(data.id_mini_jogo)
        }
    })

    if(restricaoExiste){
        return res.status(400).send({message: "Restrição já existente neste minijogo!"});
    } else {
        prisma.tbl_restricao.create({

            data: {
                id_crianca: parseInt(data.id_crianca),
                id_mini_jogo: parseInt(data.id_mini_jogo)
            },
            select: {
                id: true
            }
        }).then(
    
            (data) => {
                res.status(201).json(data)
            }
        ).catch(
    
            (error) =>{
    
                if(error.code == 'P2003'){
    
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

   
}

exports.get = (req, res) => {

    prisma.tbl_restricao.findMany({

        include: {
            tbl_crianca: true,
            tbl_mini_jogo: true
        }
    }).then(

        (data) => {
            res.status(200).json(data);
        }
    ).catch(
        
        (error) => {
            res.status(500).json({"message" : error})
        }
    )
}

exports.getById = (req, res) => {

    const id = req.params.id;

    prisma.tbl_restricao.findUnique({

        where: {
            id: parseInt(id)
        },
        include: {
            tbl_crianca: true,
            tbl_mini_jogo: true
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

exports.delete = (req, res) => {

    const id = req.params.id;

    prisma.tbl_restricao.delete({

        where: {
            id: parseInt(id)
        }
    }).then(

        (data) => {
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