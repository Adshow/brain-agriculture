# 🌱 Brain Agriculture

## 🚀 Visão Geral
Este projeto é uma aplicação **NestJS** estruturada em **Arquitetura Hexagonal (Clean Architecture)** para gerenciar produtores rurais, suas propriedades, safras e culturas.  

Além do CRUD completo dessas entidades, o sistema gera **relatórios** com estatísticas de uso do solo e distribuições por estado e cultura.

---

## 📂 Estrutura do Projeto
- **`src/domain`** → Entidades e interfaces de repositórios (regras de negócio).
- **`src/application`** → Casos de uso (use cases).
- **`src/infrastructure`** → Banco de dados, relatórios e serviços externos.
- **`src/modules`** → Controllers e DTOs (interface HTTP).

---

## 🛠️ Tecnologias Utilizadas
- [NestJS](https://nestjs.com/) (TypeScript)
- [TypeORM](https://typeorm.io/) + PostgreSQL
- [Docker](https://www.docker.com/) + Docker Compose
- [Jest](https://jestjs.io/) para testes

---

## ⚙️ Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- [Docker + Docker Compose](https://docs.docker.com/)

---

## ▶️ Como rodar

### 1. Clone o repositório
```bash
git clone https://github.com/Adshow/brain-agriculture.git
cd brain-agricultura
```
###  2. Subir os containers

No diretório do projeto, rode:

```bash
docker-compose up --build -d
```

Isso vai iniciar a API e o Banco
- API → http://localhost:3000
- Postgres → localhost:5432

## 📖 Documentação da API

A especificação OpenAPI está disponível diretamente no projeto:

- [OpenAPI](http://localhost:3000/docs)
