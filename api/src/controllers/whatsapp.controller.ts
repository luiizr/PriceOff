import { Controller, Post, Get, Body, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException, Query } from '@nestjs/common';
import { WhatsappService } from '../services/whatsapp.service';
import { LoginDto, LoginResponseDto, RegisterDto } from '../dto/auth.dto';
import {
  QRCodeResponseDto,
  PairingCodeDto,
  PairingCodeResponseDto,
  WhatsAppStatusDto,
  SendMessageDto,
  SendMessageResponseDto,
  DisconnectResponseDto,
  WhatsAppResponseDto,
  WhatsappAuthDto
} from '../dto/whatsapp.dto';

/**
 * CONTROLLER - Define rotas e processa requisições
 * FLUXO: Request → Controller → Service → Repository → Database
 * 
 * Rotas de Autenticação WhatsApp:
 * - POST /whatsapp/qr-code - Gera QR code para autenticação
 * - GET /whatsapp/status - Verifica status da conexão
 * - POST /whatsapp/pair-code - Solicita código de pareamento
 * - POST /whatsapp/disconnect - Desconecta do WhatsApp
 * - POST /whatsapp/send-message - Envia mensagem
 */
@Controller('whatsapp')
export class AuthController {
  constructor(private readonly wppService: WhatsappService) {}

  /**
   * POST /whatsapp/qr-code
   * Gera um QR code para autenticação no WhatsApp
   * O usuário deve escanear esse QR code com seu WhatsApp
   */
  @Post('qr-code')
  @HttpCode(HttpStatus.OK)
  async generateQRCode(@Body() whatsappAuthDto: WhatsappAuthDto): Promise<QRCodeResponseDto> {
    try {
      if (!whatsappAuthDto.userId || !whatsappAuthDto.phoneNumber) {
        throw new BadRequestException('userId e phoneNumber são obrigatórios');
      }

      // O service irá gerar o QR code usando Baileys
      const qrData = await this.wppService.generateQRCode(whatsappAuthDto.userId);

      return {
        qrCode: qrData.qrCode,
        message: 'QR code gerado com sucesso. Escaneie com seu WhatsApp',
        status: 'pending'
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao gerar QR code: ${error.message}`
      );
    }
  }

  /**
   * GET /whatsapp/status
   * Retorna o status atual da conexão WhatsApp
   * Query params: userId (opcional para obter status específico)
   */
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getStatus(@Query('userId') userId?: string): Promise<WhatsAppStatusDto> {
    try {
      const status = await this.wppService.getConnectionStatus(userId);

      return {
        isConnected: status.isConnected,
        phoneNumber: status.phoneNumber,
        status: status.isConnected ? 'connected' : 'disconnected',
        connectedAt: status.connectedAt
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao obter status: ${error.message}`
      );
    }
  }

  /**
   * POST /whatsapp/pair-code
   * Solicita um código de pareamento ao invés de usar QR code
   * Útil para conectar via código em vez de QR
   */
  @Post('pair-code')
  @HttpCode(HttpStatus.CREATED)
  async requestPairingCode(
    @Body() pairingCodeDto: PairingCodeDto
  ): Promise<PairingCodeResponseDto> {
    try {
      if (!pairingCodeDto.phoneNumber) {
        throw new BadRequestException('phoneNumber é obrigatório');
      }

      // Validar formato do número de telefone (deve estar sem símbolos)
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(pairingCodeDto.phoneNumber.replace(/\D/g, ''))) {
        throw new BadRequestException(
          'Número de telefone inválido. Use formato: país + DDD + número (ex: 5511999999999)'
        );
      }

      const pairingData = await this.wppService.requestPairingCode(
        pairingCodeDto.phoneNumber
      );

      return {
        pairingCode: pairingData.code,
        phoneNumber: pairingCodeDto.phoneNumber,
        message: 'Código de pareamento gerado. Acesse WhatsApp > Dispositivos conectados > Conectar dispositivo'
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao solicitar código de pareamento: ${error.message}`
      );
    }
  }

  /**
   * POST /whatsapp/disconnect
   * Desconecta a sessão do WhatsApp
   * Query params: userId (obrigatório)
   */
  @Post('disconnect')
  @HttpCode(HttpStatus.OK)
  async disconnect(@Query('userId') userId: string): Promise<DisconnectResponseDto> {
    try {
      if (!userId) {
        throw new BadRequestException('userId é obrigatório como query parameter');
      }

      await this.wppService.disconnectWhatsApp(userId);

      return {
        success: true,
        message: 'Desconectado do WhatsApp com sucesso',
        disconnectedAt: new Date()
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao desconectar: ${error.message}`
      );
    }
  }

  /**
   * POST /whatsapp/send-message
   * Envia uma mensagem de texto via WhatsApp
   */
  @Post('send-message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto
  ): Promise<SendMessageResponseDto> {
    try {
      if (!sendMessageDto.phoneNumber || !sendMessageDto.message) {
        throw new BadRequestException(
          'phoneNumber e message são obrigatórios'
        );
      }

      // Validar formato do número de telefone
      const phoneRegex = /^\d{10,15}$/;
      const cleanPhone = sendMessageDto.phoneNumber.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        throw new BadRequestException(
          'Número de telefone inválido'
        );
      }

      const result = await this.wppService.sendMessage(
        sendMessageDto.phoneNumber,
        sendMessageDto.message,
        sendMessageDto.caption
      );

      return {
        success: true,
        messageId: result.messageId,
        sentAt: new Date(),
        phoneNumber: sendMessageDto.phoneNumber
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao enviar mensagem: ${error.message}`
      );
    }
  }

  /**
   * GET /whatsapp/info
   * Retorna informações da sessão WhatsApp conectada
   */
  @Get('info')
  @HttpCode(HttpStatus.OK)
  async getSessionInfo(): Promise<WhatsAppResponseDto> {
    try {
      const info = await this.wppService.getSessionInfo();

      return {
        success: true,
        message: 'Informações da sessão',
        data: info
      };
    } catch (error) {
      return {
        success: false,
        message: 'Nenhuma sessão ativa',
        error: error.message
      };
    }
  }
}