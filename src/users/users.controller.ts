import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Request, Req, NotFoundException, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthService } from 'src/auth/auth.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return {
      status: 'success',
      message: 'Registration successful',
    };
  }


  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const user = await this.authService.validateUser(signInDto.email, signInDto.pass)
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return await this.authService.signIn(user.email, user.password);

  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req)
    return req.user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @Get('get-user-by/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Post('saved/:item/:id')
  async savePost(
    @Req() req,
    @Param('item') item: 'audio' | 'quote' | 'visual',
    @Param('id') id: number,
  ) {
    const user = req.user; 
    return this.usersService.savePost(user, item, Number(id));
  }


  @UseGuards(AuthGuard)
  @Get('saved')
  async getSavedPosts(@Req() req) {
    const userId = req.user.id; 
    return this.usersService.getSavedPosts(userId);
  }

  @UseGuards(AuthGuard)
  @Post('notes/upload')
  async createNote(@Req() req, @Body() dto: CreateNoteDto) {
    const userId = req.user.id;
    return this.usersService.createNote(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Get('notes')
  async getNotes(@Req() req) {
    const userId = req.user.id;
    return this.usersService.getUserNotes(userId);
  }

  @UseGuards(AuthGuard)
  @Put('update/:note_id')
  async updateNote(
    @Param('note_id') noteId: number,
    @Body() body: { note: string; title?: string },
    @Req() req,
  ) {
    const userId = req.user.id; 

    const updated = await this.usersService.updateNote(noteId, userId, body);
    if (!updated) {
      throw new NotFoundException('Note not found or you are not authorized');
    }

    return {
      status: 'success',
      message: 'Note updated',
    };
  }

  @Get('keywords/:keyword')
  async getByKeyword(
    @Param('keyword') keyword: string,
    @Query('audio_page') audioPage = 1,
    @Query('audio_limit') audioLimit = 10,
    @Query('quote_page') quotePage = 1,
    @Query('quote_limit') quoteLimit = 10,
    @Query('visual_page') visualPage = 1,
    @Query('visual_limit') visualLimit = 10,
  ) {
    const data = await this.usersService.getPostsByKeyword(
      keyword,
      {
        page: Number(audioPage),
        limit: Number(audioLimit),
      },
      {
        page: Number(quotePage),
        limit: Number(quoteLimit),
      },
      {
        page: Number(visualPage),
        limit: Number(visualLimit),
      },
    );

    return {
      status: 'success',
      data,
    };
  }


  @Put('view/:item/:item_id')
  async increaseView(
    @Param('item') item: 'audio' | 'quote' | 'visual',
    @Param('item_id') itemId: number,
  ) {
    await this.usersService.incrementView(item, itemId);
    return {
      status: 'success',
      message: 'View updated',
    };
  }
}


