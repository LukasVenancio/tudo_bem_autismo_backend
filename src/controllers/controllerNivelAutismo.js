'use strict';

const prisma = require('../prismaClient');

exports.get = (req, res, next) => {

    prisma.tbl_nivel_autismo.findMany()
    .then(

        (data) => {

            res.status(200).json(data);

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

exports.getById = (req, res, next) =>{

    const prisma = require('../prismaClient');

    const id = req.params.id;

    prisma.tbl_nivel_autismo.findUnique({

        where:{

            id: parseInt(id)
        }
    
    }).then(

        (data) => {

            res.status(200).send(data);
        }
    
    ).catch(

        (error) => {

            const argument = error.message.split('Argument')[1]
            const err = argument.split('\n')[0]

            res.status(400).json({"message" : err});
        }
    );

};