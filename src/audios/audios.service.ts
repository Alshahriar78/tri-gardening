import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audio } from './entities/audio.entity';
import { CreateAudioDto } from './dto/create-audio.dto';
import { AudioCategory } from './entities/audio-category.enum';
import { Keyword } from 'src/common/entities/keyword.entity';

@Injectable()
export class AudiosService {
  constructor(
    @InjectRepository(Audio) private readonly audioRepo: Repository<Audio>,
    @InjectRepository(Keyword) private readonly keywordRepo: Repository<Keyword>,
  ) { }

  async uploadAudio(dto: CreateAudioDto, files: any) {
    const img = files.image_path?.[0];
    const audio = files.audio_path?.[0];

    const newAudio = this.audioRepo.create({
      name: dto.name,
      category: dto.category,
      img_path: img?.path,
      audio_path: audio?.path,
    });

    await this.audioRepo.save(newAudio);

    return {
      success: 1,
      data: newAudio,
    };
  }




  async addKeyword(audioId: number, keyword: string) {
    const audio = await this.audioRepo.findOne({
      where: { id: audioId },
      relations: ['keywords'],
    });

    if (!audio) throw new NotFoundException('Audio not found');

    // Check if keyword already exists
    let keywordEntity = await this.keywordRepo.findOne({ where: { name: keyword } });
    if (!keywordEntity) {
      keywordEntity = this.keywordRepo.create({ name: keyword });
      await this.keywordRepo.save(keywordEntity);
    }

    // Add the relation
    audio.keywords.push(keywordEntity);
    await this.audioRepo.save(audio);

    return {
      success: 1,
      message: 'Keyword linked successfully',
    };
  }



  async getAudiosByCategory(category: string, page: number, limit: number) {
    const categoryNumber = AudioCategory[category as keyof typeof AudioCategory];
    if (!categoryNumber) {
      throw new Error(`Invalid category: ${category}`);
    }

    const [data, total] = await this.audioRepo.findAndCount({
      where: { category: categoryNumber },
      relations: ['keywords'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });




    const formattedData = data.map((audio) => ({
      id: audio.id,
      name: audio.name,
      category: category,
      img_path: audio.img_path,
      audio_path: audio.audio_path,
      view_count: audio.view_count,
      keywords: audio.keywords.map((k) => k.name),
    }));



    return { formattedData, total };
  }


}
