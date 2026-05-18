const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const P = require("pino")
const qrcode = require("qrcode-terminal")

const askOllama = require("./services/ollama")

const ADMIN = "5575991534447@s.whatsapp.net"

let botAtivo = true
const usuariosAtendidos = new Set()

async function startBot() {

  const { state, saveCreds } =
    await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: false,
    syncFullHistory: false,
    logger: P({ level: "silent" })
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {

    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.clear()
      console.log("ESCANEIE O QR CODE:\n")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      console.log("WHATSAPP CONECTADO")
      console.log("Agent do Nadson ONLINE")
    }

    if (connection === "close") {

      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut

      console.log("CONEXÃO FECHADA")

      if (shouldReconnect) startBot()
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {

    try {

      const msg = messages[0]
      if (!msg.message) return

      const texto =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text

      if (!texto) return

      const numero = msg.key.remoteJid

      const numeroAdmin =
        ADMIN.replace("@s.whatsapp.net", "")

      const numeroMensagem =
        numero.replace("@s.whatsapp.net", "")

      // =========================
      // COMANDOS ADMIN
      // =========================

      if (
        msg.key.fromMe ||
        numeroMensagem.includes(numeroAdmin)
      ) {

        if (texto === "/off") {
          botAtivo = false

          await sock.sendMessage(numero, {
            text: "🤖 Agent do Nadson desativado."
          })

          return
        }

        if (texto === "/on") {
          botAtivo = true

          await sock.sendMessage(numero, {
            text: "🤖 Agent do Nadson ativado."
          })

          return
        }
      }

      if (msg.key.fromMe) return
      if (numero.includes("@g.us")) return
      if (!botAtivo) return

      console.log("\nMensagem:")
      console.log(texto)

      // =========================
      // PRIMEIRA MENSAGEM
      // =========================

      if (!usuariosAtendidos.has(numero)) {

        usuariosAtendidos.add(numero)

        const nome = msg.pushName || "amigo"

        await sock.sendMessage(numero, {
          text:
`👋 Olá, ${nome}!

Eu sou o Agent do Nadson.

Se meu Tutor Nadson demorar de responder, provavelmente está ocupado com alguma tarefa.

Assim que ele retornar, aviso a ele 🙂`
        })

        return
      }

      // =========================
      // RESPOSTAS RÁPIDAS
      // =========================

      const respostaBaixa =
        texto.toLowerCase().trim()

      if (
        respostaBaixa === "não" ||
        respostaBaixa === "nao" ||
        respostaBaixa === "n"
      ) {

        await sock.sendMessage(numero, {
          text: "Certo, qualquer coisa me avisa 🙂"
        })

        return
      }

      if (
        respostaBaixa === "sim" ||
        respostaBaixa === "s" ||
        respostaBaixa === "claro"
      ) {

        await sock.sendMessage(numero, {
          text: "Em que posso lhe ajudar? 🙂"
        })

        return
      }

      await sock.sendPresenceUpdate("composing", numero)

      // =========================
      // IA (SEPARADA)
      // =========================

      const ia = await askOllama(texto)

      console.log("\nIA:")
      console.log(ia)

      await sock.sendMessage(numero, {
        text: ia
      })

    } catch (erro) {

      console.log("\nERRO:")
      console.log(erro.message)
    }
  })
}

startBot()