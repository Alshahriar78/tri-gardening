import { PartialType } from '@nestjs/mapped-types';
import { CreateVisualDto } from './create-visual.dto';

export class UpdateVisualDto extends PartialType(CreateVisualDto) {}
