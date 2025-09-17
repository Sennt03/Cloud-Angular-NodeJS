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

export interface LsActionsInfo{
    show: boolean,
    path: string,
    name: string,
    type: 'move' | 'copy',
    isFile: boolean
}

export const defaultInfoActions: LsActionsInfo = {
    show: false,
    path: '',
    name: '',
    type: 'copy',
    isFile: false
}

export interface LsAll{
    path: string,
    name: string
}