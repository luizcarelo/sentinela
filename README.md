# Sentinel IP - Guia de Infraestrutura e Produção

Este guia descreve como preparar o ambiente, subir os bancos de dados (PostgreSQL + Redis) e configurar a produção.

---

## 1. Instalação do Docker (Servidor Linux / Debian)

> **⚠️ JÁ TEM DOCKER INSTALADO?**
> Se você já roda outras aplicações neste servidor com Docker, **pule para a etapa 1.1** para verificar versões e conflitos de porta. Não reinstale o Docker.

### 1.1 Verificação (Para quem já tem Docker)
Execute os comandos abaixo para garantir que você tem as versões necessárias:
```bash
docker --version
# Exemplo de saída: Docker version 24.0.5, build ced0996

docker compose version
# Exemplo de saída: Docker Compose version v2.18.1
```
*Se o comando `docker compose` (sem hífen) não funcionar, tente `docker-compose` (com hífen).*

---

### 1.2 Instalação Limpa (Para servidores novos)
Se este é um servidor "zerado" (Debian 11/Bullseye ou 12/Bookworm), siga os passos:

```bash
# Remover versões antigas
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done

# Configurar repositório e chaves
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

## 2. Configuração do Ambiente e Portas

### 2.1 Variáveis de Ambiente
1. Crie o arquivo `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edite e defina senhas seguras:
   ```bash
   nano .env
   ```

### 2.2 Verificando Conflitos de Porta (CRÍTICO)
Como você já tem outras aplicações, verifique se as portas **5432** (Postgres) e **6379** (Redis) estão livres:

```bash
sudo netstat -tulpn | grep -E '5432|6379'
# OU
sudo docker ps --format "table {{.Names}}\t{{.Ports}}"
```

**Se as portas estiverem ocupadas:**
Você precisará alterar o arquivo `docker-compose.yml` para expor o Sentinel em portas diferentes (ex: 5433 e 6380), mantendo a porta interna igual.

*Exemplo de alteração no docker-compose.yml:*
```yaml
  postgres:
    # ...
    ports:
      - "5433:5432" # Muda a porta externa para 5433

  redis:
    # ...
    ports:
      - "6380:6379" # Muda a porta externa para 6380
```

---

## 3. Iniciando os Serviços

Na pasta do projeto:

```bash
# Iniciar os containers em background
sudo docker compose up -d
```

### Verificar Status
```bash
sudo docker compose ps
```
Seus containers devem aparecer como `sentinel_db` e `sentinel_queue`.

---

## 4. Estrutura de Arquivos

Certifique-se de que os arquivos estejam organizados assim no servidor:

```
/opt/sentinel-ip/  (ou sua pasta de preferência)
├── docker-compose.yml
├── .env
└── database/
    └── init.sql      <-- Script SQL (Schema + Seed)
```

---

## 5. Manutenção

### Acessar o Banco via CLI
```bash
sudo docker exec -it sentinel_db psql -U sentinel_admin -d sentinel_core
```

### Logs
```bash
sudo docker compose logs -f
```
