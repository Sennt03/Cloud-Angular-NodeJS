const { dirExist, fileExist, withoutExt, getDate, getSize, existBoolean, getUniqueName, getNameFromPath, isValidMove } = require('../../libs/path')
const myError = require('../../libs/myError')
const fs = require('fs-extra')
const path = require('path')
const iconv = require('iconv-lite');
const { cloudPath, archivoOculto, maxFileSizeInMB, usersUnlimit, maxCloudSize, maxCloudSizeInMB } = require('../../config/config')

async function registerDir(userId){
    const pathComplete = path.join(cloudPath + userId)
    try{
        await fs.mkdir(pathComplete)
    }catch(e){
        if(e.code != 'EEXIST'){
            // throw myError('Ha ocurrido un error al registrar el espacio', 500)
            throw myError('An error occurred while registering the space', 500)
        }
    }
    // return {message: '!Bienvenido¡'}
    return {message: '!Welcome¡'}
}

async function openDir(userId, mipath) {
    const pathComplete = path.join(cloudPath + userId + '/' + mipath);
    await dirExist(pathComplete);

    const dir = await fs.opendir(pathComplete);
    const content = { files: [], directories: [] };

    for await (const dirent of dir) {
        const direntPath = path.join(pathComplete, dirent.name);
        const stat = await fs.stat(direntPath);
        const decodedName = iconv.decode(Buffer.from(dirent.name, 'binary'), 'utf-8');

        if (dirent.isDirectory()) {
            content.directories.push({
                name: decodedName,
                createdAt: stat.birthtime,
                size: stat.size
            });
        } else if (dirent.isFile() && dirent.name !== archivoOculto) {
            content.files.push({
                name: decodedName,
                createdAt: stat.birthtime,
                size: stat.size
            });
        }
    }

    content.files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    content.directories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { path: mipath, content };
}

async function detailFile(userId, mipath){
    const pathComplete = path.join(cloudPath + userId + '/' + mipath)
    await fileExist(pathComplete)

    const file = await fs.stat(pathComplete)
    const name = path.basename(pathComplete)
    const details = {
        name,
        nameWiouthExt: withoutExt(name),
        size: getSize(file.size),
        ext: path.extname(pathComplete).split('.')[1],
        uploaded: getDate(file.birthtime)
    }

    return { path: mipath, details }
}

async function downloadFile(userId, mipath){
    const pathComplete = path.join(cloudPath + userId + '/' + mipath)
    await fileExist(pathComplete)

    return {file: path.basename(pathComplete), pathComplete}
}

async function createDir(userId, mipath, name){
    const pathComplete = path.join(cloudPath + userId + '/' + mipath + '/' + name)
    
    try{
        await fs.mkdir(pathComplete)
        // return {message: 'Carpeta creada correctamente'}
        return {message: `Folder "${name}" created successfully`}
    }catch(e){
        if(e.code == 'ENOENT'){
            // throw myError('Ruta inexistente', 400)
            throw myError('Non-existent route', 400)
        }else if(e.code == 'EEXIST'){
            // throw myError('La carpeta ya existe', 400)
            throw myError('The folder already exists', 400)
        }else{
            // throw myError('Ha ocurrido un error inesperado', 500)
            throw myError('An unexpected error has occurred', 500)
        }
    }

}

async function uploadFile(userId, mipath, files){
    const pathComplete = path.join(cloudPath + userId + '/' + mipath)
    await dirExist(pathComplete)
    const responses = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const allowedCharactersRegex = /^[a-zA-Z0-9\s-._@!()]+$/;

        if(!allowedCharactersRegex.test(file.name)){
            responses.push({name: file.name, message: `File name cannot contain special characters only can contain "-._@!()"`, status: 400})
            continue
        }
        
        if(withoutExt(file.name.trim()).length > 35){
            responses.push({name: file.name, message: `File name max 35 letters."`, status: 400})
            continue
        }

        const pathFile = path.join(pathComplete, file.name)

        const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;
        const maxCloudSizeInBytes = maxCloudSizeInMB * 1024 * 1024;

        const analitycs = await analitycsData(userId)
        if(analitycs.totalSizeWithOutFormat + file.size > maxCloudSizeInBytes && !analitycs.unlimit){
            responses.push({name: file.name, message: `Maximum cloud space: ${getSize(maxCloudSizeInBytes)}`, status: 400})
            continue
        }

        if(file.size > maxFileSizeInBytes && !analitycs.unlimit) {
            responses.push({name: file.name, message: `The maximum size is ${maxFileSizeInMB}MB.`, status: 400})
            continue
        }

        if(file.name == archivoOculto){
            responses.push({name: file.name, message: `Cannot upload a file with the specified name.`, status: 400})
            continue
        }
        
        const exist = await existBoolean(pathFile)
        if(exist){
            file.name = await getUniqueName(pathComplete, file.name)
        }
    
        try{
            await file.mv(pathComplete + '/' + file.name)
            responses.push({name: file.name, message: `File uploaded successfully.`, status: 200})
        }catch(error){
            responses.push({name: file.name, message: `Unexpected error.`, status: 500})
        }
    }

    return { message: 'Finished process.', responses }
}

async function deleteFile(userId, mipath){
    const pathComplete = path.join(cloudPath, userId + '/' + mipath)
    try {
        const stats = await fs.stat(pathComplete);

        if (stats.isDirectory()) {
            await fs.rm(pathComplete, { recursive: true });
        } else if (stats.isFile()) {
            await fs.unlink(pathComplete);
        } else {
            throw myError('Unrecognized element', 500)
        }

    } catch (error) {
        if(error.code === 'ENOENT') throw myError('Non-existent route', 400)
        else throw myError('An unexpected error has occurred.', 500)
    }

    let nombre = getNameFromPath(mipath)
    return { message: `"${nombre}" removed successfully` }
}

async function copy(userId, mipath, newPath, isFile){
    let name = getNameFromPath(mipath)
    
    const pathComplete = path.join(cloudPath + userId + '/' + mipath)
    let newPathComplete = path.join(cloudPath + userId + '/' + newPath + '/' + name)

    if(!isFile && !isValidMove(mipath, newPath)){
        throw myError('Cannot be copied within the same folder', 400)   
    }

    const exist = await existBoolean(newPathComplete)
    if(exist){
        name = await getUniqueName(path.join(cloudPath + userId + '/' + newPath), name)
        newPathComplete = path.join(cloudPath + userId + '/' + newPath + '/' + name)
    }

    try{
        await fs.copy(pathComplete, newPathComplete)
    }catch(e){
        if(e.code == 'ENOENT'){
            throw myError('The file or folder path does not exist', 400)
        }else{
            throw myError(`An unexpected error has occurred`, 500)
        }
    }

    // return { message: `"${name}": Copiado correctamente.` }
    return { message: `"${name}": Copied successfully.` }
}

async function move(userId, mipath, newPath, isFile, reemplazar){
    let name = getNameFromPath(mipath)
    
    const pathComplete = path.join(cloudPath + userId + '/' + mipath)
    let newPathComplete = path.join(cloudPath + userId + '/' + newPath + '/' + name)

    if(!isFile && !isValidMove(mipath, newPath)){
        throw myError('Cannot be copied within the same folder', 400)   
    }
    
    const options = { overwrite: false }
    if(reemplazar === 'true'){
        options.overwrite = true
    }

    try{
        await fs.move(pathComplete, newPathComplete, options)
    }catch(e){
        if(e.code == 'ENOENT'){
            throw myError(`Non-existent route`, 400)
        }else if(reemplazar != true){
            throw myError(`"${name}": It already exists on this route.`, 409)
        }else{
            throw myError(`An unexpected error has occurred.`, 500)
        }
    }
    return { message: `"${name}": Moved successfully.` }
}

async function rename(userId, mipath, name){
    const segmentos = mipath.split('/').filter(segmento => segmento.trim() !== '');
    segmentos.pop()
    const newPath = segmentos.join('/')
    
    const pathComplete = path.join(cloudPath + userId + '/' + mipath)
    const newPathComplete = path.join(cloudPath + userId + '/' + newPath + '/' + name)
    
    const exist = await existBoolean(newPathComplete)
    if(exist){
        // throw myError(`Ya existe en esta ruta, ingrese otro nombre.`, 400)
        throw myError(`Already exists on this path, enter another name.`, 400)
    }

    try{
        await fs.move(pathComplete, newPathComplete, { overwrite: true });
    }catch(e){
        if(e.code == 'ENOENT'){
            // throw myError(`Ruta inexistente.`, 400)
            throw myError(`Non-existent route.`, 400)
        }

        // throw myError(`Ha ocurrido un error inesperado.`, 500)
        throw myError(`An unexpected error has occurred.`, 500)
    }

    const nameOld = getNameFromPath(mipath)
    // return { message: `"${nameOld}": Se renombro a "${name}", correctamente.` }
    return { message: `"${nameOld}": It was renamed to "${name}", successfully.` }
}

async function analitycsData(userId) {
    const ruta = path.join(cloudPath + userId)

    let totalArchivos = 0;
    let totalCarpetas = 0;
    let tamañoTotal = 0;

    // Función auxiliar para recorrer de manera recursiva las carpetas.
    async function recorrerDirectorio(dir) {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = await fs.stat(filePath);

            if (stats.isDirectory()) {
                totalCarpetas++;
                await recorrerDirectorio(filePath);
            } else if (stats.isFile()) {
                totalArchivos++;
                tamañoTotal += stats.size;
            }
        }
    }

    await recorrerDirectorio(ruta);

    const maxCloudSizeInBytes = maxCloudSizeInMB * 1024 * 1024

    const unlimit = usersUnlimit.find(user => user.id == userId)

    return {
        files: totalArchivos,
        folders: totalCarpetas,
        totalSize: getSize(tamañoTotal),
        totalSizeWithOutFormat: tamañoTotal,
        maxCloudSize: unlimit ? 'unlimit' : getSize(maxCloudSizeInBytes),
        unlimit
    };
}

module.exports = {
    registerDir,
    openDir,
    detailFile,
    // getImage,
    downloadFile,
    createDir,
    uploadFile,
    deleteFile,
    copy,
    move,
    rename,
    analitycsData
}