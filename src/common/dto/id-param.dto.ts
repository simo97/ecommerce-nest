import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    description: 'UUID identifier',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Invalid ID format' })
  id: string;
}
