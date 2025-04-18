USE [master]
GO
/****** Object:  Database [Menadzer_hasel]    Script Date: 23.03.2025 13:51:55 ******/
CREATE DATABASE [Menadzer_hasel]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Menadzer_hasel', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Menadzer_hasel.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Menadzer_hasel_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Menadzer_hasel_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Menadzer_hasel] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Menadzer_hasel].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Menadzer_hasel] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET ARITHABORT OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Menadzer_hasel] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Menadzer_hasel] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Menadzer_hasel] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Menadzer_hasel] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Menadzer_hasel] SET  MULTI_USER 
GO
ALTER DATABASE [Menadzer_hasel] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Menadzer_hasel] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Menadzer_hasel] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Menadzer_hasel] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Menadzer_hasel] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Menadzer_hasel] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Menadzer_hasel] SET QUERY_STORE = ON
GO
ALTER DATABASE [Menadzer_hasel] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Menadzer_hasel]
GO
/****** Object:  Table [dbo].[Dane]    Script Date: 23.03.2025 13:51:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dane](
	[id_uzytkownika] [int] NULL,
	[witryna] [nchar](10) NULL,
	[login] [nvarchar](50) NULL,
	[nazwa_pliku_z_haslami] [nvarchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Logowania]    Script Date: 23.03.2025 13:51:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Logowania](
	[data] [datetime] NOT NULL,
	[id_uzytkownika] [int] NOT NULL,
	[login] [nvarchar](50) NOT NULL,
	[strona] [nvarchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Uzytkownik]    Script Date: 23.03.2025 13:51:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Uzytkownik](
	[id] [int] NOT NULL,
	[imie] [nvarchar](50) NOT NULL,
	[nazwisko] [nvarchar](50) NOT NULL,
	[login] [nvarchar](50) NOT NULL,
	[hasło] [nvarchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Zaufane]    Script Date: 23.03.2025 13:51:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Zaufane](
	[id] [int] NOT NULL,
	[urzadzenie] [nvarchar](50) NULL,
	[id_uzytkownika] [int] NULL,
	[naglowoek_identyfikacyjny] [nvarchar](max) NULL,
	[czy_zaufany] [bit] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
USE [master]
GO
ALTER DATABASE [Menadzer_hasel] SET  READ_WRITE 
GO
