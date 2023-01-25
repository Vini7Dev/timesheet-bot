# MULTIFY
[![Multify](./docs/multify-logo.png)](https://codeby.global)

> O **Multify** é um sistema para auxiliar na marcação de horas do *Multidados*, baseando-se no *Clockify*. Segue no decorrer do readme como realizar a instalação.

## 🚀 Instalação

<hr />

### 1) Banco de Dados: Postgres

Para rodar o sistema é preciso de ter o banco de dados **Postgres** instalado e em execução. Recomendo criar uma instância através do *Docker*, mas sinta-se à vontade para instalar na própria máquina.

**Utilizando o Docker:**

Com o Docker instalado, rode o seguinte comando:

*ATENÇÃO: subistitua [container-name] por um nome para a instância/container e o [my-secret-password] pela senha do banco de dados.*

```sh
docker run --name [container-name] -e POSTGRES_PASSWORD=[my-secret-password] -d postgres
```

*OBS: Também existe algumas outras informações que podem ser adicionadas, mas neste contexto isso já é o suficiente.*

<hr />

### 2) Redis

Também é preciso ter em execução o **Redis**, para isso também recomendo executar uma instância no *Docker*, mas é possível instalar diretamente em sua máquina.

**Utilizando o Docker:**

*ATENÇÃO: subistitua [container-name] por um nome para a instância/container.*

```sh
docker run --name [container-name] -p 6379:6379 -d -t redis:alpine
```

*OBS: Também existe algumas outras informações que podem ser adicionadas, mas neste contexto isso já é o suficiente.*

<hr />

### 3) Backend (Server)

#### A) Variáveis Ambiente (.env)

Dentro da pasta **server**, o primeiro passo é criar uma cópia do arquivo *.env.example* no mesmo diretório, porém com o nome *.env* apenas.

Em seguida, preencha as informações de acordo com o seu caso, por exemplo, a senha que definiou no banco de dados e afins. Veja melhor abaixo:

*ATENÇÃO: Não é necessário alterar todos os itens do arquivo, atente-se apenas nos que listarei abaixo.*

- DATABASE_URL: Neste item subistitua *[database-user]* por *postgres* (caso você definiu outro usuário para o banco, utilize este outro), e *[database-password]* pela senha que definiu durante a instalação do banco.

- ENCRYPT_KEY: Subistitua por um texto aleatório, por exemplo *zg49S+doQkiduejNUzD72rPhdgedslzY*

- ENCRYPT_IV: Subistitua por um texto aleatório, por exemplo *4d89e4f5d96f86e4*

- JWT_SECRET: Subistitua por um texto aleatório, por exemplo *zg49S+doQkiduejNUzD72rPhdgedslzY*

#### B) Instalando as Dependências e Rodando as Migrations

Com o terminal aberto na pasta **server**, rode:

```sh
npm install
```
ou
```sh
yarn
```

As **migrations** possuem as tabelas e constraints que devem ser criadas no banco. Para executá-las, rode:

```sh
npm run prisma migrate dev
```
ou
```sh
yarn prisma migrate dev
```

Por fim, rode:

```
npm run prisma generate
```
ou
```
yarn prisma generate
```

<hr />

### 4) Frontend (Web)

Na pasta **web**, basta rodar:

```
npm install
```
ou
```
yarn
```

<hr />

## ☕ Executando o Sistema

Para **executar o sistema** é necessário:

- Ter o **postgres** e o **redis** em execução;
- Abrir um terminal na pasta **server** e outro na pasta **web**.

No terminal da pasta **server**, execute:

```
npm run dev
```
ou
```
yarn dev
```

E no terminal da pasta **web**, execute:

```
npm run start
```
ou
```
yarn start
```



<hr />

## 🚀 Tecnologias, Metodologias e Ferramentas Utilizadas

### Backend

- NodeJS + TypeScript
- GraphQL com Apollo Server
- Socket IO com GraphQL (Apollo Server)
- PostgreSQL
- Redis
- Prisma
- Testes Unitários com Jest + Coverage
- Processamento em Fila com Bull
- Selenium para o Crawler (Bot)
- SOLID
- Clean Code
- ESLint
- Editor Config

### Frontend

- ReactJS + TypeScript
- GraphQL com Apollo Client
- Socket IO com GraphQL (Apollo Client)
- Styled Components
- Clean Code
- ESLint
- Editor Config

[⬆ Voltar ao topo](#multify)<br>
