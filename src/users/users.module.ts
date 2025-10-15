import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRoleModule } from 'src/users_role/users_role.module';
import { AuthModule } from 'src/auth/auth.module';
import { SavedPost } from './entities/saved-posts.entity';
import { Visual } from 'src/visuals/entities/visual.entity';
import { Quote } from 'src/quotes/entities/quote.entity';
import { UsersRole } from 'src/users_role/entities/users_role.entity';
import { Audio } from 'src/audios/entities/audio.entity';
import { Note } from './entities/note.entity';
import { Keyword } from 'src/common/entities/keyword.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, UsersRole, SavedPost, Audio, Quote, Visual,Note,Keyword]),UsersRoleModule, forwardRef(() => AuthModule),],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[TypeOrmModule,UsersService]
})
export class UsersModule {}
