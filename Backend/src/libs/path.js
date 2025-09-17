const fs = require('fs-extra')
const cloudinary = require('cloudinary')
const myError = require('./myError')
const path = require('path')
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

module.exports = {
    processPath: (path) => {
        if(path){
            if(path.includes('-')){
                let pathProcess = path.replace(/-/g, '/')
                return pathProcess
            }else{
                return path
            }
        }else{
            return '/'
        }
        
    },

    dirExist: async (pathComplete) => {
        let exist
        try{
            exist = await fs.promises.stat(pathComplete)
        }catch(error){
            if(error.code == 'ENOENT') throw myError('La carpeta no existe', 403)
        }

        if(!exist.isDirectory()) throw myError('La carpeta no existe', 403)
        return true
    },

    fileExist: async (pathComplete) => {
        let exist
        try{
            exist = await fs.promises.stat(pathComplete)
        }catch(error){
            if(error.code == 'ENOENT') throw myError('El archivo no existe', 403)
        }

        if(!exist.isFile()) throw myError('El archivo no existe', 403)
        return true
    },

    existBoolean: async (pathComplete) => {
        try{
            await fs.promises.stat(pathComplete)
            return true
        }catch(error){
            if(error.code == 'ENOENT') 
                return false
        }

    },

    getUniqueName: async (pathComplete, originalFileName) => {
        let newFileName = originalFileName;
        let n = 1;
    
        while (true) {
            try {
                await fs.stat(path.join(pathComplete, newFileName));
                n++;
                const nameParts = path.parse(originalFileName);
                newFileName = `${nameParts.name} (${n})${nameParts.ext}`;
            } catch (error) {
                break;
            }
        }

        return newFileName;
    },

    withoutExt: (name) => {
        let inicio = name.lastIndexOf('/')
        let final = name.lastIndexOf('.')
        inicio++
        let nombre = name.substring(inicio, final)
        return nombre
    },

    getDate: (date) => {
        const dia = date.getDate().toString().padStart(2, '0')
        const mes = (date.getMonth() + 1).toString().padStart(2, '0')
        const año = date.getFullYear()
        const hora = date.getHours().toString().padStart(2, '0')
        const minuto = date.getMinutes().toString().padStart(2, '0')

        return `${dia}-${mes}-${año} ${hora}:${minuto}`;
    },

    getSize: function(size){
        if(size == 0) return '0 MB'

        const sizeInKB = (size / 1024).toFixed(0)

        if (sizeInKB >= 1024 * 1024) {
            const sizeInGB = (sizeInKB / (1024 * 1024)).toFixed(2);
            return `${sizeInGB} GB`;
        } 
        
        if (sizeInKB >= 1024) {
            const sizeInMB = (sizeInKB / 1024).toFixed(2);
            return `${sizeInMB} MB`;
        }
        
        return `${sizeInKB} KB`;
    },

    getNameFromPath: (mipath) => {
        while (mipath.endsWith('/')) {
            mipath = mipath.slice(0, -1);
        }
        
        let inicio = mipath.lastIndexOf('/');
        inicio++;
        return mipath.substring(inicio);
    },

    isValidMove(init, newPath) {
        function normalizeSegments(path) {
            return path
            .replace(/\\/g, "/")
            .replace(/\/+/g, "/")
            .replace(/^\/|\/$/g, "")
            .split("/")
            .filter(Boolean);
        }

        const from = normalizeSegments(init);
        const to = normalizeSegments(newPath);

        if (from.length === to.length && from.every((v, i) => v === to[i])) return false;

        if (to.length >= from.length) {
            let isInside = true;
            for (let i = 0; i < from.length; i++) {
            if (from[i] !== to[i]) {
                isInside = false;
                break;
            }
            }
            if (isInside) return false;
        }

        return true;
    }
    
}