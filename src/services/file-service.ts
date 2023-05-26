import supabase from '../../database';

export interface IUploadedImage {
    path: string;
    url: string;
}

class FileService {
    bucket: string;

    constructor(bucket: string) {
        this.bucket = bucket;
    }

    async uploadFile(file: File): Promise<IUploadedImage> {
        const { data, error } = await supabase.storage
            .from(this.bucket)
            .upload(`public/${file.name}`, file);

        if (error) {
            throw error;
        }

        if (data) {
            const url = supabase.storage.from(this.bucket).getPublicUrl(data?.path);
            return {
                url: url.data.publicUrl,
                path: data.path,
            };
        }

        throw new Error('File upload failed');
    }

    async deleteFiles(paths: string[]): Promise<void> {
        console.log(paths);
        const { error } = await supabase.storage.from(this.bucket).remove(paths);

        if (error) {
            throw error;
        }
    }
}

export default FileService;
