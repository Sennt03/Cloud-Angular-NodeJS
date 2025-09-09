export interface LsUploadFile{
    message: string,
    responses: {
        name: string,
        message: string,
        status: number
    }[]
}

export interface LsUploadFiles{
    value: number,
    loading: boolean,
    text: string,
    uploaded: {
        name: string,
        message: string,
        status: number
    }[]
}

export interface LsResMessage{
    message: string
}