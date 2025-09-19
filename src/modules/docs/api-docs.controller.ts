import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api-docs')
export class ApiDocsController {
  @Get('yaml')
  getYaml(@Res() res: Response) {
    const filePath = path.join(process.cwd(), 'openapi.yaml');
    const file = fs.readFileSync(filePath, 'utf8');
    res.type('text/yaml').send(file);
  }

  @Get('json')
  getJson(@Res() res: Response) {
    const filePath = path.join(process.cwd(), 'openapi.yaml');
    const yaml = require('js-yaml');
    const doc = yaml.load(fs.readFileSync(filePath, 'utf8'));
    res.json(doc);
  }
}
