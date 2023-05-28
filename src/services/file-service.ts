import supabase from '../../database';

export interface IUploadedImage {
    path: string;
    url: string;
}

class FileService {
    bucket: string;
    userId: string;

    constructor(bucket: string, userId = 'common') {
        this.bucket = bucket;
        this.userId = userId;
    }

    async uploadFile(file: File): Promise<IUploadedImage> {
        const { data, error } = await supabase.storage
            .from(this.bucket)
            .upload(`${this.userId}/${file.name}`, file);

        if (data) {
            const url = this.getPublicUrl(data.path);
            return {
                url: url.data.publicUrl,
                path: data.path,
            };
        }

        return Promise.reject(error);
    }

    getPublicUrl(path: string) {
        return supabase.storage.from(this.bucket).getPublicUrl(path);
    }

    async deleteFiles(paths: string[]): Promise<void> {
        const { error } = await supabase.storage.from(this.bucket).remove(paths);

        if (error) {
            throw error;
        }
    }
}

export default FileService;
