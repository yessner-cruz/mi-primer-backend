BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[llaves_acceso] (
    [id] INT NOT NULL IDENTITY(1,1),
    [usuario_asignado] NVARCHAR(100) NOT NULL,
    [token_llave] NVARCHAR(100) NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [llaves_acceso_activo_df] DEFAULT 1,
    [fecha_creacion] DATETIME2 NOT NULL CONSTRAINT [llaves_acceso_fecha_creacion_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [llaves_acceso_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [llaves_acceso_token_llave_key] UNIQUE NONCLUSTERED ([token_llave])
);

-- CreateTable
CREATE TABLE [dbo].[auditoria_acceso] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ruta] NVARCHAR(200) NOT NULL,
    [metodo] NVARCHAR(20) NOT NULL,
    [token_recibido] NVARCHAR(100),
    [resultado] NVARCHAR(50) NOT NULL,
    [ip] NVARCHAR(100),
    [fecha] DATETIME2 NOT NULL CONSTRAINT [auditoria_acceso_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [auditoria_acceso_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
