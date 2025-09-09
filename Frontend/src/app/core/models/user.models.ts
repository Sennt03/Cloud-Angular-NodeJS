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

export type LsField = 'name' | 'username' | 'email'