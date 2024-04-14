import 'dotenv/config'
import { eventEmitter } from "./event-emitter";
import { formatDateToLocale } from "./utils";

import app from "./server";

app.listen(process.env.PORT, async () => console.log(`🤖 Server is running on port ${process.env.PORT}  ${formatDateToLocale()}`))

eventEmitter.on('crawler:started', () => {
  console.log(`🔍 Crawler started ${formatDateToLocale()}`)
})

eventEmitter.on('crawler:running', () => {
  console.log(`🏃 Crawler running ${formatDateToLocale()}`)
})

eventEmitter.on('crawler:done', () => {
  console.log(`🏁 Crawler done ${formatDateToLocale()}`)
})

eventEmitter.on('crawler:stopped', (event) => {
  console.log(`☠️  Crawler stopped ${formatDateToLocale()}`, event)
})