import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('quote', {
      storage: diskStorage({
        destination: './uploads/quotes', // Folder path to store uploaded files
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); 
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadQuote(
    @Body() dto: CreateQuoteDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Uploaded file:', file);
    return this.quotesService.uploadQuote(dto, file);
  }

  @Get(':category')
  async getQuotesByCategory(
    @Param('category') category: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    // Convert page and limit to numbers safely
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const result = await this.quotesService.getQuotesByCategory(
      category,
      pageNum,
      limitNum,
    );

    return result;
  }
}

