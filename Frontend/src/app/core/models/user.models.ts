export interface LsUser{
    _id: string,
    username: string,
    email: string,
    analytics: {
        files: number,
        folders: number,
        totalSize: string,
        maxCloudSize: string
    }
}

export const LsUserDefault: LsUser = {
    _id: '',
    username: '',
    email: '',
    analytics: {
        files: 0,
        folders: 0,
        totalSize: '0 MB',
        maxCloudSize: '0 MB'
    }
}

export type LsField = 'name' | 'username' | 'email'