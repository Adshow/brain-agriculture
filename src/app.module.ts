import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { ProdutorOrmEntity } from './infrastructure/database/entities/produtor.orm-entity';
import { PropriedadeOrmEntity } from './infrastructure/database/entities/propriedade.orm-entity';
import { SafraOrmEntity } from './infrastructure/database/entities/safra.orm-entity';
import { CulturaOrmEntity } from './infrastructure/database/entities/cultura.orm-entity';

// Repositories
import { ProdutorTypeOrmRepository } from './infrastructure/database/repositories/produtor.orm-repository';
import { CulturaTypeOrmRepository } from './infrastructure/database/repositories/cultura.orm-repository';
import { SafraTypeOrmRepository } from './infrastructure/database/repositories/safra.orm-repository';
import { PropriedadeTypeOrmRepository } from './infrastructure/database/repositories/propriedade.orm-repository';

// Controllers
import { ProdutoresController } from './modules/produtores/produtores.controller';
import { CulturasController } from './modules/culturas/culturas.controller';
import { PropriedadesController } from './modules/propriedades/propriedades.controller';
import { SafrasController } from './modules/safras/safras.controller';
import { DashboardController } from './modules/dashboard/dashboard.controller';
import { ApiDocsController } from './modules/docs/api-docs.controller';

// Use Cases
import { CreateProdutorUseCase } from './application/use-cases/produtor/create-produtor.usecase';
import { DeleteProdutorUseCase } from './application/use-cases/produtor/delete-produtor.usecase';
import { UpdateProdutorUseCase } from './application/use-cases/produtor/update-produtor.usecase';
import { AddCulturasUseCase } from './application/use-cases/cultura/add-cultura.usecase';
import { CreatePropriedadeUseCase } from './application/use-cases/propriedade/create-propriedade.usecase';
import { CreateSafraUseCase } from './application/use-cases/safra/create-safra.usecase';
import { FindProdutorByIdUseCase } from './application/use-cases/produtor/find-produtor-by-id.usecase';
import { GetDashboardUseCase } from './application/use-cases/dashboard/get-dashboard.usecase';

//Services
import { DashboardReportService } from './infrastructure/reports/dashboard-report.service';
import { ChartGeneratorService } from './infrastructure/reports/chart-generator.service';
import { PdfBuilderService } from './infrastructure/reports/pdf-builder.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'user',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'agriculture_db',
      entities: [ProdutorOrmEntity, PropriedadeOrmEntity, SafraOrmEntity, CulturaOrmEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ProdutorOrmEntity, PropriedadeOrmEntity, SafraOrmEntity, CulturaOrmEntity]),
  ],
  controllers: [ProdutoresController, CulturasController, PropriedadesController, SafrasController, DashboardController, ApiDocsController],
  providers: [
    ProdutorTypeOrmRepository,
    {
      provide: 'IProdutorRepository',
      useClass: ProdutorTypeOrmRepository,
    },
    CulturaTypeOrmRepository,
    {
      provide: 'ICulturaRepository',
      useClass: CulturaTypeOrmRepository,
    },
    SafraTypeOrmRepository,
    {
      provide: 'ISafraRepository',
      useClass: SafraTypeOrmRepository,
    },
    PropriedadeTypeOrmRepository,
    {
      provide: 'IPropriedadeRepository',
      useClass: PropriedadeTypeOrmRepository,
    },
    {
      provide: CreateProdutorUseCase,
      useFactory: (repository: ProdutorTypeOrmRepository) => new CreateProdutorUseCase(repository),
      inject: [ProdutorTypeOrmRepository],
    },
    {
      provide: UpdateProdutorUseCase,
      useFactory: (repository: ProdutorTypeOrmRepository) => new UpdateProdutorUseCase(repository),
      inject: [ProdutorTypeOrmRepository],
    },
    {
      provide: DeleteProdutorUseCase,
      useFactory: (repository: ProdutorTypeOrmRepository) => new DeleteProdutorUseCase(repository),
      inject: [ProdutorTypeOrmRepository],
    },
    {
      provide: FindProdutorByIdUseCase,
      useFactory: (repository: ProdutorTypeOrmRepository) => new FindProdutorByIdUseCase(repository),
      inject: [ProdutorTypeOrmRepository],
    },
    {
      provide: AddCulturasUseCase,
      useFactory: (safraRepository: SafraTypeOrmRepository, culturaPepository: CulturaTypeOrmRepository) => new AddCulturasUseCase(safraRepository, culturaPepository),
      inject: [SafraTypeOrmRepository, CulturaTypeOrmRepository],
    },
    {
      provide: CreatePropriedadeUseCase,
      useFactory: (propriedadeRepository: PropriedadeTypeOrmRepository, produtorRepository: ProdutorTypeOrmRepository) => new CreatePropriedadeUseCase(propriedadeRepository, produtorRepository),
      inject: [PropriedadeTypeOrmRepository, ProdutorTypeOrmRepository],
    },
    {
      provide: CreateSafraUseCase,
      useFactory: (safraRepository: SafraTypeOrmRepository, propriedadeRepository: PropriedadeTypeOrmRepository) => new CreateSafraUseCase(safraRepository, propriedadeRepository),
      inject: [SafraTypeOrmRepository, PropriedadeTypeOrmRepository],
    },
    {
      provide: GetDashboardUseCase,
      useFactory: (culturaPepository: CulturaTypeOrmRepository, propriedadeRepository: PropriedadeTypeOrmRepository) => new GetDashboardUseCase(propriedadeRepository, culturaPepository),
      inject: [CulturaTypeOrmRepository, PropriedadeTypeOrmRepository],
    },
    DashboardReportService,
    ChartGeneratorService,
    PdfBuilderService
  ],
  exports: [DashboardReportService],

})
export class AppModule { }
