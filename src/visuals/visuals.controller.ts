import { Controller, Post, Body, UploadedFile, UseInterceptors, Get, Param, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VisualsService } from './visuals.service';
import { CreateVisualDto } from './dto/create-visual.dto';

@Controller('visuals')
export class VisualsController {
  constructor(private readonly visualsService: VisualsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('img_path', {
      storage: diskStorage({
        destination: './uploads/visuals', // folder to store uploaded files
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); 
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadVisual(
    @Body() dto: CreateVisualDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Uploaded file:', file); 
    return this.visualsService.uploadVisual(dto, file);
  }

  @Get(':category')
  async getVisualsByCategory(
    @Param('category') category: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    return this.visualsService.getVisualsByCategory(category, pageNum, limitNum);
  }

}
