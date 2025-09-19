import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCulturasDto {
  @ApiProperty({
    example: ['Soja', 'Milho'],
    description: 'Lista de culturas a serem adicionadas na safra',
    isArray: true,
    type: String,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  culturas: string[];
}
