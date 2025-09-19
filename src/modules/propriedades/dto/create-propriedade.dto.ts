import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropriedadeDto {
  @ApiProperty({ example: 'Fazenda Boa Vista', description: 'Nome da propriedade' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Luís Eduardo Magalhães', description: 'Cidade onde está localizada a propriedade' })
  @IsNotEmpty()
  @IsString()
  cidade: string;

  @ApiProperty({ example: 'Bahia', description: 'Estado da propriedade' })
  @IsNotEmpty()
  @IsString()
  estado: string;

  @ApiProperty({ example: 150, description: 'Área total da propriedade em hectares' })
  @IsNumber()
  areaTotal: number;

  @ApiProperty({ example: 120, description: 'Área agricultável da propriedade em hectares' })
  @IsNumber()
  areaAgricultavel: number;

  @ApiProperty({ example: 30, description: 'Área de vegetação da propriedade em hectares' })
  @IsNumber()
  areaVegetacao: number;

  @ApiProperty({ example: 'a8eb2f5c-24a9-459a-8c34-0d618efdb418', description: 'ID do produtor dono da propriedade' })
  @IsNotEmpty()
  @IsString()
  produtorId: string;
}
