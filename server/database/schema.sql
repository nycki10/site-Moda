-- ==========================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS E TABELAS
-- PROJETO: ATELIÊ & LINHA
-- ==========================================================

-- 1. Criar o Banco de Dados se não existir
CREATE DATABASE IF NOT EXISTS `atelie_moda` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `atelie_moda`;

-- 2. Tabela de Usuários (Com suporte a Roles: user, premium, admin)
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `senha` VARCHAR(255) NOT NULL,
    `role` ENUM('user', 'premium', 'admin') DEFAULT 'user',
    `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela de Produtos / Moldes (Com suporte a JSON para imagens e medidas)
CREATE TABLE IF NOT EXISTS `produtos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `categoria` VARCHAR(100) NOT NULL,
    `imagem` TEXT NOT NULL,
    `imagens` JSON NOT NULL,
    `tecido` VARCHAR(100) NOT NULL,
    `dificuldade` VARCHAR(50) NOT NULL,
    `acabamento` VARCHAR(100) NOT NULL,
    `detalhesTecido` TEXT,
    `detalhesAcabamento` TEXT,
    `descricao` TEXT NOT NULL,
    `medidas` JSON NOT NULL,
    `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
