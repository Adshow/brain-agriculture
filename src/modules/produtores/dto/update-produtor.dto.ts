import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProdutorDto {
  @ApiPropertyOptional({ example: 'João Silva Atualizado', description: 'Nome do produtor' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({ example: '98765432100', description: 'Novo CPF/CNPJ do produtor' })
  @IsString()
  @IsOptional()
  @Length(11, 14)
  cpfCnpj?: string;
}
