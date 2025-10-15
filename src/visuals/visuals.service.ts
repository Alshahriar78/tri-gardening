import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visual } from './entities/visual.entity';
import { CreateVisualDto } from './dto/create-visual.dto';
import { VisualCategory } from './entities/visual-category';

@Injectable()
export class VisualsService {
  constructor(
    @InjectRepository(Visual)
    private readonly visualRepo: Repository<Visual>,
  ) {}

  async uploadVisual(dto: CreateVisualDto, file: Express.Multer.File) {
    if (!file) {
      throw new Error('Visual file is required');
    }

    const visual = this.visualRepo.create({
      img_path: file.path, 
      category: dto.category,
    });

    await this.visualRepo.save(visual);

    return {
      success: 1,
      data: visual,
    };
  }

  async getVisualsByCategory(category: string, page: number, limit: number) {
    
    const categoryEnum:number = VisualCategory[category.toUpperCase() as keyof typeof VisualCategory];
    if (!categoryEnum) {
      throw new Error(`Invalid category: ${category}`);
    }

    const [data, total] = await this.visualRepo.findAndCount({
      where: { category: categoryEnum },
      relations: ['keywords'], 
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    const formattedData = data.map((visual) => ({
      id: visual.id,
      image_path: visual.img_path, 
      view_count: visual.view_count,
      keywords: visual.keywords?.map((k) => k.name) || [],
    }));

    return {
      status: 'success',
      data: formattedData,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
