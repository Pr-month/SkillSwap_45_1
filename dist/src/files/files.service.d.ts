export declare class FilesService {
    saveFile(file: Express.Multer.File): {
        message: string;
        url: string;
        originalName: string;
        size: number;
        mimeType: string;
    };
}
