import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProdutorDto {
  @ApiProperty({ example: '12345678900', description: 'CPF ou CNPJ do produtor' })
  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  documento: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do produtor' })
  @IsString()
  @IsNotEmpty()
  nome: string;
}
