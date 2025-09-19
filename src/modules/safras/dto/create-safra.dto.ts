import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSafraDto {
  @ApiProperty({ example: 'Safra de Soja 2025', description: 'Nome da safra' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 2025, description: 'Ano da safra' })
  @IsNotEmpty()
  @IsInt()
  ano: number;

  @ApiProperty({ example: 'a8eb2f5c-24a9-459a-8c34-0d618efdb418', description: 'ID da propriedade vinculada à safra' })
  @IsNotEmpty()
  @IsString()
  propriedadeId: string;
}
