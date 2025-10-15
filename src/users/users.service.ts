import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRole } from 'src/users_role/entities/users_role.entity';
import * as bcrypt from 'bcrypt'
import { SavedPost } from './entities/saved-posts.entity';
import { Quote } from 'src/quotes/entities/quote.entity';
import { Visual } from 'src/visuals/entities/visual.entity';
import { Audio } from 'src/audios/entities/audio.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './entities/note.entity';
import { Keyword } from 'src/common/entities/keyword.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UsersRole)
    private readonly userRoleRepo: Repository<UsersRole>,
    @InjectRepository(SavedPost)
    private readonly savedPostRepo: Repository<SavedPost>,
    @InjectRepository(Audio)
    private readonly audioRepo: Repository<Audio>,
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    @InjectRepository(Visual)
    private readonly visualRepo: Repository<Visual>,
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(Keyword)
    private readonly keywordRepo: Repository<Keyword>
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { role_id: roleEntity, password, email, ...userData } = createUserDto;
    const isAlreadyUser = await this.userRepo.findOne({ where: { email: email } })
    if (isAlreadyUser) throw new Error(`Users Already In Registered. Please Login`)
    const saltRounds = 10;
    const pass = await bcrypt.hash(password, saltRounds);
    const role_id = await this.userRoleRepo.createQueryBuilder("role")
      .where("role.id = :id", { id: roleEntity || 2 })
      .select(["role.id AS id", "role.name name"])
      .getRawOne();
    if (!role_id) {
      throw new Error('Default role not found');
    }
    const data = this.userRepo.create({ ...userData, email, role_id, password: pass });
    return await this.userRepo.save(data);

  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    const data = await this.userRepo.findOne({ where: { id } });
    if (!data) throw new NotFoundException(`User with ID ${id} not found`);
    return data;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    const data = await this.userRepo.findOne({ where: { email: email } });
    console.log(data?.email)
    return data;
  }


  async savePost(user: User, item: 'audio' | 'quote' | 'visual', id: number) {
    const savedPost = new SavedPost();
    savedPost.user = user;

    if (item === 'audio') {
      const audio = await this.audioRepo.findOne({ where: { id } });
      if (!audio) throw new NotFoundException('Audio not found');
      savedPost.audio = audio;
    } else if (item === 'quote') {
      const quote = await this.quoteRepo.findOne({ where: { id } });
      if (!quote) throw new NotFoundException('Quote not found');
      savedPost.quote = quote;
    } else if (item === 'visual') {
      const visual = await this.visualRepo.findOne({ where: { id } });
      if (!visual) throw new NotFoundException('Visual not found');
      savedPost.visual = visual;
    } else {
      throw new Error('Invalid item type');
    }

    await this.savedPostRepo.save(savedPost);

    return {
      status: 'success',
      message: 'Post saved',
    };
  }

  async getSavedPosts(userId: number) {
    const savedPosts = await this.savedPostRepo.find({
      where: { user: { id: userId } },
      relations: ['audio', 'audio.keywords', 'quote', 'quote.keywords', 'visual', 'visual.keywords'],
    });

    const audios = savedPosts
      .filter(sp => sp.audio)
      .map(sp => sp.audio)
      .map(a => ({
        id: a.id,
        name: a.name,
        img_path: a.img_path,
        audio_path: a.audio_path,
        view_count: a.view_count,
        keywords: a.keywords.map(k => k.name),
      }));

    const quotes = savedPosts
      .filter(sp => sp.quote)
      .map(sp => sp.quote)
      .map(q => ({
        id: q.id,
        is_text: q.is_text,
        quote: q.quote,
        view_count: q.view_count,
        keywords: q.keywords.map(k => k.name),
      }));

    const visuals = savedPosts
      .filter(sp => sp.visual)
      .map(sp => sp.visual)
      .map(v => ({
        id: v.id,
        image_path: v.img_path,
        view_count: v.view_count,
        category: v.category,
        keywords: v.keywords.map(k => k.name),
      }));

    return {
      status: 'success',
      data: { audios, quotes, visuals },
    };
  }


  async createNote(userId: number, dto: CreateNoteDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const note = this.noteRepo.create({
      note: dto.note,
      title: dto.title,
      user,
    });

    await this.noteRepo.save(note);

    return {
      status: 'success',
      message: 'Note saved',
    };
  }

  async getUserNotes(userId: number) {
    const notes = await this.noteRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });

    const formattedNotes = notes.map((note) => ({
      id: note.id,
      title: note.title || null,
      note: note.note,
      date: note.createdAt ? note.createdAt.toISOString().split('T')[0] : null,
    }));

    return {
      status: 'success',
      data: formattedNotes,
    };
  }

  async updateNote(
    noteId: number,
    userId: number,
    body: { note: string; title?: string },
  ): Promise<boolean> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, user: { id: userId } }, // ensure user owns the note
    });

    if (!note) return false;

    note.note = body.note;
    if (body.title !== undefined) note.title = body.title;

    await this.noteRepo.save(note);
    return true;
  }


  async getPostsByKeyword(
    keyword: string,
    audioPagination: { page: number; limit: number },
    quotePagination: { page: number; limit: number },
    visualPagination: { page: number; limit: number },
  ) {
    // Find keyword entity
    const keywordEntity = await this.keywordRepo.findOne({ where: { name: keyword } });
    if (!keywordEntity) {
      return { audios: [], quotes: [], visuals: [] };
    }

    // Audios
    const [audios] = await this.audioRepo
      .createQueryBuilder('audio')
      .leftJoinAndSelect('audio.keywords', 'keyword')
      .where('keyword.id = :id', { id: keywordEntity.id })
      .skip((audioPagination.page - 1) * audioPagination.limit)
      .take(audioPagination.limit)
      .getManyAndCount();

    // Quotes
    const [quotes] = await this.quoteRepo
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.keywords', 'keyword')
      .where('keyword.id = :id', { id: keywordEntity.id })
      .skip((quotePagination.page - 1) * quotePagination.limit)
      .take(quotePagination.limit)
      .getManyAndCount();

    
    const [visuals] = await this.visualRepo
      .createQueryBuilder('visual')
      .leftJoinAndSelect('visual.keywords', 'keyword')
      .where('keyword.id = :id', { id: keywordEntity.id })
      .skip((visualPagination.page - 1) * visualPagination.limit)
      .take(visualPagination.limit)
      .getManyAndCount();

   
    const format = (items) =>
      items.map((i) => ({
        ...i,
        keywords: i.keywords?.map((k) => k.name) || [],
      }));

    return {
      audios: format(audios),
      quotes: format(quotes),
      visuals: format(visuals),
    };
  }


  async incrementView(
    item: 'audio' | 'quote' | 'visual',
    itemId: number,
  ): Promise<void> {
    let repo;
    switch (item) {
      case 'audio':
        repo = this.audioRepo;
        break;
      case 'quote':
        repo = this.quoteRepo;
        break;
      case 'visual':
        repo = this.visualRepo;
        break;
      default:
        throw new NotFoundException('Invalid item type');
    }

    const entity = await repo.findOne({ where: { id: itemId } });
    if (!entity) throw new NotFoundException(`${item} not found`);

    entity.view_count = (entity.view_count || 0) + 1;
    await repo.save(entity);
  }

}
