import supabase from '../../database';
import { v4 as uuidv4 } from 'uuid';

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

    async uploadFile(file: File): Promise<string> {
        const { data, error } = await supabase.storage
            .from(this.bucket)
            .upload(`${this.userId}/${uuidv4()}-${file.name}`, file);

        if (data) {
            return data.path;
        }

        return Promise.reject(error);
    }

    async deleteFiles(paths: string[]): Promise<void> {
        const { error } = await supabase.storage.from(this.bucket).remove(paths);

        if (error) {
            throw error;
        }
    }
}

export default FileService;
