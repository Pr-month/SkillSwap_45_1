import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File): {
        message: string;
        url: string;
        originalName: string;
        size: number;
        mimeType: string;
    };
}
