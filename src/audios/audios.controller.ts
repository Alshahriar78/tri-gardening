import { Controller, Post, Body, UploadedFiles, UseInterceptors, Param, Get, Query } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AudiosService } from './audios.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { extname } from 'path';
import { CreateKeywordDto } from './dto/create-keyword.dto';

@Controller('audios')
export class AudiosController {
  constructor(private readonly audiosService: AudiosService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image_path', maxCount: 1 },
        { name: 'audio_path', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads', 
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async uploadAudio(
    @Body() dto: CreateAudioDto,
    @UploadedFiles()
    files: {
      image_path?: Express.Multer.File[];
      audio_path?: Express.Multer.File[];
    },
  ) {
    return this.audiosService.uploadAudio(dto, files);
  }


  @Post('keyword/:audio_id')
  async addKeyword(
    @Param('audio_id') audioId: number,
    @Body() dto: CreateKeywordDto
  ) {
    return this.audiosService.addKeyword(audioId, dto.keyword);
  }

  @Get(':category')
  async getAudiosByCategory(
    @Param('category') category: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { formattedData, total } = await this.audiosService.getAudiosByCategory(category, +page, +limit);

    return {
      status: 'success',
      formattedData,
      pagination: {
        total,
        page: +page,
        limit: +limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
