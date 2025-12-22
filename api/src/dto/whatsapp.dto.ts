import { IsString, IsPhoneNumber, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

/**
 * DTO para Whatsapp
 */
export class WhatsappAuthDto {
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

/**
 * DTO para QR Code
 */
export class QRCodeResponseDto {
    qrCode: string;
    message: string;
    status: 'pending' | 'connected' | 'disconnected';
}

/**
 * DTO para Pairing Code
 */
export class PairingCodeDto {
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;
}

export class PairingCodeResponseDto {
    pairingCode: string;
    phoneNumber: string;
    message: string;
}

/**
 * DTO para Status da Conexão
 */
export class WhatsAppStatusDto {
    isConnected: boolean;
    phoneNumber?: string;
    status: 'connected' | 'disconnected' | 'connecting' | 'qr_scan_required';
    connectedAt?: Date;
}

/**
 * DTO para enviar mensagem
 */
export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsString()
    caption?: string;
}

export class SendMessageResponseDto {
    success: boolean;
    messageId: string;
    sentAt: Date;
    phoneNumber: string;
}

/**
 * DTO para desconexão
 */
export class DisconnectResponseDto {
    success: boolean;
    message: string;
    disconnectedAt: Date;
}

/**
 * DTO para resposta genérica do WhatsApp
 */
export class WhatsAppResponseDto<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
