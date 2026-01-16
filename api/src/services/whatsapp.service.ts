// import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
// import makeWASocket, {
//   DisconnectReason,
//   useMultiFileAuthState,
//   Browsers,
//   WASocket,
// } from '@whiskeysockets/baileys';
// import { Boom } from '@hapi/boom';
// import QRCode from 'qrcode';
// import * as path from 'path';
// import * as fs from 'fs';

// /**
//  * SERVICE - Lógica de negócio do WhatsApp/Baileys
//  * FLUXO: Controller → Service → Baileys/Database
//  * 
//  * Responsabilidades:
//  * - Gerenciar conexões WhatsApp
//  * - Gerar QR codes e códigos de pareamento
//  * - Enviar e receber mensagens
//  * - Gerenciar sessões de usuários
//  */
// @Injectable()
// export class WhatsappService {
//   private readonly logger = new Logger(WhatsappService.name);
//   private sockets: Map<string, WASocket> = new Map();
//   private sessionPath = path.join(process.cwd(), 'whatsapp_sessions');
//   private qrCodes: Map<string, string> = new Map();

//   constructor() {
//     // Garantir que a pasta de sessões existe
//     if (!fs.existsSync(this.sessionPath)) {
//       fs.mkdirSync(this.sessionPath, { recursive: true });
//       this.logger.log(`Pasta de sessões criada: ${this.sessionPath}`);
//     }
//   }

//   /**
//    * Gera um QR code para autenticação do WhatsApp
//    * @param userId ID do usuário para identificar a sessão
//    * @returns QR code em formato string (base64)
//    */
//   async generateQRCode(userId: string): Promise<{ qrCode: string; userId: string }> {
//     try {
//       this.logger.log(`Gerando QR code para usuário: ${userId}`);

//       const userSessionPath = path.join(this.sessionPath, userId);

//       // Carregar ou criar novo estado de autenticação
//       const { state, saveCreds } = await useMultiFileAuthState(userSessionPath);

//       // Criar socket WhatsApp
//       const socket = makeWASocket({
//         auth: state,
//         printQRInTerminal: false,
//         browser: Browsers.ubuntu('PriceOff WhatsApp Bot'),
//         logger: undefined, // Desabilitar logs do Baileys
//         defaultQueryTimeoutMs: undefined,
//       });

//       // Listener para atualizações de conexão
//       socket.ev.on('connection.update', async (update) => {
//         const { connection, lastDisconnect, qr } = update;

//         // Se gerou QR code, converter para base64
//         if (qr) {
//           try {
//             const qrBase64 = await QRCode.toDataURL(qr);
//             this.qrCodes.set(userId, qrBase64);
//             this.logger.log(`QR code gerado para ${userId}`);
//           } catch (error) {
//             this.logger.error(`Erro ao gerar QR code: ${error.message}`);
//           }
//         }

//         // Se conectou
//         if (connection === 'open') {
//           this.logger.log(`✅ WhatsApp conectado para ${userId}`);
//           this.sockets.set(userId, socket);
//           this.qrCodes.delete(userId);
//         }

//         // Se desconectou
//         if (connection === 'close') {
//           const shouldReconnect =
//             (lastDisconnect?.error as Boom)?.output?.statusCode !==
//             DisconnectReason.loggedOut;

//           if (shouldReconnect) {
//             this.logger.warn(`Reconectando ${userId}...`);
//             setTimeout(() => this.generateQRCode(userId), 3000);
//           } else {
//             this.logger.log(`❌ Usuário ${userId} fez logout`);
//             this.sockets.delete(userId);
//           }
//         }
//       });

//       // Salvar credenciais quando atualizar
//       socket.ev.on('creds.update', saveCreds);

//       // Listener para mensagens recebidas
//       socket.ev.on('messages.upsert', async ({ messages }) => {
//         for (const message of messages) {
//           if (!message.key.fromMe) {
//             this.logger.log(
//               `Mensagem recebida de ${message.key.remoteJid}: ${message.message?.conversation}`
//             );
//             // Aqui você pode processar mensagens recebidas
//           }
//         }
//       });

//       // Retornar QR code se disponível ou vazio
//       const qrCode = this.qrCodes.get(userId) || '';

//       return {
//         qrCode,
//         userId,
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao gerar QR code: ${error.message}`);
//       throw new InternalServerErrorException(
//         `Erro ao gerar QR code: ${error.message}`
//       );
//     }
//   }

//   /**
//    * Solicita um código de pareamento para conectar via código
//    * @param phoneNumber Número de telefone do usuário
//    * @returns Código de pareamento
//    */
//   async requestPairingCode(phoneNumber: string): Promise<{ code: string }> {
//     try {
//       this.logger.log(`Solicitando código de pareamento para: ${phoneNumber}`);

//       // Limpar número de telefone
//       const cleanPhone = phoneNumber.replace(/\D/g, '');

//       const userSessionPath = path.join(this.sessionPath, `pairing_${cleanPhone}`);
//       const { state, saveCreds } = await useMultiFileAuthState(userSessionPath);

//       const socket = makeWASocket({
//         auth: state,
//         browser: Browsers.ubuntu('PriceOff WhatsApp Bot'),
//         logger: undefined,
//       });

//       // Verificar se já tem credenciais
//       if (!socket.authState.creds.registered) {
//         const code = await socket.requestPairingCode(cleanPhone);
//         this.logger.log(`Código de pareamento gerado: ${code}`);

//         socket.ev.on('creds.update', saveCreds);

//         return { code };
//       }

//       throw new BadRequestException(
//         'Dispositivo já está registrado. Use o QR code ao invés disso.'
//       );
//     } catch (error) {
//       this.logger.error(`Erro ao solicitar código de pareamento: ${error.message}`);
//       throw new InternalServerErrorException(
//         `Erro ao solicitar código: ${error.message}`
//       );
//     }
//   }

//   /**
//    * Obtém o status de conexão do WhatsApp
//    * @param userId ID do usuário (opcional)
//    * @returns Status da conexão
//    */
//   async getConnectionStatus(userId?: string): Promise<{
//     isConnected: boolean;
//     phoneNumber?: string;
//     connectedAt?: Date;
//   }> {
//     try {
//       if (userId) {
//         // Status de um usuário específico
//         const socket = this.sockets.get(userId);

//         if (!socket) {
//           return {
//             isConnected: false,
//             phoneNumber: undefined,
//           };
//         }

//         const phoneNumber = socket.user?.id?.split('@')[0];

//         return {
//           isConnected: true,
//           phoneNumber,
//           connectedAt: new Date(),
//         };
//       }

//       // Status de todas as conexões
//       const totalConnected = this.sockets.size;

//       return {
//         isConnected: totalConnected > 0,
//         phoneNumber: totalConnected > 0 ? `${totalConnected} conexões ativas` : undefined,
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao obter status: ${error.message}`);
//       throw new InternalServerErrorException(
//         `Erro ao obter status: ${error.message}`
//       );
//     }
//   }

//   /**
//    * Desconecta uma sessão WhatsApp
//    * @param userId ID do usuário
//    */
//   async disconnectWhatsApp(userId: string): Promise<void> {
//     try {
//       const socket = this.sockets.get(userId);

//       if (!socket) {
//         throw new BadRequestException(`Nenhuma sessão ativa para ${userId}`);
//       }

//       await socket.logout();
//       this.sockets.delete(userId);
//       this.qrCodes.delete(userId);

//       this.logger.log(`✅ Desconectado: ${userId}`);
//     } catch (error) {
//       this.logger.error(`Erro ao desconectar: ${error.message}`);
//       throw new InternalServerErrorException(
//         `Erro ao desconectar: ${error.message}`
//       );
//     }
//   }

//   /**
//    * Envia uma mensagem de texto via WhatsApp
//    * @param phoneNumber Número de telefone do destinatário
//    * @param message Texto da mensagem
//    * @param caption Caption (opcional)
//    * @returns ID da mensagem enviada
//    */
//   async sendMessage(
//     phoneNumber: string,
//     message: string,
//     caption?: string
//   ): Promise<{ messageId: string }> {
//     try {
//       // Encontrar a primeira socket conectada (você pode melhorar essa lógica)
//       if (this.sockets.size === 0) {
//         throw new BadRequestException(
//           'Nenhuma sessão WhatsApp conectada. Faça login primeiro.'
//         );
//       }

//       const socket = Array.from(this.sockets.values())[0];
//       const jid = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@s.whatsapp.net`;

//       this.logger.log(`Enviando mensagem para ${jid}: ${message}`);

//       const result = await socket.sendMessage(jid, { text: message });

//       return {
//         messageId: result.key.id || 'unknown',
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao enviar mensagem: ${error.message}`);
//       throw new InternalServerErrorException(
//         `Erro ao enviar mensagem: ${error.message}`
//       );
//     }
//   }

//   /**
//    * Obtém informações da sessão WhatsApp conectada
//    * @returns Informações da sessão
//    */
//   async getSessionInfo(): Promise<{
//     isConnected: boolean;
//     userSessions: Array<{ userId: string; phoneNumber?: string }>;
//   }> {
//     try {
//       const userSessions = Array.from(this.sockets.entries()).map(
//         ([userId, socket]) => ({
//           userId,
//           phoneNumber: socket.user?.id?.split('@')[0],
//         })
//       );

//       return {
//         isConnected: this.sockets.size > 0,
//         userSessions,
//       };
//     } catch (error) {
//       this.logger.error(`Erro ao obter info da sessão: ${error.message}`);
//       throw new InternalServerErrorException(
//         `Erro ao obter informações: ${error.message}`
//       );
//     }
//   }

//   /**
//    * Obtém o QR code gerado
//    * @param userId ID do usuário
//    * @returns QR code em base64
//    */
//   getQRCode(userId: string): string | undefined {
//     return this.qrCodes.get(userId);
//   }

//   /**
//    * Lista todas as sessões ativas
//    * @returns Array de IDs de usuários conectados
//    */
//   getActiveSessions(): string[] {
//     return Array.from(this.sockets.keys());
//   }
// }
