var admin = require("firebase-admin");

var serviceAccount = require("../src/config/firebaseKey.json");

const BUCKET = "tudo-bem-autismo.appspot.com";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

exports.uploadImage = (req, res, next) => {
    if(!req.file) return next();

    const image = req.file;

    const fileName = Date.now() + "." + image.originalname.split(".").pop();

    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
        metadata: {
            contentType: image.mimetype,
        },
    });

    stream.on("error", (e) => {
        console.error(e);
    })

    stream.on("finish", async () => {
         //Make the file public
        await file.makePublic();

         //Get the public URL
         req.file.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${fileName}`;
         next();
    })

    stream.end(image.buffer);
}

exports.uploadImages = (image) => {

    const fileName = Date.now() + "." + image.originalname.split(".").pop();

    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
        metadata: {
            contentType: image.mimetype,
        },
    });

    stream.on("error", (e) => {
        console.error(e);
    })

    stream.on("finish", async () => {
        //Make the file public
        await file.makePublic();

        //Get the public URL
        image = `https://storage.googleapis.com/${BUCKET}/${fileName}`;

    })

    stream.end(image.buffer);

    // console.log(fileName)



    return `https://storage.googleapis.com/${BUCKET}/${fileName}`
}

exports.uploadFiles =  (fileToUpload) => {

    // console.log(fileToUpload)
    const fileName = Date.now() + "." + fileToUpload.originalname.split(".").pop();

    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
        metadata: {
            contentType: fileToUpload.mimetype,
        },
    });

    stream.on("error", (e) => {
        console.error(e);
    })

    stream.on("finish", async () => {
        //Make the file public
        await file.makePublic();
    })

    stream.end(fileToUpload.buffer);

    const uploadedFile = {
        link: `https://storage.googleapis.com/${BUCKET}/${fileName}`,
        // originalname: fileToUpload.originalname,
        mimetype: fileToUpload.mimetype.split('/')[0]
    }   

    return uploadedFile
}