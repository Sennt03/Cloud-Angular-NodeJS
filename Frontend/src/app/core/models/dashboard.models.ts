interface LsData{
    name: string,
    createdAt: Date,
    size: number
}

export interface LsOpenDir{
    path: string,
    content: {
        files: LsData[],
        directories: LsData[]
    }
}

export type Ext = 'txt' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'pdf' | 'zip' | 'rar' | '7z' | 'jpg' | 'jpeg' | 'png' | 'gif' | 'mp3' | 'wav' | 'mp4' | 'avi' | 'mkv' | 'default';

export const extensionToIcon: Record<Ext, string> = {
    default: 'fa-file',
    txt: 'fa-file-alt',
    doc: 'fa-file-word',
    docx: 'fa-file-word',
    xls: 'fa-file-excel',
    xlsx: 'fa-file-excel',
    ppt: 'fa-file-powerpoint',
    pptx: 'fa-file-powerpoint',
    pdf: 'fa-file-pdf',
    zip: 'fa-file-archive',
    rar: 'fa-file-archive',
    '7z': 'fa-file-archive',
    jpg: 'fa-file-image',
    jpeg: 'fa-file-image',
    png: 'fa-file-image',
    gif: 'fa-file-image',
    mp3: 'fa-file-audio',
    wav: 'fa-file-audio',
    mp4: 'fa-file-video',
    avi: 'fa-file-video',
    mkv: 'fa-file-video'
}