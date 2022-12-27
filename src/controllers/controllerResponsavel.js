'use strict';

const prisma = require('../prismaClient');

exports.post = async (req, res, next) =>{

    const data = req.body;

    const crypto = require('../config/globalFunctions');
    const encryptedSenha = crypto.encrypt(data.senha);
    
    if(encryptedSenha){
    
        data.senha = encryptedSenha;

        prisma.tbl_responsavel.create({
        
            data,
            select:{
                id: true
            }
        
        }).then(
    
            (data) =>{
    
                res.status(200).json(data);
            }
    
        ).catch(
    
            (error) => {
    
                if(error.code == "P2002"){
    
                    res.status(500).json({message: 'Email já cadastrado na base de dados.'})
    
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
        );

    }else{

        res.status(500).json({message: 'Não foi possível encriptar a senha.'})

    }
}

exports.get = async (req, res, next) =>{

    prisma.tbl_responsavel.findMany({

        include:{
            tbl_crianca:{

                include:{

                    tbl_genero: true,
                    tbl_nivel_autismo: true
                }
            }
        }
    })
    .then(

        (data) => {

            res.status(200).json(data);
        }
    )
    .catch(

        (error) =>{
            
            const e = new Error(error)
            res.status(500).json(e.message)

        }
    );

}

exports.getById = async (req, res, next) =>{

    const id = req.params.id;

    prisma.tbl_responsavel.findUnique({

        where:{

            id: parseInt(id)
    
        },
        include:{
            tbl_crianca:{

                include:{

                    tbl_genero: true,
                    tbl_nivel_autismo: true
                }
            }
        }

    }).then(

        (data) => {

            res.status(200).json(data);
        }
    )
    .catch(

        (error) =>{

            const argument = error.message.split('Argument')[1]
    
            if(argument){

                const err = argument.split('\n')[0]

                res.status(400).json({"message" : err});

            }else{

                res.status(500).json({"message" : error});

            }  
        }
    );
}

exports.put = async (req, res, next) =>{

    const id = req.params.id;
    const data = req.body;

    if(data.senha){

        const crypto = require('../config/globalFunctions');
        const encryptedSenha = crypto.encrypt(data.senha);
        
        if(encryptedSenha){
        
            data.senha = encryptedSenha;

        }
    }

    prisma.tbl_responsavel.update({

        data,
        where:{
            id: parseInt(id)
        }
    
    }).then(

        () => {

            res.status(200).json({
                message: "Registro atualizado com sucesso!"
            });

        }
    
    ).catch(

        (error) => {

            if(error.code == "P2002"){
    
                res.status(400).json({message: 'Email já cadastrado na base de dados.'})

            }else if(error.code == "P2000"){

                res.status(400).json({message: `A quantidade máxima de caracteres foi ultrapassada no campo ${error.meta.column_name}.`})

            
            }else if(error.code == "P2025"){

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

exports.putPassword = (req, res, next) =>{

    const id = req.params.id;
    const data = req.body;

    if(data.senha && data.senha_atual){
        
        prisma.tbl_responsavel.findUnique({

            where:{
    
                id: parseInt(id)
            }
        
        }).then(
    
            (responsavel) =>{
    
                const crypto = require('../config/globalFunctions');
                const encryptedSenha_atual = crypto.encrypt(data.senha_atual);
                const encryptedSenha = crypto.encrypt(data.senha);
                
                if(encryptedSenha && encryptedSenha_atual){

                    data.senha_atual = encryptedSenha_atual;
                    data.senha = encryptedSenha;
    
                    if(responsavel.senha == data.senha_atual){

                        prisma.tbl_responsavel.update({
        
                            data:{
    
                                senha: data.senha
                            },
                            where:{
    
                                id: parseInt(id)
                            }
    
                            
                        }).then(
    
                            () => {
    
                                res.status(200).json({
                                    message: "Senha atualizada com sucesso!"
                                });
    
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
                    
                    }else{

                        res.status(400).json({message: 'Senha atual incorreta.'})
                    }
                
                }else{

                    res.status(400).json({message: 'Não foi possível encriptar a senha.'})
                }
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
    
    }else{

        res.status(400).json({message: 'Dados inválidos'})
    }
}

exports.delete = (req, res, next) =>{


    const id = req.params.id;

    prisma.tbl_responsavel.delete({

        where:{
            id: parseInt(id)
        },
        include:{
            tbl_crianca: true
        }
    
    }).then(

        () => {

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

exports.login = (req, res, next) =>{

    const data = req.body;

    prisma.tbl_responsavel.findUnique({

        where:{

            email: data.email
    
        },
        include:{
            tbl_crianca:{

                include:{

                    tbl_genero: true,
                    tbl_nivel_autismo: true
                }
            }
        }
    
    }).then(

        (responsavel) => {

            if(responsavel){

                const crypto = require('../config/globalFunctions');
                const encryptedSenha = crypto.encrypt(data.senha);
                
                if(encryptedSenha == responsavel.senha){
    
                    res.status(202).send({Login: true, responsavel});
    
                }else{
        
                    res.status(406).send({message: "Senha incorreta."})
                }
            
            }else{

                res.status(400).send({
                    message: "Email não encontrado na base de dados."
                });
            }
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